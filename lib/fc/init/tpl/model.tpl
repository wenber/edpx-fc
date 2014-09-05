/**
 * @file ${desc} - Model定义
 * @author ${author}
 */

define(function (require) {

    /**
     * ${desc} - Model定义
     *
     * @class ?
     * @extends {<!-- if: ${withEF} -->ef.UIModel<!-- else: -->er.Model<!--/if -->}
     * @constructor
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

    var ${model} = require('eoo').create(require('<!-- if: ${withEF} -->ef/UIModel<!-- else: -->er/Model<!--/if -->'), overrides);

    return ${model};
});