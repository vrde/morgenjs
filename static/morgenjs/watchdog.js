(function (register, load) {

    // All the stuff we need to keep an eye on the file
    // changes.


    'use strict';


    // Some nice variables.
    var reloadScript, controller;


    // Handy function to reload a script tag.
    reloadScript = function (src) {
        var oldElem  = document.querySelector("[src^='" + src + "']"),
            newElem  = document.createElement('script');

        // Add a cache buster to reload the new data.
        newElem.src = [src, Math.random()].join('?');

        // Replace the old node with the new one
        oldElem.parentNode.replaceChild(newElem, oldElem);
        return newElem;
    };


    // Controller responsible to watch changes.
    // It creates and manage a websocket to the server.
    controller = function (c) {
        var ws, log, onmessage;

        ws = new WebSocket("ws://localhost:8888/ws");


        // Nice generic function to log some events
        log = function (e) { console.log('[core] socket activity:', e.type); };


        // React on a new message
        onmessage = function(evt) {
            var filename = evt.data,
                src      = filename,
                elem     = document.querySelector("[src^='" + src + "']");

            // Still hardcoded, will be better one day.
            // If the index has changed, reload everything.
            if (filename == '/templates/index.html')
                window.location.reload();

            // If the DOM contains an element that loaded the
            // file that changed, reload the file.
            if (elem) {
                reloadScript(src);
                console.log('[core] reload', elem.src);
            } else {
                console.error('[core] cannot find', src);
            }
        };


        // Register the events we need
        c.events = {

            // Hey, look, we are using the `_scope` keyword to register
            // events on a specific object!
            '_scope'          : ws,

            // Here we are registering multiple events using a single
            // callback.
            'open,close,error': log,

            // And here the main callback.
            'message'         : onmessage
        };

        // If we reload this controller, we need to do some manual
        // house keeping, closing the websocket.
        //
        // Please note that the `onclose` event will not be logged:
        // the callbacks are removed *after* the cleanup but *before*
        // the browser event loop takes control. So no new events are
        // triggered.
        c.cleanup = function () {
            if (ws.readyState == ws.OPEN)
                ws.close();
        };
    };

    
    // Register the `ROOT` controller.
    register(controller, 'ROOT');

}) (window.morgen.register, window.morgen.load);

