/**
 * @file ${desc} - Entry定义 - 模块服务界面入口
 *
 * @author ${author}(${email})
 */
define(function (require) {
    
    /**
     * ${desc} - Entry定义 - 模块服务界面入口
     *
     * @class
     * @extends {fc.view.BasicView}
     */
    var overrides = {};

    /**
     * @constructor
     * @lends {Entry}
     *
     * @param {?Object} options 配置项
     */
    overrides.constructor = function (options) {

        // 直接固定了actionPath这些东西
        options = options || {};
        options.actionPath = '/${moduleName}';

        // $super 会自动调用父类的同名方法
        this.$super([options]);
    };

    var Entry = require('eoo').create(require('fc/view/BasicView'), overrides);

    return Entry;
});