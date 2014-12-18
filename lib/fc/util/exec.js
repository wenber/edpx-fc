/**
 * @file 执行外部命令，返回一个promise对象
 * @author Leo Wang(leowang721@gmail.com)
 */

var promise = require('node-promise');
var exec = require('child_process').exec;
var util = require('./index');

module.exports = function (command) {
    var deferred = promise.defer();
    try {
        exec(command, function (err, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (err !== null) {
              console.log('exec error: ' + err);
            }
            if (err || stderr) {
                deferred.reject({
                    err: err,
                    stderr: stderr
                });
            }
            deferred.resolve();
        });
    }
    catch (e) {
        deferred.reject();
    }
    return deferred.promise;
};
