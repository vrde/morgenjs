(function (morgen, __morgen) {

    'use strict';


    // define what we need in this anon func
    var render, manageEvents, addEvents, removeEvents, routePattern;



    // Super simple templating engine by Andrea di Persio
    render = function (template, context) {
        context = context || {};
        return template.replace(/\{\{\s*(\w+)\s*\}\}/g, function(match, key) {
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
            router, scope, objects, key,
            i, j, k;


        // the action to perform with the events, can be `add`, to add events,
        // or `remove`, to remove events.
        action = action || 'add';
        events = context.events || {};

        // We can manage arrays of events. If the param `events` is not an
        // array, we wrap it inside an array. This will be handy later
        if (!(events instanceof Array))
            events = [events];


        // Push global events!
        events.push(__morgen.events);


        // Push router events!
        if (context.routes) {
            router = morgen.createRouter(context.routes);
            events.push({
                '_scope': morgen.hub,
                'route': function (e) { router(e.detail.href); }
            });
        }


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

                        // `action` can be `, dispatchadd` or `remove`, so we are calling
                        // the method `addEventListener` or `removeEventListener`
                        objects[j][action + 'EventListener'](eventNames[k], callback);
                        //console.log('[core]', action, eventNames[k], 'to', objects[j]);

                        __morgen.totalListeners += action == 'add' ? 1 : -1;
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



    // Load a controller in the DOM, using the optional `extras` object.
    // Loading a controller will also render it in the DOM.
    //
    // Params:
    //   `name` -- a string containing the name of the controller to be used
    //   `selector` -- a string to be used with `document.querySelector`, or
    //                 a DOM Element. If the value is `undefined`, the selector
    //                 is set to `html`. To create a new DOM Node with the
    //                 specified controller, use the value `null` or use
    //                 the function `morgen.create`.
    //   `extras` -- an object with some extra values
    //
    // Return:
    //   The new context created.
    //
    morgen.load = function (name, selector, extras) {
        var context, element, controller, on, off, remove, innerRender, innerQuerySelector;

        if (selector === undefined)
            selector = 'html';

        element = typeof selector == 'string' ? document.querySelector(selector) : selector;
        controller = __morgen.controllers[name];


        if (!controller)
            throw "`" + name + "`" + " is not registered in the morgen scope!";


        // Helper function to render a template against data
        innerRender = function (template, data) {
            var html = render(template, data),
                tmp;

            if (element) {
                context.element.innerHTML = html;
            } else {
                tmp = document.createElement('div');
                tmp.innerHTML = html;
                context.element = tmp.firstChild;
            }

            context.element.setAttribute('data-tainted', '');

            return context.element;
        };


        innerQuerySelector = function (query) {
            return element.querySelector(query);
        };


        // Add the events to the context.
        on = function (ctx) {
            ctx = ctx || context;
            if (!ctx) return;

            // if there are some old listeners already binded,
            // remove them
            if (ctx && ctx.element && ctx.element.__morgenContexts)
                off(ctx.element.__morgenContexts[name]);

            // bind the new listeners
            addEvents(ctx);

            ctx.uid = __morgen.uid++;
            __morgen.contexts[ctx.name][ctx.uid] = ctx;

            // update the current context
            if (!ctx.element.__morgenContexts)
                ctx.element.__morgenContexts = {};

            ctx.element.__morgenContexts[name] = ctx;
        };


        // Remove the events from the context.
        off = function (ctx) {
            ctx = ctx || context;

            delete __morgen.contexts[ctx.name][ctx.uid];
            if (ctx.cleanup) ctx.cleanup();
            removeEvents(ctx);
        };


        // Remove the Node from the DOM.
        remove = function (ctx) {
            var i, key, children;

            ctx = ctx || context;
            if (!ctx) return;

            off(ctx);

            children = ctx.element.querySelectorAll('[data-tainted]');
            for (i = 0; i < children.length; i++)
                for (key in children[i].__morgenContexts)
                    off(children[i].__morgenContexts[key]);

            ctx.element.parentNode.removeChild(ctx.element);
        };

        // Initialize the context.
        context = {
            $      : innerQuerySelector,
            name   : name,
            element: element,
            render : innerRender,
            on     : on,
            off    : off,
            remove : remove,
            extras : extras,
            cleanup: null,
            events : null,
            routes : null
        };


        // Start the controller with the specified context.
        controller(context);

        // Start listen to the events
        on();

        console.log('[core] loaded new controller', name, 'in', element);

        return context;
    };


    // Load a controller in a new DOM Node, using the optional `extras` object.
    // Creating a controller will also render it in the DOM.
    //
    // Params:
    //   `name` -- a string containing the name of the controller to be used
    //   `extras` -- an object with some extra values
    //
    // Return:
    //   The new context created. The newly created DOM Node is stored in the
    //   `element` property.
    morgen.create = function (name, extras) {
        return morgen.load(name, null, extras);
    };


    // Reload a controller.
    morgen.reload = function (name) {
        var ctx;

        for (var key in __morgen.contexts[name]) {
            ctx = __morgen.contexts[name][key];
            morgen.load(name, ctx.element, ctx.extras);
        }
    };



    // Register a controller. If the controller has been already registered,
    // register it again and reload all the existing ones.
    morgen.register = function (name, controller) {

        // Remember if the controller was already there
        var alreadyThere = name in __morgen.controllers;

        // Save the new controller in the shared memory
        __morgen.controllers[name] = controller;

        if (alreadyThere)
            morgen.reload(name);
        else
            // If the controller has been registered for the first time
            // create an empty dict to contain all its contexts
            __morgen.contexts[name] = {};
    };


    // Centralized hub for messages. Controllers can
    // subscribe to it to receive messages.
    morgen.hub = document.querySelector('html');


    // Dispatch an event to all the subscribers to the `hub`.
    morgen.dispatch = function (name, payload) {
        console.debug('[dispatch]', name, payload);
        morgen.hub.dispatchEvent(new window.CustomEvent(name, { detail: payload }));
    };



}) (window.morgen, window.__morgen);

