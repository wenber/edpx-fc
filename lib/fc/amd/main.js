/**
 * @file edp fc amd 命令处理主入口
 * @author Leo Wang(wangkemiao@baidu.com)
 */

var edp = require('edp-core');
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');

var fileProcessor = require('./file');

/**
 * 命令处理方法
 */
exports.process = function (args, opts) {

    if (opts.diff) {
        // 用diff处理，后接两个参数，一行一个
        require('./diff').process(args, opts);
        return;
    }

    var output = opts.output;

    // 获取目标文件
    var filePath = opts.file;
    if (filePath) {
        fileProcessor.process({
            filePath: filePath,
            output: output,
            needWrite: true
        });
        return;
    }

    var projectPath = opts.path;
    if (projectPath[0] != '~') {
        projectPath = path.resolve('.', projectPath);
    }
    try {
        var stat = fs.statSync(projectPath);
        if (stat.isFile()) {
            fileProcessor.process({
                filePath: filePath,
                output: output,
                needWrite: true
            });
            return;
        }
    }
    catch (e) {
        edp.log.error('指定的输入路径不存在！路径为：' + projectPath);
        return;
    }

    // 首先尝试读取文件夹下的 combineModules.amd，这是自动生成的
    var combinedFiles;
    try {
        combinedFiles = fs.readFileSync(projectPath + '/' + 'combinedFiles.amd', {
            encoding: 'UTF-8'
        });
        combinedFiles = combinedFiles.split('\n');
    }
    catch (e) {
        ;
    }

    if (!combinedFiles) {
        try {
            // 找到project下的moduleConf文件
            var moduleConfFile = fs.readFileSync(projectPath + '/' + 'module.conf', {
                encoding: 'UTF-8'
            });

            var moduleConf;
            moduleConf = JSON.parse(moduleConfFile);
            combinedFiles = [];
            for (var k in moduleConf.combine) {
                moduleConf.push(k);
            }
        }
        catch (e) {
            edp.log.error('不存在module.conf文件，或内容非法');
        }
    }
    
    var outFolder = projectPath + '/amd/';
    var prefix = projectPath + '/out/asset/';

    try {
        fs.rmdirSync(outFolder);
        // 生成输出文件夹
        fs.mkdirSync(outFolder);
    }
    catch (e) {
        ;
    }

    var combinedModules = {};
    for (var i = 0; i < combinedFiles.length; i++) {
        if (combinedFiles[i]) {
            var fileId = combinedFiles[i].replace(/\//g, '>') + '.amd';
            combinedModules[fileId] = fileProcessor.process({
                filePath: prefix + combinedFiles[i] + '.js',
                // output: outFolder + combinedFiles[i].replace(/\//g, '>') + '.amd',
                needWrite: false
            });
        }
    }

    // 分析
    var mainInfo = combinedModules['dependency.amd'];
    var isOk = true;
    var cleanModules = [];
    for (var k in combinedModules) {
        if (k != 'dependency.amd') {
            // 直接输出重复的模块
            var extraModules = [];
            for (var i = 0; i < combinedModules[k].length; i++) {
                if (mainInfo.indexOf(combinedModules[k][i]) > -1) {
                    extraModules.push(combinedModules[k][i]);
                }
            }
            if (extraModules.length > 0) {
                // 输出为文件
                fs.writeFileSync(
                    outFolder + k,
                    extraModules.join('\n')
                );
                isOk = false;
            }
            else {
                cleanModules.push(k)
            }
        }
        else {
            fs.writeFileSync(outFolder + 'dependency.amd', mainInfo.join('\n'));
        }
    }

    fs.writeFileSync(outFolder + 'cleanModules.amd', cleanModules.join('\n'));

    if (!isOk) {
        edp.log.error('有重复模块被打包！详情参见项目目录下的amd文件夹，dependency.amd是主依赖打包的模块信息！');
    }

};