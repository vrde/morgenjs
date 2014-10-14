(function (load, morgen, __morgen) {
    'use strict';

    function encodeData (data) {
        var query = [];
        for (var key in data)
            query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        return query.join('&');
    }


    morgen.uid = function () {
        return __morgen.uid++;
    };


    morgen.run = function (options) {
        load('__morgen_broadcast');
        load('__morgen_history');
        load('__morgen_data_events');

        if (options.watch)
            load('__morgen_watchdog');
    };


    morgen.broadcast = function (msg) {
        __morgen.ws.send(JSON.stringify(msg));
    };


    morgen.httpSend = function (method, url, data, success, error) {
        var xhr = new XMLHttpRequest(),
            contentType = method == 'get' ? 'text/plain' : 'application/x-www-form-urlencoded'

        xhr.open(method, url, true);
        xhr.setRequestHeader('Content-Type', contentType + ';charset=UTF-8');
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                if (xhr.status == 200 || xhr.status === 0)
                    success && success(xhr.responseText);
                else
                    error && error();
            }
        };

        xhr.onerror = error;
        xhr.ontimeout = error;

        try {
            xhr.send(data);
        } catch (e) {
            error && error();
        }

        return xhr;
    };


    morgen.httpGet = function (url, data, success, error) {
        return morgen.httpSend('get', url + '?' + encodeData(data), null, success, error);
    }


    morgen.httpPost = function (url, data, success, error) {
        return morgen.httpSend('post', url, data instanceof FormData ? data : encodeData(data), success, error);
    }

}) (window.morgen.load,
    window.morgen,
    window.__morgen);

