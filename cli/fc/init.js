/**
 * @file edp fc initMVC
 * @author Leo Wang(wangkemiao@baidu.com)
 */

exports.cli = {
    description: '在当前目录下初始化符合ER的MVC要素文件',
    options: ['mvc', 'prefix:', 'template:', 'with-ef:'],
    main: function (args, opts) {
        require('../../lib/fc/init').process(args, opts);
    }
};