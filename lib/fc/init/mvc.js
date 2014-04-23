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
        desc: opts.desc || ''
    };

    // 处理with的命令
    name.withEF = opts.hasOwnProperty('with-ef');

    // 处理前缀，如果有前缀，则文件名会有变化
    var prefix = opts.prefix || '';
    if (prefix) {
        // 先转换为首字母大写和小写各一份
        var bPrefix = prefix.charAt(0).toUpperCase() + prefix.substring(1);
        var sPrefix = prefix.charAt(0).toLowerCase() + prefix.substring(1);
        name.action = bPrefix + name.action;
        name.model = bPrefix + name.model;
        name.view = bPrefix + name.view;
        name.tpl = sPrefix;
        name.style = sPrefix;
    }

    // 根据当前路径确定namespace
    var currPath = path.resolve('.').toString();
    // namespace的起点是src
    var namespace = currPath;
    var pos = namespace.indexOf('src');
    if (pos > -1) {
        namespace = namespace.substring(pos + 4);
    }

    // 配置template名称
    if (opts.template) {
        name.template = opts.template;
    } else {
        // 根据namespace计算template
        var tarr = namespace.split(PATH_SEPRATE);
        tarr.map(function (v) {
            return v.charAt(0).toLowerCase() + v.substring(1);
        });
        name.template = tarr.join('-');
    }

    // 创建相应的文件
    // 逐个创建

    // action
    var render = etpl.compile(tpl.action);
    fs.writeFileSync(
        currPath + '/' + name.action + '.js',
        render(name)
    );

    // model
    var render = etpl.compile(tpl.model);
    fs.writeFileSync(
        currPath + '/' + name.model + '.js',
        render(name)
    );

    // view
    var render = etpl.compile(tpl.view);
    fs.writeFileSync(
        currPath + '/' + name.view + '.js',
        render(name)
    );

    // tpl
    fs.writeFileSync(
        currPath + '/' + name.tpl + '.tpl',
        tpl.tpl.replace('${template}', name.template)
    );

    // style
    var render = etpl.compile(tpl.style);
    fs.writeFileSync(
        currPath + '/' + name.style + '.less',
        render(name)
    );
};