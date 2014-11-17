/**
 * @file ${desc} - View定义
 *
 * @author ${author}(${email})
 */

define(function (require) {

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
     * @property {string} [template] 所使用的模板
     */
    overrides.template = '${tplName}';

    /**
     * 界面渲染完成之后的事件处理
     */
    overrides.enterDocument = function () {};

    var View = require('eoo').create(require('er/View'), overrides);

    return View;
});