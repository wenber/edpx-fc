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

exports.process = function (args, opts) {
    // 读取module名称
    var moduleName = args[0];
    if (!moduleName) {
        edp.log.error('你需要指定待添加的模块的路径，see efc add --help');
        return;
    }

    // 如果是添加文件
    if (/\w+\.\w+$/g.test(moduleName)
        && !/\/$/.test(moduleName)) {  // 如果以 / 结尾，则是个模块
        require('./file').process(args, opts);
    }
    // 添加模块
    else {
        require('./module').process(args, opts);
    }
};