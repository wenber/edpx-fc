/**
 * @file ${desc} - Action定义
 *
 * @author ${author}(${email})
 */
define(function (require) {

    var BaseAction = require('fc-view/mvc/BaseAction');
    
    /**
     * ${desc} - Action定义
     *
     * @class
     * @extends {er.Action}
     */
    var overrides = {};

    overrides.modelType = require('./Model');
    overrides.viewType = require('./View');

    /**
     * 初始化行为交互
     */
    overrides.initBehavior = function () {
        
    };

    var Action = require('eoo').create(BaseAction, overrides);

    return Action;
});
