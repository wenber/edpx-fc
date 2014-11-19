/**
 * @file ${desc} - Model定义
 *
 * @author ${author}(${email})
 */

define(function (require) {

    /**
     * ${desc} - Model定义
     *
     * @class
     * @extends {er.Model}
     */
    var overrides = {};

    /**
     * 请求数据以及准备基础数据
     */
    overrides.datasource = {};

    /**
     * 数据请求完成之后的后置处理
     */
    overrides.prepare = function () {};

    var Model = require('eoo').create(require('er/Model'), overrides);

    return Model;
});
