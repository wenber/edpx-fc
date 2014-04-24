/**
 * @file ${desc} - View定义
 * @author ${author}
 */

define(function (require) {

    var util = require('common/util');
    <!-- if: ${withEF} -->
    var UIView = require('ef/UIView');
    <!-- else: -->
    var View = require('er/View');
    <!-- /if -->
    // 加载tpl
    require('etpl/tpl!./${tpl}.tpl');

    // 加载样式
    require('css!./${style}.less');

    /**
     * ${desc} - View定义
     * @constructor
     * @extends {<!-- if: ${withEF} -->UIView<!-- else: -->View<!--/if -->}
     */
    var ${view} = util.derive(<!-- if: ${withEF} -->UIView<!-- else: -->View<!--/if -->);

    /**
     * 声明所使用的模板
     */
    ${view}.prototype.template = '${template}';

    <!-- if: !${withEF} -->
    /**
     * 界面渲染完成之后的事件处理
     */
    ${view}.prototype.enterDocument = function () {
        var me = this;
    };
    <!-- else: -->
    // EF的UIView占用了enterDocument方法

    /**
     * ui的属性配置
     */
    ${view}.prototype.uiProperties = {};

    /**
     * ui的事件配置
     */
    ${view}.prototype.uiEvents = {};
    <!-- /if -->

    return ${view};
});