/**
 * @file edp fc start 子命令
 * @author Leo Wang(wangkemiao@baidu.com)
 */

var fs = require('fs');
var edp = require('edp-core');
var spawn = require('../../lib/fc/util/spawn');

var cli = {};

cli.description = '在当前目录下启动webserver';

cli.options = ['port:'];

cli.main = function (args, opts) {
    // 直接调用edp webserver
    var port = opts.port || 8848;
    spawn('edp', ['webserver', 'start', '--port=' + port]);
    require('../../lib/fc/start').openBrowser(port);
};

/* global exports */
exports.cli = cli;
