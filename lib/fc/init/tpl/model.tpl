/**
 * @file Model定义
 * @author ${author}
 */

define(function (require) {

    var util = require('common/util');
    <!-- if: ${withEF} -->
    var UIModel = require('ef/UIModel');
    <!-- else: -->
    var Model = require('er/Model');
    <!-- /if -->
    /**
     * Model定义
     * @constructor
     * @extends {Model}
     */
    var ${model} = util.derive(<!-- if: ${withEF} -->UIModel<!-- else: -->Model<!--/if -->);

    /**
     * 请求数据以及准备基础数据
     */
    ${model}.prototype.datasource = {};

    /**
     * 数据请求完成之后的后置处理
     */
    ${model}.prototype.prepare = function () {
        var me = this;
    };

    return ${model};
});