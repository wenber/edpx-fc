/**
 * @file 文件类
 * @author Leo Wang(leowang721@gmail.com)
 */

var fs = require('fs');
var path = require('path');
var edp = require('edp-core');
var mkdirp = require('mkdirp');

function FileItem (opts) {
    var filePath = opts.path || '';
    // 如果是用户路径
    if (filePath.indexOf('~/') == 0) {
        filePath = filePath.replace(/^~/, process.env.HOME);;
    }

    this.path = filePath;  // 文件路径

    // 直接处理fileName、extName
    var extName = path.extname(filePath);
    var fileName = path.basename(filePath, extName);
    this.fileName = fileName;   // 文件名（无后缀名）
    this.extName = extName.substring(1);  // 后缀名

    this.encoding = opts.encoding || 'UTF-8';
    this.data = opts.data || '';
}

FileItem.prototype.read = function() {
    var me = this;
    me.originalData = fs.readFileSync(me.path, {
        encoding: me.encoding
    });
    me.data = me.originalData;
};

FileItem.prototype.write = function () {
    var me = this;

    mkdirp.sync(edp.path.dirname(me.path));
    fs.writeFileSync(me.path, me.data, {
        encoding: me.encoding
    });
};

module.exports = exports = FileItem;