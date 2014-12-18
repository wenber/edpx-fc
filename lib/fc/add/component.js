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

function addComponent (targetPath, opts) {

    // 路径进行特定模式的过滤
    // 例如 material/plan/view/mod/abc/regionArea
    // 匹配为： plan-mod-abc-region-area
    // 规则为：
    // 1. 过滤掉中间的/component/的component/
    // 2. 过滤掉中间的/view/的view/

    // 现在只需要两个东西
    // 1. 对应的component.html
    // 2. 自动指定Action
    var relativePath = path.relative(opts.basePath, targetPath);
    var componentName = relativePath
        .replace(/\/view\//, '/')
        .replace(/\/component\//, '/')
        .split('/');
    // 处理一下大写的东西
    componentName[componentName.length - 1] = util.dasherize(componentName[componentName.length - 1]);
    componentName = componentName.join('-');

    var tplData = util.extend({
        desc: opts.desc || ('`' + componentName + '`'),
        componentName: componentName,
    });

    var pos = relativePath.lastIndexOf('/');
    var fileName;
    if (pos > 0) {
        fileName = relativePath.substring(pos + 1);
        relativePath = relativePath.substring(0, pos + 1);
    }
    else {
        fileName = relativePath;
        relativePath = './';
    }

    tplData.actionPath = relativePath + util.pascalize(fileName);

    // 目录确定后，准备输出
    var toWrite = [];
    targetPath = targetPath.replace(new RegExp(fileName + '/?$', 'g'), '');
    util.checkExsit(targetPath + fileName + '.component.html', opts.force).then(
        function () {
            // 模块主文件
            var fileList = [
                fileName + '.component.html',
                util.pascalize(fileName) + '.js'
            ];

            fileList.forEach(function (item) {
                var itemName;
                if (item.indexOf('component.html') > -1) {
                    itemName = 'component';
                }
                else {
                    itemName = 'Action';
                }
                var toWriteFile = new FileItem({
                    path: path.resolve(targetPath, item),
                    data: util.getToWriteData(
                        path.resolve(__dirname, './tpl/component/' + itemName + '.tpl'),
                        tplData
                    )
                });

                toWrite.push(toWriteFile);
            });

            toWrite.forEach(function (eachFile) {
                eachFile.write();
            });
        },
        function () {}
    );
}

module.exports = exports.process = addComponent;