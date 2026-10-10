'use strict';

const assert = require('node:assert/strict');
const EventEmitter = require('node:events');
const http = require('node:http');
const https = require('node:https');
const PassThrough = require('node:stream').PassThrough;
const test = require('node:test');

const Kavenegar = require('../kavenegar');

function fixture(t, body, statusCode) {
    const originalRequest = https.request;
    const originalLog = console.log;
    const socket = new PassThrough();
    const response = new http.IncomingMessage(socket);
    response.statusCode = statusCode;
    const request = new EventEmitter();
    const logs = [];
    let onResponse;

    request.write = function () { return true; };
    request.end = function () { return request; };
    https.request = function (options, callback) {
        onResponse = callback;
        return request;
    };
    console.log = function () { logs.push(Array.from(arguments)); };

    t.after(function () {
        https.request = originalRequest;
        console.log = originalLog;
        response.destroy();
        socket.destroy();
    });

    return {
        api: Kavenegar.KavenegarApi({ apikey: 'offline-test-key' }),
        logs: logs,
        respond: function () {
            onResponse(response);
            const chunks = Array.isArray(body) ? body : [body];
            chunks.forEach(function (chunk) { response.emit('data', chunk); });
            response.emit('end');
        },
        fail: function (error) { request.emit('error', error); }
    };
}

function providerResponse(status) {
    return JSON.stringify({
        entries: status === 200 ? [{ remaincredit: 1234 }] : null,
        return: { status: status, message: status === 200 ? 'تایید شد' : 'API error' }
    });
}

test('successful chunked response calls back once with entries, status, and message', function (t) {
    const body = providerResponse(200);
    const request = fixture(t, [body.slice(0, 15), body.slice(15)], 200);
    const calls = [];
    request.api.AccountInfo({}, function () { calls.push(Array.from(arguments)); });
    request.respond();

    assert.deepEqual(calls, [[[{ remaincredit: 1234 }], 200, 'تایید شد']]);
    assert.equal(request.logs.length, 0);
});

[400, 401].forEach(function (status) {
    test('provider HTTP ' + status + ' error calls back once with its API status', function (t) {
        const request = fixture(t, providerResponse(status), status);
        const calls = [];
        request.api.AccountInfo({}, function () { calls.push(Array.from(arguments)); });
        request.respond();

        assert.deepEqual(calls, [[null, status, 'API error']]);
        assert.equal(request.logs.length, 0);
    });
});

[
    { name: 'invalid JSON', body: '<html>Bad gateway</html>' },
    { name: 'invalid provider payload', body: '{}' }
].forEach(function (response) {
    test(response.name + ' calls back once with the existing status-500 error', function (t) {
        const request = fixture(t, response.body, 502);
        const calls = [];
        request.api.AccountInfo({}, function () { calls.push(Array.from(arguments)); });
        request.respond();

        assert.equal(calls.length, 1);
        assert.equal(calls[0].length, 2);
        assert.equal(typeof calls[0][0], 'string');
        assert.ok(calls[0][0].length > 0);
        assert.equal(calls[0][1], 500);
        assert.equal(request.logs.length, 1);
    });
});

test('transport error calls back once with the existing JSON error payload', function (t) {
    const request = fixture(t, '', 0);
    const calls = [];
    request.api.AccountInfo({}, function () { calls.push(Array.from(arguments)); });
    request.fail(new Error('Connection refused'));

    assert.deepEqual(calls, [[JSON.stringify({ error: 'Connection refused' })]]);
});

[200, 401].forEach(function (status) {
    test('callback exception for HTTP ' + status + ' propagates without invoking the callback again', function (t) {
        const request = fixture(t, providerResponse(status), status);
        const callbackError = new Error('caller callback failed');
        let calls = 0;
        let caught;
        request.api.AccountInfo({}, function () {
            calls += 1;
            if (calls === 1) throw callbackError;
        });
        try {
            request.respond();
        } catch (error) {
            caught = error;
        }

        assert.equal(calls, 1);
        assert.equal(caught, callbackError);
        assert.equal(request.logs.length, 0);
    });
});

test('an exception in the parse-error callback propagates with one callback invocation', function (t) {
    const request = fixture(t, '<html>Bad gateway</html>', 502);
    const callbackError = new Error('caller error handler failed');
    let calls = 0;
    request.api.AccountInfo({}, function () {
        calls += 1;
        throw callbackError;
    });

    assert.throws(function () { request.respond(); }, function (error) { return error === callbackError; });
    assert.equal(calls, 1);
});

[
    { name: 'valid JSON', body: providerResponse(200), logs: 0 },
    { name: 'invalid JSON', body: '<html>Bad gateway</html>', logs: 1 },
    { name: 'non-provider JSON', body: '{}', logs: 0 }
].forEach(function (response) {
    test(response.name + ' without a callback preserves the existing behavior', function (t) {
        const request = fixture(t, response.body, 200);
        request.api.AccountInfo({});

        assert.doesNotThrow(function () { request.respond(); });
        assert.equal(request.logs.length, response.logs);
    });
});
