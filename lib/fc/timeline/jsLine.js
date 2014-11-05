/**
 * @file edp fc timeline jsLine 处理符合某个pattern的js的timeline数据，从加载，到执行
 * @author Leo Wang(wangkemiao@baidu.com)
 */

var path = require('path');
var fs = require('fs');
var edp = require('edp-core');
var timeline = require('edpx-timeline');

/**
 * 命令处理方法
 */
exports.process = function (pattern, file) {

    // 检查file
    var filePath = path.resolve('.', file);

    // 获取状态
    var stat = fs.statSync(filePath);
    if (stat.isFile()) {
        processEach(pattern, filePath);
        return;
    }

    if (stat.isDirectory()) {
        var list = fs.readdirSync(filePath);
        var ignore = {
            '.DS_Store': 1,
            '.': 1,
            '..': 1
        };
        list.forEach(function (item, index) {
            if (!ignore[item]
                // 以TimelineRawData开头
                && item.indexOf('TimelineRawData') == 0) {
                processEach(pattern, item);
            }
        });
    }
};

function processEach (pattern, filePath) {
    var absData = timeline.pageLoading.process(null, {
        file: filePath,
        silent: true
    });

    var matchPattern = new RegExp(pattern, 'g');

    // 从入口HTML请求结束开始处理数据
    var startLine = absData.entryHtmlInfo.endLine || 1;
    var timeDiff = absData.timeDiff;
    var allowedType = {
        FunctionCall: 1
    };

    // 先寻找请求
    var requestInfo = {};
    timeline.common.processor.doEachLine.process(absData.data, {
        child: function (child, father, line) {
            matchPattern.lastIndex = 0;
            if (child.type == timeline.common.config.TYPE.REQUEST.SEND.key
                && matchPattern.test(child.data.url)) {
                var req = new timeline.common.RequestTimeLineGroup({
                    requestId: child.data.requestId
                });

                var endLine = req.autoProcess(absData.data, {
                    startLine: line + startLine,
                    timeDiff: timeDiff,
                    isAjax: true
                });
                requestInfo.group = req;
                requestInfo.startLine = line + startLine + 2;
                requestInfo.endLine = endLine + startLine + 2;
                return true;  // found and break
            }
        }
    }, startLine);

    // 寻找执行
    var evaluateScript = {};
    timeline.common.processor.doEachLine.process(absData.data, {
        child: function (child, father, line) {
            matchPattern.lastIndex = 0;
            if (child.type === 'EvaluateScript'
                && matchPattern.test(child.data.url)) {
                evaluateScript.startTime = child.startTime;
                evaluateScript.data = child;
                evaluateScript.startLine = line + startLine + 2;
                return true;  // found and break
            }
        }
    }, startLine);

    // 先输出
    edp.log.info('起始行为：' + startLine);
    edp.log.info('初始偏移量为' + timeDiff);
    console.log(
        '\n'
        + pattern + '所匹配的资源请求信息：\n'
        + '\tstart：' + requestInfo.group.startTime
        + '\tfinish：' + requestInfo.group.endTime + '\n'
        + '\tbetween line ' + requestInfo.startLine + ', ' + requestInfo.endLine
    );
    console.log(
        '\n'
        + pattern + '所匹配的资源执行信息：\n'
        + '\tstart：' + (evaluateScript.startTime - timeDiff) + '\n'
        + '\tat line ' + evaluateScript.startLine
    );


    // 分析执行
    var passedTypes = {};
    var traceList = [];
    evaluateScript.data.children.forEach(function (item, index) {
        switch (item.type) {
            case 'ParseHTML':
            case 'ScheduleStyleRecalculation':
                traceList.push({
                    type: item.type,
                    startTime: item.startTime,
                    endTime: item.endTime || null,
                    stackTrace: item.stackTrace.slice(0, 3)
                });
                break;
            case 'GCEvent':
                traceList.push({
                    type: item.type,
                    startTime: item.startTime,
                    endTime: item.endTime
                });
                break;
            case 'EventDispatch':
                traceList.push({
                    type: item.type,
                    eventType: item.data.type,
                    startTime: item.startTime,
                    endTime: item.endTime || null,
                    stackTrace: item.children[0].stackTrace/*.slice(
                        item.children[0].stackTrace.length - 4,
                        3
                    )*/
                });
                break;
            default:
                passedTypes[item.type] = 1;
                break;
        }
    });

    traceList.sort(function (a, b) {
        return a.startTime < b.startTime ? -1 : 1;
    });

    traceList.forEach(function (item, index) {
        console.log(
            '\t【'
            + (item.startTime - timeDiff).toFixed(2)
            + ' ~ '
            + (item.endTime - timeDiff).toFixed(2)
            + '】'
            + item.type
            + ((item.type == 'EventDispatch') ? (' ' + item.eventType) : '')
        );
        if (item.stackTrace && item.stackTrace.length > 0) {
            // "functionName": "",
            // "scriptId": "1141",
            // "url": "http://fengchao.baidu.com/nirvana/asset/main.js?v=0.1.12",
            // "lineNumber": 13513,
            // "columnNumber": 25
            item.stackTrace.forEach(function (subItem, subIndex) {
                console.log(
                    '\t\t#' + subIndex
                    + ' ' + subItem.url
                    + '#' + subItem.lineNumber
                    + ':' + subItem.columnNumber
                    + '('
                    + subItem.functionName
                    + ')'
                );
            });
        }
    });

    var passedTypesArr = [];
    for (var k in passedTypes) {
        passedTypesArr.push(k);
    }
    console.log('\n' + passedTypesArr.join('\t'));

}