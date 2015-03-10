/**
 * @file 语义分析处理 - 追加edp配置文件对moc服务的支持
 * @author Ming Liu(wenbo.fe@gmail.com)
 */

/* global exports */
var fs = require('fs');
var path = require('path');
var edp = require('edp-core');
var util = require('../util/index');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var SYNTAX = estraverse.Syntax;


function mockService(currPath) {
    var projectInfo = require('edp-project').getInfo();
    // 定位edp-webserver-config.js位置
    var edpConfigPath = path.resolve(projectInfo.dir, 'edp-webserver-config.js');

    // 生成AST
    var ast = util.getAst(fs.readFileSync(edpConfigPath, {
        encoding: 'UTF-8'
    }));

    var existed = checkMocExist(ast);
    if (existed) {
        edp.log.warn('moc服务已经初始化完成,无需再次初始化！');
        return;
    }
    else {
        insertMocAst(ast);
        // 检查是否安装了mockservice，如果没有，则安装
        try {
            require('mockservice');
        }
        catch (e) {
            require('child_process').spawn('npm',['i', '-g', 'mockservice']);
        }

    }

    escodegen.attachComments(ast, ast.comments, ast.tokens);
    var code = escodegen.generate(ast, {
        comment: true
    });

    fs.writeFileSync(edpConfigPath, code, {
        encoding: 'UTF-8'
    });

    edp.log.warn('moc服务初始化完成,请知晓！');
}

/**
 * 检查moc是否已经初始化，如果已经require('mockservice'),认为已经初始化
 * @param {Object} ast edp配置文件的ast
 * @return {boolean}
 */
function checkMocExist(ast) {
    var result = false;

    estraverse.traverse(ast, {
        enter: function (node, parent) {
            if (SYNTAX.VariableDeclarator === node.type
                && node.init
                && node.init.callee
                && 'require' === node.init.callee.name
                && node.init.arguments
                && 'mockservice' === node.init.arguments[0].value
            ) {
                result = true;
                this.break();
            }
        }
    });

    return result;
}

/**
 * 插入mock逻辑
 * @param  {[type]} ast [description]
 * @return {[type]}     [description]
 */
function insertMocAst(ast) {
    ast.body.splice(
        3,
        0,
        util.getAst("var mock = require('mockservice');").body[0]
    );
    ast.body.splice(
        4,
        0,
        util.getAst("mock.config({name: 'please rename',dir: __dirname + '/debug/response'});").body[0]
    );
    var insertNode = util.getAst('var a = {location: /request\.ajax/, handler: mock.request()}').body[0]
        .declarations[0].init;
   
    estraverse.traverse(ast, {
        enter: function (node, parent) {
            if (SYNTAX.ReturnStatement === node.type
                && SYNTAX.BlockStatement === parent.type
                && node.argument
                && SYNTAX.ArrayExpression === node.argument.type
                && Array.isArray(node.argument.elements)
            ) {
                node.argument.elements.unshift(insertNode);
                this.break();
            }
        }
    });
}

exports.process = mockService;
