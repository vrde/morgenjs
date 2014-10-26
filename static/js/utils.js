(function (load, morgen, __morgen) {
    'use strict';

    function encodeData (data) {
        var query = [];
        for (var key in data)
            query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        return query.join('&');
    }

    function updateDict (src, dest) {
        for (var key in src)
            if (typeof(src[key]) == 'object')
                updateDict(src[key], dest[key]);
            else
                dest[key] = src[key];
    }

    function isEmpty(obj) {
        if (!obj)
            return false;

        for (var prop in obj)
            if (obj.hasOwnProperty(prop)) return false;

        return true;
    }


    morgen.updateConfig = function (data) {
        updateDict(data, __morgen.config);
    };


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

        if (__morgen.config.http.apiRoot)
            url = __morgen.config.http.apiRoot + url

        if (!isEmpty(__morgen.config.http.appendParams))
            url = [url, encodeData(__morgen.config.http.appendParams)].join(url.indexOf('?') == -1 ? '?' : '&');

        xhr.open(method, url, true);
        xhr.withCredentials = __morgen.config.http.withCredentials;
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Content-Type', contentType + ';charset=UTF-8');
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                if (xhr.status == 200 || xhr.status === 0)
                    success && success(JSON.parse(xhr.responseText));
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
        // FIXME: this is a bit shitty
        if (typeof(data) == 'function') {
            error = success;
            success = data;
            data = null;
        }
        if (data) {
            url = url + '?' + encodeData(data)
        }
        return morgen.httpSend('get', url, null, success, error);
    };


    morgen.httpPost = function (url, data, success, error) {
        // FIXME: this is a bit shitty
        if (typeof(data) == 'function') {
            error = success;
            success = data;
            data = null;
        }
        return morgen.httpSend('post', url, data instanceof FormData ? data : encodeData(data), success, error);
    };


    morgen.cookie = function (name, value) {
        // thanks to:
        //  - http://stackoverflow.com/a/11344672/597097
        //  - https://developer.mozilla.org/en-US/docs/Web/API/document.cookie

        // read cookie
        if (value === undefined) {
            var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
            return result === null ? undefined : JSON.parse(decodeURIComponent(result[1]));
        }
        // delete cookie
        else if (value === null) {
              document.cookie = [name, '=; expires=Thu, 01-Jan-1970 00:00:01 GMT;'].join('');
        }
        // write cookie
        else {
              document.cookie = [name, '=', encodeURIComponent(JSON.stringify(value)), '; path=/', '; max-age=', 60*60*24*365].join('');
        }
    };
}) (window.morgen.load,
    window.morgen,
    window.__morgen);

