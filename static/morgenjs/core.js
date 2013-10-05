(function (morgen, __morgen) {

    'use strict';


    // TO BE REMOVED:
    var T = {
        main: '<div><h1>Hello, {{name}}!</h1><div data-view="list"></div></div>',
        list: '<ul></ul>',
        listitem: '<li><a href="{{url}}">{{title}}</a></li>',
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

    morgen.bind = function (name, selector, extras) {
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
            if (ctx && ctx.element && ctx.element.__morgenContext)
                unload(ctx.element.__morgenContext);

            // bind the new listeners
            addEvents(ctx);

            ctx.uid = __morgen.uid++;
            __morgen.contexts[ctx.name][ctx.uid] = ctx;

            // update the current context
            ctx.element.__morgenContext = ctx;
        };

        unload = function (ctx) {
            ctx = ctx || context;

            delete __morgen.contexts[ctx.name][ctx.uid];
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
            name   : name,
            element: element,
            render : innerRender,
            load   : load,
            unload : unload,
            remove : remove,
            extras : extras,
            cleanup: null,
            events : null
        };

        __morgen.controllers[name](context);
        load();

        console.log('[core] loaded new controller for', selector);
    };

    morgen.reload = function (name) {
        var ctx;

        for (var key in __morgen.contexts[name]) {
            ctx = __morgen.contexts[name][key];
            morgen.bind(name, ctx.element, ctx.extras);
        }
    };

    morgen.register = function (controller, name) {
        var alreadyThere = name in __morgen.controllers;

        __morgen.controllers[name] = controller;

        if (alreadyThere)
            morgen.reload(name);
        else
            __morgen.contexts[name] = {};
    };

}) (window.morgen, window.__morgen);


