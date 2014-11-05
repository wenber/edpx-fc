/**
 * @file edp fc amd 命令处理主入口
 * @author Leo Wang(wangkemiao@baidu.com)
 */

var edp = require('edp-core');
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');

exports.read = function (filePath) {
    // 获取目标文件
    if (!filePath) {
        edp.log.error('必须指定一个输入文件！');
        return;
    }

    if (filePath[0] != '~') {
        filePath = path.resolve('.', filePath);
    }

    if (!fs.existsSync(filePath)) {
        edp.log.error('指定的输入文件不存在！路径为：' + filePath);
        return;
    }
    var fileName = filePath.split('/');
    fileName = fileName[fileName.length - 1];

    var fileData = fs.readFileSync(filePath, {
        encoding: 'UTF-8'
    });

    return {
        name: fileName,
        data: fileData
    }
}

/**
 * 命令处理方法
 */
exports.process = function (opts) {
    var filePath = opts.filePath;
    var outputPath = opts.output;
    
    var fileInfo = exports.read(filePath);
    if (!fileInfo) {
        return;
    }

    var fileName = fileInfo.name;
    var fileData = fileInfo.data;

    var lines = fileData.split('\n');
    var mods = [];
    lines.forEach(function (eachLine, index) {
        var result = /define\(\'([\w\/]+)\'/g.exec(eachLine);
        if (result && result[1]) {
            mods.push(result[1]);
        }
    });

    mods.sort(function (a, b) {
        return a.localeCompare(b);
    });

    if (opts.needWrite) {
        if (!outputPath) {
            outputPath = fileName + '.amd';
        }

        fs.writeFileSync(outputPath, mods.join('\n'));
    }

    return mods;
};