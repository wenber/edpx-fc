/**
 * @file edp fc init mvc 在当前目录下初始化符合er格式的mvc要素文件
 * @author Leo Wang(wangkemiao@baidu.com)
 */

var fs = require('fs');
var path = require('path');
var etpl = require('etpl');
var edpConfig = require('edp-config');

var PATH_SEPRATE = /\/|\\/g;

function getTpl(tpath) {
    return fs.readFileSync(path.resolve(__dirname, tpath)).toString();
}

// 读入模板
var tpl = {
    action: getTpl('./tpl/action.tpl'),
    model: getTpl('./tpl/model.tpl'),
    view: getTpl('./tpl/view.tpl'),
    tpl: getTpl('./tpl/tpl.tpl'),
    style: getTpl('./tpl/style.less')
};

exports.process = function (opts) {

    var name = {
        action: 'Action',
        model: 'Model',
        view: 'View',
        tpl: 'tpl',
        style: 'style',
        author: edpConfig.get('user.name')
            + ' (' + edpConfig.get('user.email') + ')',
        desc: opts.desc || '',
        // 处理with的命令
        withEF: opts.hasOwnProperty('with-ef')
    };

    // 根据当前路径确定namespace
    var currPath = path.resolve('.').toString();
    // namespace的起点是src
    var namespace = currPath;
    var pos = namespace.indexOf('src');
    if (pos > -1) {
        namespace = namespace.substring(pos + 4);
    }
    // 整理为src之后的文件夹数组
    namespace = namespace.split(PATH_SEPRATE);
    namespace.map(function (v) {
        return v.charAt(0).toLowerCase() + v.substring(1);
    });

    // 配置template名称
    name.template = opts.template || namespace.join('-');

    // 处理前缀导致的文件名变化
    var prefix = opts.prefix || '';
    var spaceName = namespace[namespace.length - 1];
    spaceName = spaceName.charAt(0).toUpperCase() + spaceName.substring(1);

    // 先转换为首字母大写和小写各一份
    var bPrefix = prefix ? (prefix.charAt(0).toUpperCase() + prefix.substring(1)) : '';
    var sPrefix = prefix ? (prefix.charAt(0).toLowerCase() + prefix.substring(1)) : '';
    name.action = bPrefix + name.action;
    name.model = bPrefix + name.model;
    name.view = bPrefix + name.view;
    name.tpl = sPrefix || 'tpl';
    name.style = sPrefix || 'style';
    name.namespace = spaceName;

    // 创建相应的文件
    // 逐个创建

    // action
    var render = etpl.compile(tpl.action);
    fs.writeFileSync(
        currPath + '/' + (opts.prefix ? name.action : 'Action') + '.js',
        render(name)
    );

    // model
    var render = etpl.compile(tpl.model);
    fs.writeFileSync(
        currPath + '/' + (opts.prefix ? name.model : 'Model') + '.js',
        render(name)
    );

    // view
    var render = etpl.compile(tpl.view);
    fs.writeFileSync(
        currPath + '/' + (opts.prefix ? name.view : 'View') + '.js',
        render(name)
    );

    // tpl
    fs.writeFileSync(
        currPath + '/' + (opts.prefix ? name.tpl : 'tpl') + '.html',
        tpl.tpl.replace('${template}', name.template)
    );

    // style
    var render = etpl.compile(tpl.style);
    fs.writeFileSync(
        currPath + '/' + (opts.prefix ? name.style : 'style') + '.less',
        render(name)
    );
};