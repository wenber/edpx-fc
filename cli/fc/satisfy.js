/**
 * @file edp fc satisfy
 * @author Leo Wang(wangkemiao@gmail.com)
 */

var edp = require('edp-core');
exports.cli = {
    description: 'chrome的satisfy数据分析，分析速度，凤巢专用 -p -m',
    options: ['path:', 'match:'],
    main: function (args, opts) {
        console.log(edp.path.satisfy(opts.path, opts.match));
    }
};