/**
 * @file server start
 * @author Ming Liu(wenbo.fe@gmail.com)
 */

/* global exports */
var childProcess = require('child_process');

/**
 * 启动默认浏览器
 * @param  {number} port 端口号
 * @public
 */
function openBrowser(port) {
    var cmd = '';
    var url = 'http://127.0.0.1:';
    /* global process */
    if (process.platform === 'wind32') {
        cmd  = 'start "%ProgramFiles%\Internet Explorer\iexplore.exe"';
    }
    else if (process.platform === 'linux') {
        cmd  = 'xdg-open';
    }
    else if (process.platform === 'darwin') {
        cmd  = 'open';
    }
    childProcess.exec(cmd + ' "' + url + '"' + port);
}

exports.openBrowser = openBrowser;
