/**
 * @file ${desc} - Action定义
 *
 * @author ${author}(${email})
 */

define(function (require) {

    var EntryAction = require('fc-view/mvc/EntryAction');

    /**
     * ${desc} - Action定义
     *
     * @class
     * @extends {fc-view.EntryAction}
     */
    var overrides = {};

    overrides.modelType = require('./Model');
    overrides.viewType = require('./View');

    /**
     * 初始化行为交互
     */
    overrides.initBehavior = function () {

    };

    var Action = require('eoo').create(EntryAction, overrides);

    return Action;
});
