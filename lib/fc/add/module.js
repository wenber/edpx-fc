/**
 * @file 添加一个模块，同时自动初始化需要的文件
 * @author Leo Wang(leowang721@gmail.com)
 */

var fs = require('fs');
var path = require('path');
var edp = require('edp-core');
var util = require('../util');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var SYNTAX = estraverse.Syntax;

function autoRegisterActionConf(tplData) {
    // search
    var targetPath = tplData.modulePath + '/actionConf.js';

    while (path.dirname(targetPath) != tplData.basePath) {
        targetPath = path.resolve(path.dirname(targetPath), '../actionConf.js');

        if (fs.existsSync(targetPath)) {
            // 修改之，增加当前module的配置
            var ast = util.getAst(fs.readFileSync(targetPath, {
                encoding: 'UTF-8'
            }));

            estraverse.traverse(ast, {
                enter: function (node) {
                    if (node.type == SYNTAX.CallExpression
                        && node.callee.name == 'define') {

                        // 先找到要修改的节点
                        var returnNodeInfo = null;
                        estraverse.traverse(node, {
                            enter: function (currentNode) {
                                if (currentNode.type === SYNTAX.ReturnStatement) {
                                    returnNodeInfo = currentNode;
                                    this.break;
                                }
                            }
                        });

                        var toUsePath = path.relative(
                            path.dirname(targetPath),
                            path.resolve(tplData.modulePath, 'actionConf')
                        );
                        if (!/^\./.test(toUsePath)) {
                            toUsePath = './' + toUsePath;
                        }
                        switch (returnNodeInfo.argument.type) {
                            case SYNTAX.Identifier:
                                // 找到对应的声明
                                estraverse.traverse(node, {
                                    enter: function (currentNode) {
                                        if (currentNode.type === SYNTAX.VariableDeclarator
                                            && currentNode.id.name === returnNodeInfo.argument.name) {

                                            addParentRequireCode(currentNode.init.elements, toUsePath);
                                            this.break;
                                        }
                                    }
                                });
                                this.break;
                                break;
                            case SYNTAX.ArrayExpression:
                                addParentRequireCode(returnNodeInfo.argument.elements, toUsePath);
                                returnNodeInfo.argument.elements.push(
                                    util.getAst('require(\'' + toUsePath + '\')').body[0].expression
                                );
                                this.break;
                                break;
                        }
                    }
                }
            });

            escodegen.attachComments(ast, ast.comments, ast.tokens);
            var code = escodegen.generate(ast, {
                comment: true
            });

            fs.writeFileSync(targetPath, code, {
                encoding: 'UTF-8'
            });

            break;
        }
    }
}

function addParentRequireCode(elements, path) {
    var existed = elements.some(function (item) {
        if (item.type === SYNTAX.CallExpression
            && item.callee.name === 'require'
            && item.arguments[0].value === path) {
            return true;
        }
    });
    if (!existed) {
        elements.push(
            util.getAst('require(\'' + path + '\')').body[0].expression
        );
    }
}

exports.process = function (args, opts) {
    // 读取module名称
    var moduleName = args[0];
    if (!moduleName) {
        edp.log.error('你需要指定待添加的模块/文件的路径，see efc add --help');
        return;
    }

    /*
     * edp项目信息
     * @type {Object}
     * {
     *     dir: '/Users/leowang/work/svn/fc-fe/workspace/nirvana-workspace/nirvana',
     *     infoDir: '/Users/leowang/work/svn/fc-fe/workspace/nirvana-workspace/nirvana/.edpproj'
     * }
     */
    var projectInfo = require('edp-project').getInfo();

    // 如果是相对路径，则以当前路径为起点
    var basePath = path.resolve(process.env.PWD);
    var modulePath = moduleName;
    // 如果是绝对路径，则默认以项目目录下的src为起点
    if (moduleName.charAt(0) === '/' && projectInfo) {
        basePath = path.resolve(projectInfo.dir, 'src/');
        modulePath = '.' + modulePath;
    }
    modulePath = path.resolve(basePath, modulePath);

    var fixedModuleName = moduleName.replace(/^\.?\/+/, '');
    var className = fixedModuleName.split('/').join('-');
    var tplData = {
        basePath: basePath,
        modulePath: modulePath,
        desc: opts.desc || ('模块 `' + fixedModuleName + '`'),
        className: className,
        moduleName: fixedModuleName,
        tplName: className
    };

    // 目录确定后，准备输出
    var toWrite = [];
    util.checkExsit(modulePath, opts.force).then(
        function () {

            // 模块主文件
            var fileList = [
                'Action.js', 'Model.js', 'View.js',
                'tpl.html', 'style.less'
            ];

            if (opts.entry) {
                fileList.push('Entry.js');
            }

            fileList.forEach(function (item) {
                var itemName = item.replace(/\.\w+$/g, '');
                var toWriteFile = {
                    path: path.resolve(modulePath, item),
                    data: util.getToWriteData(
                        path.resolve(__dirname, './tpl/module/' + itemName + '.tpl'),
                        tplData
                    )
                };

                if (itemName == 'tpl') {
                    toWriteFile.data = [
                        '<!-- target: ' + tplData.tplName + ' -->',
                        toWriteFile.data
                    ].join('\n');
                }
                toWrite.push(toWriteFile);
            });

            // actionConf文件
            toWrite.push({
                path: path.resolve(modulePath, 'actionConf.js'),
                data: util.getToWriteData(
                    path.resolve(__dirname, './tpl/module/actionConf.tpl'),
                    tplData
                )
            });

            // 自动注册上级的actionConf文件
            autoRegisterActionConf(tplData);

            util.writeFiles(toWrite);
        },
        function () {}
    );
};