/*
 * grunt-aws-lambda
 * https://github.com/Tim-B/grunt-aws-lambda
 *
 * Copyright (c) 2014 Tim-B
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var fs = require('fs');

var invokeTask = {};

invokeTask.loadFunction = function(file_name) {
    return require(path.resolve(file_name));
};

invokeTask.getHandler = function (options, done) {

    return function (payload) {

        var options = {
            'package_folder': './',
            'handler': 'handler',
            'file_name': 'index.js',
            'event': payload,
            'client_context': 'client_context.json',
            'identity': 'identity.json'
        };

        var clientContext = null;

        //since clientContext should be optional, skip if doesn't exist
        try {
            clientContext = JSON.parse(fs.readFileSync(path.resolve(options.client_context), "utf8"));
        } catch (e) {
            if (e.code !== 'ENOENT') {
                throw e;
            }
        }

        var identity = null;
        //since identity should be optional, skip if doesn't exist
        try {
            identity = JSON.parse(fs.readFileSync(path.resolve(options.identity), "utf8"));
        } catch (e) {
            if (e.code !== 'ENOENT') {
                throw e;
            }
        }

        var cwd;
        if (options.package_folder) {
            cwd = process.cwd();
            process.chdir(path.resolve(options.package_folder));
        }

        var context = {
            done: function (error, result) {
                if (error === null || typeof(error) === 'undefined') {
                    context.succeed(result);
                } else {
                    context.fail(error);
                }
            },
            succeed: function (result) {
                if (cwd) {
                    process.chdir(cwd);
                }
                done(result);
            },
            fail: function (error) {
                if (cwd) {
                    process.chdir(cwd);
                }
                done(error);
            },
            awsRequestId: 'LAMBDA_INVOKE',
            logStreamName: 'LAMBDA_INVOKE',
            clientContext: clientContext,
            identity: identity
        };

        var callback = function(error, object) {
            context.done(error, object);
        };

        var lambda = invokeTask.loadFunction(options.file_name);
        lambda[options.handler](options.event, context, callback);
    };
};

module.exports = invokeTask;
