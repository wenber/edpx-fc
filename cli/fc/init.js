/**
 * @file edp fc initMVC
 * @author Leo Wang(wangkemiao@baidu.com)
 */

exports.cli = {
    description: '在当前目录下进行符合凤巢性质的项目初始化工作',
    options: ['force'],
    main: function (args, opts) {
        require('../../lib/fc/init').process(args, opts);
    }
};