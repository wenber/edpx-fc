/**
 * @file 公共的工具方法
 * @author Leo Wang(leowang721@gmail.com)
 */

var fs = require('fs');
var path = require('path');
var promise = require('node-promise');
var edp = require('edp-core');
var etpl = require('etpl');
var edpConfig = require('edp-config');
var mkdirp = require('mkdirp');

var util = {};

util.extend = function (target) {
    for (var i = 1; i < arguments.length; i++) {
        var src = arguments[i];
        if (src == null) {
            continue;
        }
        for (var key in src) {
            if (src.hasOwnProperty(key)) {
                target[key] = src[key];
            }
        }
    }
    return target;
};

/**
 * @param {string} code js代码.
 * @return {*}
 */
util.getAst = function(code) {
    var ast = null;

    try {
        ast = require('esprima').parse(code, {
            comment: true,
            tokens: true,
            range: true
        });
    } catch (ex) {
        return null;
    }

    return ast;
};

/**
 * 检查是否存在，如果存在，则提示无法继续，如果指定了force，则强行执行覆盖
 */
util.checkExsit = function (path, isForce) {
    var deferred = promise.defer();
    fs.exists(path, function (exsits) {
        if (!exsits || isForce) {
            deferred.resolve();
        }
        else {
            edp.log.error('目标已经存在，无法继续。你可以使用 --force 执行覆盖处理。');
            deferred.reject();
        }
    });
    return deferred.promise;
};

/**
 * 获取要输出的文件内容
 */
util.getToWriteData = function (tplPath, data) {
    var tplData = fs.readFileSync(tplPath).toString();
    var render = etpl.compile(tplData);
    var basicData = {
        author:  edpConfig.get('user.name'),
        email: edpConfig.get('user.email')
    };

    return render(util.extend(basicData, data));
};

/**
 * 输出
 */
util.writeFiles = function (toWrite) {
    toWrite.forEach(function (item) {
        mkdirp.sync(edp.path.dirname(item.path));
        fs.writeFileSync(item.path, item.data, {
            encoding: 'utf8'
        })
    });
};

module.exports = exports = util;