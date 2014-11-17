/**
 * @file 添加一个文件
 * @author Leo Wang(leowang721@gmail.com)
 */


var fs = require('fs');
var path = require('path');
var util = require('../util');
var spawn = require( '../util/spawn' );

var tplData = {};

function createFileFromTpl (filePath, currData) {
    var toWriteFile = {
        path: path.resolve(filePath),
        data: util.getToWriteData(
            path.resolve(__dirname, './tpl/file/' + currData.extName + '.tpl'),
            util.extend(currData, tplData[currData.extName])
        )
    };

    if (currData.extName == 'tpl') {
        var moduleName = path.dirname(currData.modulePath) === '.'
            ? ''
            : path.dirname(currData.modulePath).replace(/^\.\//g, '')

        if (moduleName) {
            moduleName += '/';
        }

        toWriteFile.data = '<!-- target: '
            + moduleName + currData.fileName
            + ' -->\n'
            + toWriteFile.data;
    }
    util.writeFiles([toWriteFile]);
}

function createEmptyFile (filePath) {
    util.writeFiles([{
        path: path.resolve(filePath),
        data: '\n'
    }]);
}

exports.process = function (args, opts) {
    // 读取文件名称
    var fileInfoArg = args[0];
    if (!fileInfoArg) {
        edp.log.error('你需要指定待添加的模块/文件的路径，see efc add --help');
        return;
    }

    /*
     * edp项目信息
     * @type {Object}
     * {
     *     dir: '/Users/leowang/work/svn/fc-fe/workspace/nirvana-workspace/nirvana',
     *     infoDir: '/Users/leowang/work/svn/fc-fe/workspace/nirvana-workspace/nirvana/.edpproj'
     * }
     */
    var projectInfo = require('edp-project').getInfo();

    // 文件是基于当前路径的，但是可以也可以以绝对路径的形式添加
    // 如果是相对路径，则以当前路径为起点
    var basePath = path.resolve(process.env.PWD);

    var filePath = fileInfoArg;
    // 如果是用户路径
    if (filePath.indexOf('~/') == 0) {
        filePath = filePath.replace(/^~/, process.env.HOME);;
    }
    filePath = path.resolve(basePath, filePath);

    var fileName = path.basename(filePath);
    var extName = path.extname(fileName);
    fileName = path.basename(fileName, extName);
    extName = extName.substring(1);

    var modulePath = '';
    // 只有在edp project中才有用
    if (projectInfo) {
        modulePath = path.relative(
            path.resolve(projectInfo.dir, 'src/'),
            filePath
        );
    }

    switch (extName) {
        case 'js':
        case 'html':
            // 直接使用edp add
            var theArgs = process.argv.slice(4);
            var argv = ['add', extName].concat(theArgs);
            spawn('edp', argv);
            break;
        case 'css':
        case 'less':
        case 'tpl':
            util.checkExsit(modulePath, opts.force).then(function () {
                createFileFromTpl(filePath, {
                    extName: extName,
                    fileName: fileName,
                    modulePath: modulePath
                });
            }, function () {});
            break;
        default:
            util.checkExsit(modulePath, opts.force).then(function () {
                createEmptyFile(filePath);
            }, function () {});
            break;
    }
};