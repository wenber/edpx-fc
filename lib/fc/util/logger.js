/**
 * @file simple log
 * @author Leo Wang(wangkemiao@baidu.com)
 */

/**
 * 打印一行日志
 */
exports.log = function (msg) {
    console.log(msg);
};

/**
 * 返回红色文字转意字符串
 * @param {string} msg
 */
exports.red = function (msg) {
    return '\033[31m' + msg + '\033[39m';
};

/**
 * 返回绿色文字转意字符串
 * @param {string} msg
 */
exports.green = function (msg) {
    return '\033[32m' + msg + '\033[39m';
};
/**
 * 返回黄色文字转意字符串
 * @param {string} msg
 */
exports.yellow = function (msg) {
    return '\033[33m' + msg + '\033[39m';
};
/**
 * 返回蓝色文字转意字符串
 * @param {string} msg
 */
exports.blue = function (msg) {
    return '\033[34m' + msg + '\033[39m';
};
/**
 * 返回白色文字转意字符串
 * @param {string} msg
 */
exports.white = function (msg) {
    return '\033[37m' + msg + '\033[39m';
};
/**
 * 返回黑色文字转意字符串
 * @param {string} msg
 */
exports.black = function (msg) {
    return '\033[30m' + msg + '\033[39m';
};
