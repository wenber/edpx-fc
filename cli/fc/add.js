/**
 * @file edp fc add 子命令
 * @author Leo Wang(wangkemiao@baidu.com)
 */

var fs = require('fs');
var edp = require('edp-core');

var cli = {};

cli.description = '添加一个模块，同时自动初始化需要的文件';

cli.options = ['force', 'desc:', 'entry'];

cli.main = function (args, opts) {

    // 检查当前是否是一个edp project的根目录
    var projectInfo = require('edp-project').getInfo();
    if (!projectInfo) {
        edp.log.warn('你正在一个非edp project目录中运行命令，添加行为在当前目录处理！');
    }

    require('../../lib/fc/add').process(args, opts);
};

exports.cli = cli;