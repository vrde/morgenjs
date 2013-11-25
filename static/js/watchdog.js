(function (register, load, dispatch, __morgen) {

    // All the stuff we need to keep an eye on the file
    // changes.


    'use strict';


    // Some nice variables.
    var reloadScript, controller;


    // Handy function to reload a script tag.
    reloadScript = function (src) {
        var attr    = src.match(/\.(js|html)$/) ? 'src' : 'href',
            tag     = attr == 'src' ? 'script' : 'link',
            oldElem = document.querySelector('[' + attr + '^="' + src + '"]'),
            newElem = document.createElement(tag);

        // Add a cache buster to reload the new data.
        newElem[attr] = [src, Math.random()].join('?');
        newElem.rel   = oldElem.rel;
        newElem.type  = oldElem.type;

        // Replace the old node with the new one
        oldElem.parentNode.replaceChild(newElem, oldElem);
        return newElem;
    };


    // Controller responsible to watch changes.
    // It creates and manage a websocket to the server.
    controller = function (c) {
        var log, onmessage, filechange, bind;

        __morgen.ws = new WebSocket('ws://' + window.location.host + '/ws');


        // Nice generic function to log some events
        log = function (e) { console.log('[core] socket activity:', e.type); };


        // React on a new message
        onmessage = function(evt) {
            var json = JSON.parse(evt.data);

            console.log('[core] ws activity, got', json);

            switch(json.type) {
                case 'filechange':
                    filechange(json.payload);
                    break;
            }

            dispatch(json.type, json);
        };

        filechange = function(filename) {
            var src      = filename,
                attr     = src.match(/\.(js|html)$/) ? 'src' : 'href',
                tag      = attr == 'src' ? 'script' : 'link',
                elem     = document.querySelector('[' + attr + '^="' + src + '"]');

            // Still hardcoded, will be better one day.
            // If the index has changed, reload everything.
            if (filename.match(/index\.html/) ||
                window.location.pathname.match(/index\.html/))
                window.location.reload();

            // If the DOM contains an element that loaded the
            // file that changed, reload the file.
            if (elem) {
                reloadScript(src);
                console.log('[core] reload', elem[attr]);
            } else {
                console.error('[core] cannot find', src);
            }
        };

        bind = function () {
            __morgen.ws.onopen = log;
            __morgen.ws.onerror= log;
            __morgen.ws.onclose= log;
            __morgen.ws.onmessage = onmessage;
        };

        // If we reload this controller, we need to do some manual
        // house keeping, closing the websocket.
        //
        // Please note that the `onclose` event will not be logged:
        // the callbacks are removed *after* the cleanup but *before*
        // the browser event loop takes control. So no new events are
        // triggered.
        c.cleanup = function () {
            if (__morgen.ws.readyState == WebSocket.OPEN)
                __morgen.ws.close();
        };

        window.setInterval(function () {
            if (__morgen.ws.readyState != WebSocket.OPEN) {
                console.log('[core] websocket disconnected, trying to reconnect');
                __morgen.ws = new WebSocket('ws://' + window.location.host + '/ws');
                __morgen.ws.onopen = bind;
            }
        }, 1000);

        bind();
    };

    
    // Register the `__morgen_watchdog` controller.
    register('__morgen_watchdog', controller);

}) (window.morgen.register,
    window.morgen.load,
    window.morgen.dispatch,
    window.__morgen);

