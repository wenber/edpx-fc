/**
 * @file edp fc init命令处理主入口
 * @author Leo Wang(wangkemiao@baidu.com)
 */

var fs = require('fs');
var path = require('path');
var edp = require('edp-core');
var spawn = require('../util/spawn');
var exec = require('../util/exec');
var adder = require('../add/index');
var util = require('../util');

function processError (e) {
    console.log(e);
}

/* global exports */
exports.process = function (args, opts) {
    // 读取要初始化的path
    var currPath = args[0];

    if (!currPath) {
        currPath = '.';
    }

    // 首先调用edp project init进行初始化
    util.waitSpawn(spawn('edp', ['project', 'init', currPath]))
        .then(
            function () {
                // 添加全局主HTML
                adder.process(
                    ['mainHtml', './'], {}
                );

                // 引入fc库及相关依赖
                return util.waitSpawn(
                    spawn('edp', ['import', 'fc-core','fc-view', 'fc-ajax',
                        'moment','fc-storage', 'ef'])
                    );
            },
            function () {
                edp.log.info('调用edp project init失败！');
            }
        )
        .then(
            function () {
                /**
                 * 初始化目录结构，形成如下结构
                 * /src
                 *     /actionConf.js
                 *     /entry
                 *         /404
                 *         /500
                 *         /actionConf.js
                 *     /module
                 *         /actionConf.js
                 *     /resource
                 *         /css
                 *         /img
                 */

                // 直接添加对应的actionConf.js
                // spawn('efc', ['add', 'actionConf', currPath, '--desc=全局actionConf配置主文件']);
                // spawn('efc', ['add', 'actionConf', currPath + '/entry', '--desc=entry的actionConf配置主文件']);
                // spawn('efc', ['add', 'actionConf', currPath + '/module', '--desc=module的actionConf配置主文件']);

                // 添加全局主入口main.js
                adder.process(
                    ['mainJs', '/'],
                    {
                        desc: '项目全局主入口'
                    }
                );

                // 添加actionConf
                adder.process(
                    ['actionConf', '/'],
                    {
                        desc: '全局actionConf配置主文件'
                    }
                );

                // 添加style.less
                adder.process(
                    ['src/style.less'],
                    {
                        desc: '全局style.less配置主文件',
                        addData: true
                    }
                );

                adder.process(
                    ['actionConf', '/module'],
                    {
                        desc: 'module的actionConf配置主文件'
                    }
                );
                adder.process(
                    ['src/module/style.less'],
                    {
                        desc: 'module下的style.less'
                    }
                );
                adder.process(

                    ['actionConf', '/entry'],
                    {
                        desc: 'entry的actionConf配置主文件'
                    }
                );

                adder.process(
                    ['src/entry/style.less'],
                    {
                        desc: 'entry下的style.less'
                    }
                );

                adder.process(
                    ['util', 'debug/lib'],
                    {
                        desc: 'debug常用工具函数'
                    }
                );

                adder.process(
                    ['GET_basicInfo', 'debug/response/account'],
                    {
                        desc: '环境信息接口文件'
                    }
                );

                /* global process */
                // 添加资源存储目录
                util.create('src/resource/css', process.cwd());
                util.create('src/resource/img', process.cwd());
                // 添加404模块
                return util.waitSpawn(spawn('efc', ['add', '/src/entry/404']));
            },
            function () {
                edp.log.info('初始化fc库及其相关依赖失败！');
            }
        )
        .then(
            function () {
                // 添加500模块
                return util.waitSpawn(spawn('efc', ['add', '/src/entry/500']));

            },
            function () {
                edp.log.info('初始化404模块失败！');
            }
        )
        .then(
            function () {
                edp.log.info('初始化完成！');
            },
            function () {
                edp.log.info('初始化500模块失败！');
            }
        );

    return;
};
