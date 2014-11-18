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

function processError (e) {
    console.log(e)
}

exports.process = function (args, opts) {
    // 读取要初始化的path
    var currPath = args[0];

    if (!currPath) {
        currPath = '.';
    }



    // 首先调用edp project init进行初始化
    spawn('edp', ['project', 'init', currPath]).on('close', function (code) {
        if (code !== 0) {
            console.log('edp process exited with code ' + code);
        }

        // 添加全局主HTML
        adder.process(
            ['mainHtml', './'], {}
        );

        // 引入fc库及相关依赖
        spawn('edp', ['import', 'fc']).on('close', function (code) {
            if (code !== 0) {
                console.log('fc import process exited with code ' + code);
            }

            /**
             * 初始化目录结构，形成如下结构
             * /src
             *     /actionConf.js
             *     /entry
             *         /404
             *         /actionConf.js
             *     /module
             *         /actionConf.js
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
            adder.process(
                ['actionConf', '/module'],
                {
                    desc: 'module的actionConf配置主文件'
                }
            );
            adder.process(
                ['actionConf', '/entry'],
                {
                    desc: 'entry的actionConf配置主文件'
                }
            );

            // 添加404模块
            spawn('efc', ['add', '/entry/404']).on('close', function (code) {
                if (code !== 0) {
                    console.log('add404 process exited with code ' + code);
                }
                edp.log.info('初始化完成！');
            });
        });
    });

    return;
};