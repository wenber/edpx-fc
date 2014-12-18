/**
 * @file edp fc satisfy
 * @author Leo Wang(wangkemiao@gmail.com)
 */

var edp = require('edp-core');
exports.cli = {
    description: '读文件获取module信息，排序后，写入.amd文件',
    options: ['file:', 'path:', 'output:', 'diff:'],
    main: function (args, opts) {
        require('../../lib/fc/amd/main').process(args, opts);
    }
};