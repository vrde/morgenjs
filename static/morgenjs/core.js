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



    // Super simple templating engine by Andrea di Persio
    render = function (template, context) {
        context = context || {};
        return T[template].replace(/\{\{\s*(\w+)\s*\}\}/g, function(match, key) {
            return context[key];
        });
    };



    // Add or remove event listeners to a set of objects.
    //
    // context -- the context to use
    // action  -- can be `add` or `remove`, default is `add`
    //
    // The function is quite long and nested, but not difficult to understand.
    manageEvents = function (context, action) {
        var events, tokens, eventNames, query, callback,
            scope, objects, key,
            i, j, k;


        // the action to perform with the events, can be `add`, to add events,
        // or `remove`, to remove events.
        action = action || 'add';
        events = context.events || {};

        // We can manage arrays of events. If the param `events` is not an
        // array, we wrap it inside an array. This will be handy later
        if (!(events instanceof Array))
            events = [events];


        // Iterate all over the events in our list.
        for (i = 0; i < events.length; i++) {

            // By default, event registration happens on a DOM level, adding
            // the classic events like `click`, `blur` etc. on a node.
            //
            // But sometimes, we need to register events on an object like a
            // socket, for example. Those kind of objects don't live in a DOM
            // level, so a simple selector cannot find them.
            //
            // This is why the event hash can define a `_scope` to be used to
            // register events on specific objects, or scopes.
            scope = events[i]['_scope'];


            // A scope can be an Array as well.
            if (scope && !(scope instanceof Array))
                scope = [scope];

            // Now we iterate all over the events defined in the context of the
            // controller.
            for (key in events[i]) {

                // If we are visiting the keyword we use to define the scope,
                // skip.
                if (key == '_scope') continue;

                // Split the key on the space, since the canonical format is
                // something like: `click a.menu`
                tokens     = key.split(' ');

                // Take the first half. It contais the name of the events to
                // bind. The format can be a simple string, such as `click`,
                // or something more complex, as a list of events.
                // If you need a list of events, split them with a comma, like:
                // `click,blur,keydown`.
                eventNames = tokens[0].split(',');

                // And then, the second half is the string we need to use for
                // the querySelector. The second half can be omitted, if we
                // specify a `_scope`.
                query      = tokens[1];

                // Extract the callback from the hash.
                callback   = events[i][key];

                // And calculate the objects to which the events are added.
                // If a `scope` has been defined, use it.
                objects = scope || context.element.querySelectorAll(query);

                // Attach, or detach, the listener to every object found.
                for (j = 0; j < objects.length; j++) {
                    for (k = 0; k < eventNames.length; k++) {

                        // `action` can be `add` or `remove`, so we are calling
                        // the method `addEventListener` or `removeEventListener`
                        objects[j][action + 'EventListener'](eventNames[k], callback);
                        console.log('[core]', action, eventNames[k], 'to', objects[j]);
                    }
                }
            }
        }
    };



    // Add events to context
    addEvents = function (context) {
        manageEvents(context);
    };



    // Remove events to context
    removeEvents = function (context) {
        manageEvents(context, 'remove');
    };



    // Bind a controller to the DOM, using the optional `extras` object.
    // Binding a controller will also render it in the DOM.
    //
    // Params:
    //   `name` -- a string containing the name of the controller to be used
    //   `selector` -- a string to be used with `document.querySelector`, or
    //                 a DOM Element.
    //   `extras` -- an object with some extra values
    //
    morgen.bind = function (name, selector, extras) {
        var context, element, load, unload, remove, innerRender;

        element = typeof selector == 'string' ? document.querySelector(selector) : selector;

        // Helper function to render a template against data
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


