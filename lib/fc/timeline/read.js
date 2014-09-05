/**
 * @file edp fc timeline read 读取timeline数据
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
    // 获取目标文件
    var fileName = opts.file;
    if (fileName) {
        var data = processSingleFile(fileName);
        return data;
    }

    var folder = opts.folder;
    var ignore = {
        '.DS_Store': 1,
        '.': 1,
        '..': 1
    };
    if (folder) {
        var fstat = fs.statSync(path.resolve('.', folder));
        if (fstat.isDirectory()) {
            var list = fs.readdirSync(folder);
            var result = [];
            list.forEach(function (item, index) {
                if (!ignore[item]) {
                    var itemStat = fs.statSync(path.resolve(folder, item));
                    if (itemStat.isFile()) {
                        var processResult = processSingleFile(path.resolve(folder, item));
                        processResult.dataFileName = item;
                        result.push(processResult);
                    }
                }
            });
            return result;
        }
    }
};


// AJAX的相关mark
function processSingleFile (file) {
    var absData = timeline.pageLoading.process(null, {
        file: file,
        silent: true
    });

    // 继续处理
    
    // 从入口HTML请求结束开始处理数据
    var startLine = absData.entryHtmlInfo.endLine;
    var timeDiff = absData.timeDiff;

    // 处理AJAX数据，这就是凤巢关联的了
    // AJAX其实可以通过timeline.common.config.TYPE.REQUEST.XHR_STATE_CHANGE来确定
    // 但是这有个问题，并不能确定此ajax的起始时间，只有url是匹配的
    // 所以这么处理：
    // 整理所有的请求类，以timeline.common.config.TYPE.REQUEST.SEND.key为入口
    // 根据keyword区分ajax类请求
    // 并标记timeline.common.RequestTimeLineGroup按照ajax来处理
    // 从而补充了AJAX的xhrStateChange信息
    var reqList = [];
    var reqMap = {};

    var keyReq = {
        ao: [],
        materialList: [],
        accountTreeList: null,
        accountTreeCurrent: null,
        basicInfo: null
    };
    var REG = {
        AO: /request\.ajax\?path=GET\/ao\/request/g,
        BASICINFO: /request\.ajax\?path=GET\/basicInfo/g,
        MATERIAL_LIST: /request\.ajax\?path=GET\/mtl\/(word|idea|plan|unit)list/g,
        ACCOUNT_TREE_LIST: /request\.ajax\?path=GET\/accounttree\/childrennodes/g,
        ACCOUNT_TREE_CURRENT: /request\.ajax\?path=GET\/accounttree\/singlenode/g
    };

    var ajaxStart = Number.MAX_VALUE;
    var ajaxEnd = Number.MIN_VALUE;
    var firstAjax;
    timeline.common.processor.doEachLine.process(absData.data, {
        child: function (child, father, line) {
            // 首先是Request Send作为初步准入
            if (child.type == timeline.common.config.TYPE.REQUEST.SEND.key) {
                if (/request\.ajax|zebra/g.test(child.data.url)) {
                    var req = new timeline.common.RequestTimeLineGroup({
                        requestId: child.data.requestId
                    });

                    req.autoProcess(absData.data, {
                        startLine: line + startLine,
                        timeDiff: timeDiff,
                        isAjax: true
                    })

                    reqMap[child.data.url] = req;
                    reqList.push(req);
                    // 关键请求
                    if (REG.AO.test(child.data.url)) {
                        keyReq.ao.push(req);
                    }
                    else if (REG.BASICINFO.test(child.data.url)) {
                        keyReq.basicInfo = req;
                    }
                    else if (REG.MATERIAL_LIST.test(child.data.url)) {
                        keyReq.materialList.push(req);
                    }
                    else if (REG.ACCOUNT_TREE_LIST.test(child.data.url)) {
                        keyReq.accountTreeList = keyReq.accountTreeList || req;
                    }
                    else if (REG.ACCOUNT_TREE_CURRENT.test(child.data.url)) {
                        keyReq.accountTreeCurrent = keyReq.accountTreeCurrent || req;
                    }

                    if (ajaxStart > req.startTime) {
                        ajaxStart = req.startTime;
                        firstAjax = req;
                    }
                    
                    ajaxEnd = ajaxEnd > req.endTime ? ajaxEnd : req.endTime;
                }
            }
        }
    }, startLine);

    var result = {
        // file: file,
        absData: absData,
        ajax: {
            startTime: ajaxStart,
            endTime: ajaxEnd,
            reqList: reqList,
            reqMap: reqMap,
            keyReq: keyReq,
            first: firstAjax
        }
    };


    var simpleTimeline = [];
    simpleTimeline.push({
        time: result.absData.entryHtmlInfo.result.startTime,
        desc: '入口HTML请求发出'
    });
    simpleTimeline.push({
        time: result.absData.entryHtmlInfo.result.endTime,
        desc: '入口HTML请求完成'
    });
    simpleTimeline.push({
        time: result.absData.pageEventInfo.domContentLoaded.startTime,
        desc: '触发浏览器的DOMContentLoaded事件'
    });
    simpleTimeline.push({
        time: result.absData.pageEventInfo.firstPaint.startTime,
        desc: '触发浏览器的第一次绘制'
    });
    simpleTimeline.push({
        time: result.absData.pageEventInfo.load.startTime,
        desc: '触发浏览器的load事件'
    });
    simpleTimeline.push({
        time: result.ajax.first.startTime,
        desc: '发送第一个AJAX请求'
    });
    simpleTimeline.push({
        time: result.ajax.first.endTime,
        desc: '完成第一个AJAX请求'
    });
    simpleTimeline.push({
        time: result.ajax.keyReq.basicInfo.startTime,
        desc: '发送环境请求'
    });
    simpleTimeline.push({
        time: result.ajax.keyReq.basicInfo.endTime,
        desc: '结束环境请求'
    });

    try {

        var keyResult = {
            count: 0,
            startTime: Number.MAX_VALUE,
            endTime: Number.MIN_VALUE,
            spentTime: 0,
            waiting: 0,
            recieving: 0
        };
        result.ajax.keyReq.ao.forEach(function (item) {
            if (item.valid) {
                keyResult.count++;
                keyResult.startTime = keyResult.startTime > item.startTime
                    ? item.startTime : keyResult.startTime;
                keyResult.endTime = keyResult.endTime < item.endTime
                    ? item.endTime : keyResult.endTime;
                keyResult.spentTime += (item.endTime - item.startTime);
                keyResult.waiting += (item.startToRecieve - item.startTime);
                keyResult.recieving += (item.endTime - item.startToRecieve);
            }
        });

        simpleTimeline.push({
            time: keyResult.startTime,
            waiting: keyResult.waiting,
            spent: keyResult.spentTime,
            recieving: keyResult.recieving,
            desc: '发送AO请求'
        });
        simpleTimeline.push({
            time: keyResult.endTime,
            waiting: keyResult.waiting,
            spent: keyResult.spentTime,
            recieving: keyResult.recieving,
            desc: '完成AO请求'
        });

        keyResult = {
            count: 0,
            startTime: Number.MAX_VALUE,
            endTime: Number.MIN_VALUE,
            spentTime: 0,
            waiting: 0,
            recieving: 0
        };
        result.ajax.keyReq.materialList.forEach(function (item) {
            if (item.valid) {
                keyResult.count++;
                keyResult.startTime = keyResult.startTime > item.startTime
                    ? item.startTime : keyResult.startTime;
                keyResult.endTime = keyResult.endTime < item.endTime
                    ? item.endTime : keyResult.endTime;
                keyResult.spentTime += (item.endTime - item.startTime);
                keyResult.waiting += (item.startToRecieve - item.startTime);
                keyResult.recieving += (item.endTime - item.startToRecieve);
            }
        });

        simpleTimeline.push({
            time: keyResult.startTime,
            waiting: keyResult.waiting,
            spent: keyResult.spentTime,
            recieving: keyResult.recieving,
            desc: '发送物料列表请求'
        });
        simpleTimeline.push({
            time: keyResult.endTime,
            waiting: keyResult.waiting,
            spent: keyResult.spentTime,
            recieving: keyResult.recieving,
            desc: '完成物料列表请求'
        });


        simpleTimeline.push({
            time: Math.min(
                result.ajax.keyReq.accountTreeList.startTime,
                result.ajax.keyReq.accountTreeCurrent
                    ? result.ajax.keyReq.accountTreeCurrent.startTime
                    : Number.MAX_VALUE
            ),
            desc: '发送账户树请求'
        });

        currReq = result.ajax.keyReq.accountTreeList;
        if (currReq.valid) {
            simpleTimeline.push({
                time: Math.max(
                    result.ajax.keyReq.accountTreeList.endTime,
                    (result.ajax.keyReq.accountTreeCurrent && result.ajax.keyReq.accountTreeCurrent.valid)
                        ? result.ajax.keyReq.accountTreeCurrent.endTime
                        : Number.MIN_VALUE
                ),
                desc: '完成账户树请求'
            });
        }
        else {
            simpleTimeline[simpleTimeline.length - 1].desc += '，但是此请求不完整，没有xhr状态变化';
        }
    }
    catch (e) {
        //
    }

    // 资源相关
    simpleTimeline.push({
        desc: '开始加载阶段js资源请求',
        time: absData.resourceLoadInfo.timingLog.js.startTime
    });
    simpleTimeline.push({
        desc: '结束加载阶段js资源请求',
        time: absData.resourceLoadInfo.timingLog.js.endTime
    });
    simpleTimeline.push({
        desc: '开始加载阶段css资源请求',
        time: absData.resourceLoadInfo.timingLog.css.startTime
    });
    simpleTimeline.push({
        desc: '结束加载阶段css资源请求',
        time: absData.resourceLoadInfo.timingLog.css.endTime
    });

    simpleTimeline.sort(function (a, b) {
        return a.time < b.time ? -1 : 1;
    });

    result.simpleTimeline = simpleTimeline;

    // return result;

    return result;
    // return {
    //     ajax: result.ajax,
    //     simpleTimeline: result.simpleTimeline
    // };
};

