var timeline = require('edpx-timeline');
exports.process = function (file) {
    var absData = timeline.pageLoading.process(null, {
        file: file,
        silent: true
    });
    return absData;
};