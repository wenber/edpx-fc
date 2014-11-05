
var fileProcessor = require('./file');

exports.process = function (args, opts) {
    var toCompare = fileProcessor.read(args[0]);
    var toDiff = fileProcessor.read(opts.diff);

    if (!toCompare || !toDiff) {
        return;
    }

    var compareData = toCompare.data.split('\n');
    var diffData = toDiff.data.split('\n');

    var extraList = [];

    compareData.forEach(function (item) {
        if (diffData.indexOf(item) > -1) {
            extraList.push(item);
        }
    });

    console.log(toCompare.name + '共计模块：' + compareData.length);
    console.log(toDiff.name + '共计模块：' + diffData.length);
    console.log('共计：' + extraList.length);
    extraList.forEach(function (item) {
        console.log('\t' + item);
    });
};