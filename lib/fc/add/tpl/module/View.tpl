/**
 * @file ${desc} - View定义
 *
 * @author ${author}(${email})
 */

define(function (require) {

    var BaseView = require('fc-view/mvc/BaseView');

    // 加载tpl
    require('etpl/tpl!./tpl.html');

    // 加载样式
    require('css!./style.less');

    /**
     * ${desc} - View定义
     *
     * @class
     * @extends {er.View}
     */
    var overrides = {};

    /**
     * @property {string} template 所使用的模板
     */
    overrides.template = '${className}';

    /**
     * 界面渲染完成之后的事件处理
     */
    overrides.enterDocument = function () {};

    var View = require('eoo').create(BaseView, overrides);

    return View;
});
