(function (window) {

    'use strict';


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
    //            or an array of dict.
    // action  -- can be `add` or `remove`, default is `add`
    manageEvents = function (context, action) {
        var events, tokens,
            eventNames, query, callback,
            scope, objects,
            key,
            i, j, k;

        action = action || 'add';
        events = context.events || {};

        if (!(events instanceof Array))
            events = [events];

        for (i = 0; i < events.length; i++) {
            scope = events[i]['_scope'];

            if (scope && !(scope instanceof Array))
                scope = [scope];

            for (key in events[i]) {
                if (key == '_scope') continue;

                tokens     = key.split(' ');
                eventNames = tokens[0].split(',');
                query      = tokens[1];
                callback   = events[i][key];

                objects = scope || context.element.querySelectorAll(query);

                for (j = 0; j < objects.length; j++) {
                    for (k = 0; k < eventNames.length; k++) {
                        objects[j][action + 'EventListener'](eventNames[k], callback);
                        console.log('[core]', action, eventNames[k], 'to', objects[j]);
                    }
                }
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
            if (ctx && ctx.element && ctx.element._morgenContext)
                unload(ctx.element._morgenContext);

            // bind the new listeners
            addEvents(ctx);

            // update the current context
            ctx.element._morgenContext = context;
        };

        unload = function (ctx) {
            ctx = ctx || context;

            if (ctx.cleanup) ctx.cleanup();
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
            cleanup: null,
            events : null
        };

        controller(context);
        load();

        console.log('[core] loaded new controller for', selector);
    };

}) (window);


(function (bind) {
    var reloadScript, controller;

    reloadScript = function (src) {
        var oldElem  = document.querySelector("[src^='" + src + "']"),
            newElem  = document.createElement('script');

       newElem.src = [src, Math.random()].join('?');

       oldElem.parentNode.replaceChild(newElem, oldElem);
       return newElem;
    };

    controller = function (c) {
        var ws, log, onmessage;

        ws = new WebSocket("ws://localhost:8888/ws");

        log = function (e) { console.log('[core] socket activity:', e.type); };

        onmessage = function(evt) {
            var filename = evt.data,
                root     = window.location.origin,
                src      = filename,
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

        c.events = {
            '_scope'          : ws,
            'open,close,error': log,
            'message'         : onmessage
        };

        c.cleanup = function () {
            if (ws.readyState == ws.OPEN)
                ws.close();
        };
    };
    
    bind(controller, 'html');

}) (window.bind);

