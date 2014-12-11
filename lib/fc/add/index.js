/**
 * @file 添加一个模块，同时自动初始化需要的文件
 * @author Leo Wang(leowang721@gmail.com)
 */

var fs = require('fs');
var path = require('path');
var edp = require('edp-core');

exports.process = function (args, opts) {

    /*
     * edp项目信息
     * @type {Object}
     * {
     *     dir: '/Users/leowang/work/svn/fc-fe/workspace/nirvana-workspace/nirvana',
     *     infoDir: '/Users/leowang/work/svn/fc-fe/workspace/nirvana-workspace/nirvana/.edpproj'
     * }
     */
    var projectInfo = require('edp-project').getInfo();

    var typeMapper = {
        Action: 'Action.js',
        View: 'View.js',
        Model: 'Model.js',
        actionConf: 'actionConf.js',
        tpl: 'tpl.html',
        style: 'style.less',
        mainJs: 'main.js',
        mainHtml: 'main.html',
        component: 1
    };

    // 目标路径
    var targetPath;
    // 当前支持三种类型，先区分
    // 首先判断是否是子级命令 例如：efc add actionConf <targetPath>
    // component也在这里
    if (args.length >= 2 && typeMapper[args[0]]) {
        opts.type = args[0];
        if (opts.type == 'component') {
            targetPath = args[1];
        }
        else {
            targetPath = args[1] + '/' + typeMapper[args[0]];
        }
    }
    // 否则应该是 efc add sth.js 或者 efc add sth
    else {
        targetPath = args[0];
    }

    // 基础路径
    var basePath = process.env.PWD;  // 默认先取当前路径
    if (/^\/+/g.test(targetPath)) {
        // 如果是绝对路径，则基础路径为项目根目录 + src/
        basePath = path.resolve(projectInfo.dir, 'src/');
        targetPath = targetPath.replace(/^\/+/g, '');
    }

    opts.basePath = basePath;
    targetPath = path.resolve(basePath, targetPath);

    var isModule = !(/\w+\.\w+$/.test(targetPath)) || /\/$/.test(targetPath);

    if (opts.type === 'component') {
        // 基础路径依然需要是src
        opts.basePath = path.resolve(projectInfo.dir, 'src/');
        require('./component')(targetPath, opts);
    }
    else if (isModule) {
        // 基础路径依然需要是src
        opts.basePath = path.resolve(projectInfo.dir, 'src/');
        require('./module')(targetPath, opts);
    }
    else {
        require('./file')(targetPath, opts);
    }
};