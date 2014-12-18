/**
 * @file ${desc} - Model定义
 *
 * @author ${author}(${email})
 */

define(function (require) {

    var BaseModel = require('fc-view/mvc/BaseModel');

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

    var Model = require('eoo').create(BaseModel, overrides);

    return Model;
});
