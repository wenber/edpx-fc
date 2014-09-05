/**
 * @file edp fc timeline命令处理主入口
 * @author Leo Wang(wangkemiao@baidu.com)
 */

var path = require('path');
var fs = require('fs');
var edp = require('edp-core');
var timeline = require('edpx-timeline');

/**
 * 命令处理方法
 */
exports.process = function (args, opts) {
    var result = require('./read').process(args, opts);
    if (Array.isArray(result)) {
        dumpToConsoleList(result, {
            simpleTimeline: true
        });
        // dumpToFile('simpleTimeline.json', result)
        // console.log(result[0].absData.resourceLoadInfo)
        // result[0].absData.resourceLoadInfo.dumpToConsole();
    }
    else {
        dumpToConsoleSingle(result);

    }
};


function dumpToConsoleSingle(data, options) {

    options = options || {};

    var isSimpleTimeline = !!options.simpleTimeline;

    console.log('UA is ' + data.absData.uaData);

    console.log('入口HTML为：' + data.absData.entryHtmlInfo.result.detail.data.url);

    if (isSimpleTimeline) {
        data.simpleTimeline.forEach(function (item) {
            console.log(item.time + '：' + item.desc);
        });
    }
    else {
        data.absData.entryHtmlInfo.result.dumpToConsole();
        data.absData.pageEventInfo.dumpToConsole();
        data.absData.resourceLoadInfo.dumpToConsole();

        console.log('\n\nAJAX请求共计' + data.ajax.reqList.length + '个');
        var waiting = 0;
        var requesting = 0;
        var total = 0;
        var invalid = [];
        data.ajax.reqList.forEach(function (item, index) {
            if (item.valid) {
                total += (item.endTime - item.startTime);
                waiting += (item.startToRecieve - item.startTime);
                requesting += (item.endTime - item.startToRecieve);
                var path = item.detail.data.url.indexOf('zebra') == -1
                    ? item.detail.data.url.split('path=')[1].split('&')[0]
                    : 'zebra';
                console.log(path
                    + '\t' + item.startTime.toFixed(2)
                    + '\t' + item.endTime.toFixed(2)
                    + '\t' + (item.startToRecieve - item.startTime).toFixed(2)
                );
            }
            else {
                invalid.push(item);
            }
        });
        console.log('有' + invalid.length + '个是未闭合的请求')
        console.log('\t开始于：' + data.ajax.startTime);
        console.log('\t结束于：' + data.ajax.endTime);
        console.log('\t消耗了：' + (data.ajax.endTime - data.ajax.startTime));
        console.log('\t等待时间：' + waiting + '（含并发）');
        console.log('\t接收时间：' + requesting + '（含并发）');
    }
}

function dumpToConsoleList(list) {
    var entryName = '';
    var result = [];
    var max = [];
    var min = [];
    result.maxFile = '';
    result.minFile = '';
    var resourceReq = {
        js: [],
        css: [],
        image: [],
        other: [],
        name: []
    };
    // var resourceReq = {
    //     js: 0,
    //     css: 0,
    //     image: 0,
    //     other: 0
    // };

    list.forEach(function (item, index){
        // 入口信息
        if (entryName.indexOf(item.absData.entryHtmlInfo.result.fileName) === -1) {
            entryName += item.absData.entryHtmlInfo.result.fileName;
        }

        resourceReq.js.push(item.absData.resourceLoadInfo.byType.js.length);
        resourceReq.css.push(item.absData.resourceLoadInfo.byType.css.length);
        resourceReq.image.push(item.absData.resourceLoadInfo.byType.image.length);
        resourceReq.other.push(item.absData.resourceLoadInfo.byType.other.length);
        resourceReq.name.push(item.dataFileName);

        item.simpleTimeline.forEach(function (subItem, subIndex) {
            result[subIndex] = result[subIndex] || {};
            result[subIndex].desc = subItem.desc;
            result[subIndex].time = result[subIndex].time || 0;
            result[subIndex].time += (+subItem.time);
            result[subIndex].waiting = result[subIndex].waiting || 0;
            result[subIndex].waiting += (+subItem.waiting || 0);
            result[subIndex].recieving = result[subIndex].recieving || 0;
            result[subIndex].recieving += (+subItem.recieving || 0);
            result[subIndex].spent = result[subIndex].spent || 0;
            result[subIndex].spent += (+subItem.spent || 0);


            max[subIndex] = max[subIndex] || Number.MIN_VALUE;
            if (max[subIndex] <= subItem.time) {
                max[subIndex] = subItem.time;
                result.maxFile = item.dataFileName;
            }
            min[subIndex] = min[subIndex] || Number.MAX_VALUE;
            if (min[subIndex] >= subItem.time) {
                min[subIndex] = subItem.time;
                result.minFile = item.dataFileName;
            }
        });
    });

    console.log('共计' + list.length + '个');
    console.log('入口为' + entryName);
    result.forEach(function (item, index) {
        console.log(
            item.desc + '（平均）：' + (item.time ? parseInt(item.time / list.length) : 0)
            + ' （'
            + parseInt(min[index])
            + ','
            + parseInt(max[index])
            + '）'
        );
        if (item.waiting && item.recieving) {
            console.log('\t\twaiting：' + item.waiting + ', recieving：' + item.recieving)
        }
    });

    console.log('max is ' + result.maxFile);
    console.log('min is ' + result.minFile);
    console.log('js个数：' + resourceReq.js.join(','));
    console.log('css个数：' + resourceReq.css.join(','));
    console.log('image个数：' + resourceReq.image.join(','));
    console.log('other个数：' + resourceReq.other.join(','));
    console.log('文件：' + resourceReq.name.join(','));

    return result;
}

function dumpToFile (filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data));
}