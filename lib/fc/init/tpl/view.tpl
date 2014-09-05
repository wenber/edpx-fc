/**
 * @file ${desc} - View定义
 * @author ${author}
 */

define(function (require) {

    // 加载tpl
    require('etpl/tpl!./${tpl}.html');

    // 加载样式
    require('css!./${style}.less');

    /**
     * ${desc} - View定义
     *
     * @class ?
     * @extends {<!-- if: ${withEF} -->ef.UIView<!-- else: -->er.View<!--/if -->}
     * @constructor
     */
    var overrides = {};

    /**
     * @property {string} [template] 所使用的模板
     */
    overrides.template = '${template}';

    <!-- if: !${withEF} -->
    /**
     * 界面渲染完成之后的事件处理
     */
    overrides.enterDocument = function () {};
    <!-- else: -->
    // EF的UIView占用了enterDocument方法，不能使用

    /**
     * ui的属性配置
     */
    overrides.uiProperties = {};

    /**
     * ui的事件配置
     */
    overrides.uiEvents = {};
    <!-- /if -->

    var ${view} = require('eoo').create(require('<!-- if: ${withEF} -->ef/UIView<!-- else: -->er/View<!--/if -->'), overrides);

    return ${view};
});