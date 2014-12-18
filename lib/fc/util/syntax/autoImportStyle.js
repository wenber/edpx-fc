/**
 * @file 语义分析处理 - 自动注册当前style.less的父级import
 *
 * @author Ming Liu(wenber.fe@gmail.com)
 */

var fs = require('fs');
var path = require('path');
var edp = require('edp-core');

function autoRequireActionConf (currPath) {
    /*
     * edp项目信息
     * @type {Object}
     * {
     *     dir: '/Users/leowang/work/svn/fc-fe/workspace/nirvana-workspace/nirvana',
     *     infoDir: '/Users/leowang/work/svn/fc-fe/workspace/nirvana-workspace/nirvana/.edpproj'
     * }
     */
    var projectInfo = require('edp-project').getInfo();

    // 首先找到祖先目录中最近的style.less
    var parentPath = path.resolve(path.dirname(currPath), '../');
    var found = false;
    var targetPath;

    if (parentPath === projectInfo.dir) {  // src路径，注入module和entry的样式引用
        targetPath = path.resolve(parentPath, 'src/style.less');
        fs.appendFileSync(
            targetPath,
            '@import "entry/style.less"\n@import "module/style.less"',
            {
                encoding: 'UTF-8'
            }
        );
        return;
    }

    while (parentPath !== projectInfo.dir) {
        targetPath = path.resolve(parentPath, 'style.less');
        if (fs.existsSync(targetPath)) {
            found = true;
            break;
        }
        // 一级一级向上追溯
        parentPath = path.dirname(parentPath);
    }

    if (!found) {
        edp.log.warn('自动更新当前style的父级import失败，没有找到父级的style.less！');
        return;
    }

    // 找到了,追加import
    var pathArray = currPath.split(path.sep);
    var newData = '@import "' + pathArray[pathArray.length - 2]
        + '/' + pathArray[pathArray.length - 1] + '"\;\n';

    fs.appendFile(
        targetPath,
        newData,
        {
            encoding: 'UTF-8'
        },
        function () {
            edp.log.warn('已经自动更新了`' + targetPath + '`，请知晓！');
        }
    );
}

exports.process = autoRequireActionConf;
