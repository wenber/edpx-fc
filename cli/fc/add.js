/**
 * @file edp fc add 子命令
 * @author Leo Wang(wangkemiao@baidu.com)
 */

var fs = require('fs');
var edp = require('edp-core');

var cli = {};

cli.description = '添加一个项目需要的文件或模块';

cli.options = ['desc:', 'force', 'entry'];

cli.main = function (args, opts) {

    // 检查当前是否是一个edp project的根目录
    var projectInfo = require('edp-project').getInfo();
    if (!projectInfo) {
        edp.log.error('Sorry，此命令只能在edp project中使用！');
        return;
    }

    require('../../lib/fc/add').process(args, opts);
};

exports.cli = cli;