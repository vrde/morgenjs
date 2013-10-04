'use strict';

(function (window) {

    var controller = function (c) {
        var ws = new WebSocket("ws://localhost:8888/ws");

        c.events = {
                scope: ws,
                error: ws
            };
    };

    var reloadScript = function (src) {
        var oldElem  = document.querySelector("[src^='" + src + "']"),
            newElem  = document.createElement('script');

       newElem.src = [src, Math.random()].join('?');

       oldElem.parentNode.replaceChild(newElem, oldElem);
       return newElem;
    };

    var ws = new WebSocket("ws://localhost:8888/ws");

    ws.onopen  = function(evt) { console.log("socket opened"); };
    ws.onclose = function(evt) { console.log("socket closed"); };

    ws.onmessage = function(evt) {
        var filename = evt.data,
            root     = window.location.origin,
            src      = filename, //[root, filename].join(''),
            elem     = document.querySelector("[src^='" + src + "']");

        if (filename == '/templates/index.html')
            window.location.reload();

        if (elem) {
            reloadScript(src);
            console.log('core: reload', elem.src);
        } else {
            console.error('core: cannot find', src);
        }
    };

    window.ws = ws;

}) (window);


(function (window) {

    // TO BE REMOVED:
    var T = {
        main: '<div><h1>Hello, {{name}}!</h1></div>',
        cat : '<p>Space <a href="#">cat</a></p>'
    };



    // define what we need in this anon func
    var render, manageEvents, addEvents, removeEvents;


    render = function (template, context) {
        context = context || {};
        return T[template].replace(/\{\{\s*(\w+)\s*\}\}/g, function(match, key) {
            return context[key];
        });
    };

    // Add or remove event listeners to a set of objects.
    //
    // events  -- a dict formatted like `{ "<evt_name> <selector>": <function> }`
    // action  -- can be `add` or `remove`, default is `add`
    manageEvents = function (context, action) {
        var events, tokens, name, query, callback, objects;

        action = action || 'add';
        events = context.events || {};

        for (var key in events) {
            tokens   = key.split(' ');
            name     = tokens[0];
            query    = tokens[1];
            callback = events[key];

            objects = context.element.querySelectorAll(query);

            for (var i = 0; i < objects.length; i++) {
                objects[i][action + 'EventListener'](name, callback);
                console.log('[core]', action, name, 'to', objects[i]);
            }
        }
    };

    addEvents = function (context) {
        manageEvents(context);
    };

    removeEvents = function (context) {
        manageEvents(context, 'remove');
    };

    window.bind = function (controller, selector) {
        var context, element, load, unload, remove, innerRender;

        element = typeof selector == 'string' ? document.querySelector(selector) : selector;

        innerRender = function (template, data) {
            element.innerHTML = render(template, data);
        };

        load = function (ctx) {
            ctx = ctx || context;
            if (!ctx) return;

            // if there are some old listeners already binded,
            // remove them
            if (ctx.element._morgenContext)
                removeEvents(ctx.element._morgenContext);

            // bind the new listeners
            addEvents(ctx);

            // update the current context
            ctx.element._morgenContext = context;
        };

        unload = function (ctx) {
            ctx = ctx || context;
            if (!ctx) return;

            removeEvents(ctx);
        };

        remove = function (ctx) {
            ctx = ctx || context;
            if (!ctx) return;

            unload(ctx);
            ctx.element.parentNode.removeChild(ctx.element);
        };

        context = {
            element: element,
            render : innerRender,
            load   : load,
            unload : unload,
            remove : remove,
            events : null
        };

        controller(context);
        load();

        console.log('[core] loaded new controller for', selector);
    };

}) (window);

(function (window) {

}) (window);

