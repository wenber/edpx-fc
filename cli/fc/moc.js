/**
 * @file edpx扩展 moc服务
 * @author Ming Liu(liuming07@baidu.com)
 */


var fs = require('fs');
var edp = require('edp-core');

/* global exports */
exports.cli = {
    description: 'edpx扩展 moc服务',
    options: [],
    main: function (args, opts) {
        // 检查当前是否是一个edp project的根目录
        var projectInfo = require('edp-project').getInfo();
        if (!projectInfo) {
            edp.log.error('Sorry，此命令只能在edp project中使用！');
            return;
        }

        require('../../lib/fc/moc').process(args, opts);
    }
};
