/**
 * @file edp fc init命令处理主入口
 * @author Leo Wang(wangkemiao@baidu.com)
 */

var util = require('../util');

/**
 * 命令处理方法
 */
exports.process = function (args, opts) {
    // 获取命令，例如edp fc init mvc 中的mvc
    var command = args[0];
    if (!command) {
        errorCommand();
        return;
    }

    try {
        var processor = require('./' + command);
        processor.process(opts);
    } catch (e) {
        console.log(e.stack);
    }
};

function errorCommand () {
    util.logger.log(util.logger.red(
        '错误的命令！你应当使用正确的第三级命令以标明初始化类型。'
    ));
    util.logger.log('使用 edp fc init --help 以获取帮助。');
};