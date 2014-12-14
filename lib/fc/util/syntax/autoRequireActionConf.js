/**
 * @file 语义分析处理 - 自动注册当前actionConf的父级require
 * @author Leo Wang(leowang721@gmail.com)
 */

var fs = require('fs');
var path = require('path');
var edp = require('edp-core');
var util = require('../index');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var SYNTAX = estraverse.Syntax;

function autoRequireActionConf (currPath) {
    /*
     * edp项目信息
     * @type {Object}
     * {
     *     dir: '/Users/leowang/work/svn/fc-fe/workspace/nirvana-workspace/nirvana',
     *     infoDir: '/Users/leowang/work/svn/fc-fe/workspace/nirvana-workspace/nirvana/.edpproj'
     * }
     */
    var projectInfo = require('edp-project').getInfo();

    // 首先找到祖先目录中最近的actionConf
    var parentPath = path.resolve(path.dirname(currPath), '../');
    var found = false;
    var targetPath;

    if (parentPath == projectInfo.dir) {  // src路径，不需要处理
        return;
    }

    while (parentPath != projectInfo.dir) {
        targetPath = path.resolve(parentPath, 'actionConf.js');
        if (fs.existsSync(targetPath)) {
            found = true;
            break;
        }
        parentPath = path.dirname(parentPath);
    }

    if (!found) {
        edp.log.warn('自动更新当前actionConf的父级require失败，没有找到父级的actionConf.js！');
        return;
    }

    // 找到了，解析，并修改之，增加当前module的配置
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
                    currPath.replace(/\.js$/g, '')
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

    edp.log.warn('已经自动更新了`' + targetPath + '`，请知晓！');
}


function addParentRequireCode(elements, path) {
    if (!Array.isArray(elements)) {
        edp.log.warn('自动添加父级对当前模块的引用失败！请检查父级actionConf代码并手动添加！');
        return;
    }
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

exports.process = autoRequireActionConf;