/**
 * @file 添加一个模块，同时自动初始化需要的文件
 * @author Leo Wang(leowang721@gmail.com)
 */

var fs = require('fs');
var path = require('path');
var edp = require('edp-core');
var util = require('../util');
var FileItem = require('../util/FileItem');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var SYNTAX = estraverse.Syntax;

function addModule (targetPath, opts) {

    var moduleName = path.relative(opts.basePath, targetPath);
    var className = moduleName.split('/').map(function (item) {
        return item.charAt(0).toLowerCase() + item.substring(1);
    }).join('-');

    var tplData = util.extend({
        desc: opts.desc || ('模块 `' + moduleName + '`'),
        moduleName: moduleName,
        className: className
    });

    // 目录确定后，准备输出
    var toWrite = [];
    util.checkExsit(targetPath, opts.force).then(
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
                var toWriteFile = new FileItem({
                    path: path.resolve(targetPath, item),
                    data: util.getToWriteData(
                        path.resolve(__dirname, './tpl/module/' + itemName + '.tpl'),
                        tplData
                    )
                });

                if (itemName == 'tpl') {
                    toWriteFile.data = [
                        '<!-- target: ' + tplData.className + ' -->',
                        toWriteFile.data
                    ].join('\n');
                }
                toWrite.push(toWriteFile);
            });

            // actionConf文件
            var actionConfPath = path.resolve(targetPath, 'actionConf.js');
            toWrite.push(new FileItem({
                path: actionConfPath,
                data: util.getToWriteData(
                    path.resolve(__dirname, './tpl/module/moduleActionConf.tpl'),
                    tplData
                )
            }));

            toWrite.forEach(function (eachFile) {
                eachFile.write();
            });

            // 自动注册上级的actionConf文件
            require('../util/syntax/autoRequireActionConf').process(
                actionConfPath
            );
        },
        function () {}
    );
}

module.exports = exports.process = addModule;