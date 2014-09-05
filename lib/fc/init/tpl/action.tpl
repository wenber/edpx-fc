/**
 * @file ${desc} - Action定义
 * @author ${author}
 */

define(function (require) {
    
    /**
     * ${desc} - Action定义
     *
     * @class ?
     * @extends {er.Action}
     * @constructor
     */
    var overrides = {};

    overrides.modelType = require('./${model}');
    overrides.viewType = require('./${view}');

    /**
     * 初始化行为交互
     */
    overrides.initBehavior = function () {
        
    };

    var ${action} = require('eoo').create(require('er/Action'), overrides);

    return ${action};
});