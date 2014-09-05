/**
 * @file edp fc timeline
 * @author Leo Wang(wangkemiao@gmail.com)
 */

exports.cli = {
    description: 'chrome的timeline数据分析，分析速度，凤巢专用',
    options: ['file:', 'folder:'],
    main: function (args, opts) {
        require('../../lib/fc/timeline').process(args, opts);
    }
};