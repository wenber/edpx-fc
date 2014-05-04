/**
 * @file ${desc} - Action定义
 * @author ${author}
 */

define(function (require) {

    var util = require('common/util');

    var Action = require('er/Action');
    var ${model} = require('./${model}');
    var ${view} = require('./${view}');

    /**
     * ${desc} - Action定义
     * @constructor
     * @extends {Action}
     */
    var ${action} = util.derive(Action);

    ${action}.prototype.modelType = ${model};
    ${action}.prototype.viewType = ${view};

    /**
     * 初始化行为交互
     */
    ${action}.prototype.initBehavior = function () {
        var me = this;
    };

    return ${action};
});