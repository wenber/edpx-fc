/**
 * @file 添加一个文件
 * @author Leo Wang(leowang721@gmail.com)
 */


var fs = require('fs');
var path = require('path');
var util = require('../util');
var spawn = require('../util/spawn');
var FileItem = require('../util/FileItem');

var typeObj = {
    Action: 'Action.js',
    View: 'View.js',
    Model: 'Model.js',
    Entry: 'Entry.js',
    actionConf: 'actionConf.js',
    tpl: 'tpl.html',
    style: 'style.less',
    mainJs: 'main.js',
    mainHtml: 'main.html'
};

function postProcess (type, data) {
    switch (type) {
        case 'actionConf':
            // 需要更新上级引用
            require('../util/syntax/autoRequireActionConf').process(data.path);
            break;
        case 'style':
            // 更新上级样式引用
            require('../util/syntax/autoImportStyle').process(data.path);
            break;
    }
}

function addFile (targetPath, opts) {

    var file = new FileItem({
        path: targetPath
    });

    var modulePath = path.relative(
        opts.basePath,
        targetPath
    );
    var moduleName = modulePath.replace(
        new RegExp('.' + file.extName + '$', 'g'), ''
    );
    var className = moduleName.split('/').map(function (item) {
        return item.charAt(0).toLowerCase() + item.substring(1);
    }).join('-');
    var tplData = util.extend({
        desc: opts.desc || '[please input description]',
        moduleName: moduleName,
        className: className
    }, file);

    // 如果指定了类型，直接用module的模板就行了
    if (opts.type) {
        if (opts.type in typeObj) {
            file.data = util.getToWriteData(
                path.resolve(__dirname, './tpl/module/' + opts.type + '.tpl'),
                tplData
            );
        }
        else {
            file.data = util.getToWriteData(
                path.resolve(__dirname, '../init/file/util.tpl'),
                tplData
            );
        }
    }
    // 否则，进行后缀名匹配
    else {
        switch (file.extName) {
            case 'html':
                // 直接使用edp add
                var argv = ['add', file.extName, file.path].concat(
                    process.argv.slice(5)
                );
                spawn('edp', argv);
                return;
            case 'js':
            case 'css':
            case 'less':
            case 'tpl':
                file.data = util.getToWriteData(
                    path.resolve(
                        __dirname,
                        './tpl/file/' + file.extName + '.tpl'
                    ),
                    tplData
                );
                break;
            default:
                break;
        }
    }
    util.checkExsit(file.path, opts.force)
    .then(
        function () {
            file.write();
            // 如果是添加指定类型的文件，还需要进行后置处理
            if (opts.addData) {
                opts.type = 'style';
            }
            if (opts.type || opts.addData) {
                postProcess(opts.type, tplData);
            }
        },
        function () { }
    );

}

module.exports = exports = addFile;