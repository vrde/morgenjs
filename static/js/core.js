(function (morgen, __morgen) {
    'use strict';


    // define what we need in this anon func
    var render, manageEvents, addEvents, removeEvents, routePattern;


    // Add or remove event listeners to a set of objects.
    //
    // context -- the context to use
    // action  -- can be `add` or `remove`, default is `add`
    //
    // The function is quite long and nested, but not difficult to understand.
    manageEvents = function (context, action) {
        var events, tokens, eventNames, query, callback,
            router, scope, objects, key,
            nodeListeners, i, j, k, listenerIndex;


        // the action to perform with the events, can be `add`, to add events,
        // or `remove`, to remove events.
        action = action || 'add';

        events = context.events;

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
                tokens = key.split(' ');

                // Take the first half. It contais the name of the events to
                // bind. The format can be a simple string, such as `click`,
                // or something more complex, as a list of events.
                // If you need a list of events, split them with a comma, like:
                // `click,blur,keydown`.
                eventNames = tokens[0].split(',');

                // And then, the second half is the string we need to use for
                // the querySelector. The second half can be omitted, if we
                // specify a `_scope`.
                query = tokens[1];

                // Extract the callback from the hash.
                callback = events[i][key];

                // And calculate the objects to which the events are added.
                // If a `scope` has been defined, use it.
                objects = scope || (query && context.element.querySelectorAll(query)) || [morgen.hub];

                // Attach, or detach, the listener to every object found.
                for (j = 0; j < objects.length; j++) {
                    for (k = 0; k < eventNames.length; k++) {

                        if (!objects[j].__morgenListeners) {
                            objects[j].__morgenListeners = {};
                        }

                        nodeListeners = objects[j].__morgenListeners;

                        if (!nodeListeners[eventNames[k]])
                            nodeListeners[eventNames[k]] = [];

                        if (action == 'add') {
                            nodeListeners[eventNames[k]].push(callback);

                            // attach the event to the DOM element
                            objects[j].addEventListener(eventNames[k], callback);
                            //console.log('[core] -- addEventListener', eventNames[k], objects[j]);

                            __morgen.totalListeners++;
                        } else {
                            listenerIndex = nodeListeners[eventNames[k]].indexOf(callback);
                            if (listenerIndex != -1) {
                                // remove the event to the DOM element
                                objects[j].removeEventListener(eventNames[k], callback);
                                //console.log('[core] -- removeEventListener', eventNames[k], objects[j]);

                                nodeListeners[eventNames[k]].splice(listenerIndex, 1);
                                __morgen.totalListeners--;
                            }
                        }
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
        var context, element, controller,
            on, off, getValue, setValue, proxy,
            remove, innerRender, innerQuerySelector, innerQuerySelectorAll,
            unwrap;

        if (selector === undefined)
            selector = 'html';

        element = typeof selector == 'string' ? document.querySelector(selector) : selector;

        if (!element) {
            element = document.createElement('div');
            unwrap  = true;
        }

        controller = __morgen.controllers[name];


        if (!controller)
            throw "`" + name + "`" + " is not registered in the morgen scope!";


        // Helper function to render a template against data
        innerRender = function (name, data, callback) {
            var ctx = context,
                newElement, __morgenContexts;

            // if there are some old listeners already binded,
            // remove them
            if (ctx && ctx.element
                    && ctx.element.__morgenContexts
                    && ctx.element.__morgenContexts[ctx.name])
                off(ctx.element.__morgenContexts[ctx.name]);

            // Remember where the template has been used
            if (!__morgen.tmpl2ctrl[name])
                __morgen.tmpl2ctrl[name] = { };
            __morgen.tmpl2ctrl[name][ctx.name] = true;

            morgen.render(name, data, ctx.element, callback);

            if (unwrap) {
                ctx.element = ctx.element.firstChild;
            } else if (ctx && ctx.element && ctx.__unwrap && ctx.element.firstChild) {
                newElement = ctx.element.firstChild;

                ctx.element.firstChild.__morgenContexts = ctx.element.__morgenContexts;
                ctx.element.parentNode.replaceChild(
                    ctx.element.firstChild, ctx.element);

                ctx.element = newElement;
            }


            ctx.element.setAttribute('morgen-has-context', '');

            return ctx.element;
        };


        innerQuerySelector = function (query) {
            return context.element.querySelector(query);
        };

        innerQuerySelectorAll = function (query) {
            return context.element.querySelectorAll(query);
        };

        proxy = function (query) {
            var elems = context.element.querySelectorAll(query);

            if (query)
                elems = context.element.querySelectorAll(query);
            else
                elems = context.element;

            return morgen.makeproxy(elems);
        };

        // Add the events to the context.
        on = function (ctx) {
            var router;

            ctx = ctx || context;
            if (!ctx) return;

            // We can manage arrays of events. If the param `events` is not an
            // array, we wrap it inside an array. This will be handy later
            if (!(ctx.events instanceof Array))
                ctx.events = ctx.events ? [ctx.events] : [];

            // Push router events!
            if (ctx.routes) {
                router = morgen.createRouter(ctx.routes);
                ctx.events.push({
                    'route': function (e) { router(e.detail.href); }
                });
            }

            // if there are some old listeners already binded,
            // remove them
            if (ctx && ctx.element
                    && ctx.element.__morgenContexts
                    && ctx.element.__morgenContexts[ctx.name])
                off(ctx.element.__morgenContexts[ctx.name]);


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

            // FIXME: this needs more love. Handling recursive
            // context handling is quite tricky
            var children = ctx.element.querySelectorAll('[morgen-has-context]'),
                i, key;
            for (i = 0; i < children.length; i++)
                for (key in children[i].__morgenContexts)
                    children[i].__morgenContexts[key].off();


            delete __morgen.contexts[ctx.name][ctx.uid];
            if (ctx.cleanup) ctx.cleanup();
            removeEvents(ctx);
        };

        setValue = function (modelName, value) {
            var elems    = context.element.querySelectorAll('[data-model="' + modelName + '"]'),
                oldValue = getValue(modelName),
                newValue = typeof value == "function" ? value(oldValue) : value,
                i, tag, prop, elem;

            for (i = 0, elem = elems[0]; elem; elem = elems[++i]) {
                tag  = elem.tagName.toLowerCase(),
                prop = tag == 'input' ? 'value' : 'textContent';
                elem[prop] = newValue;
            }
        };

        getValue = function (modelName) {
            var elem = context.element.querySelector('[data-model="' + modelName + '"]'),
                tag  = elem.tagName.toLowerCase(),
                prop = tag == 'input' ? 'value' : 'textContent';

            if (elem)
                return elem[prop];
        };

        // Remove the Node from the DOM.
        remove = function (ctx) {
            var i, key, children;

            ctx = ctx || context;
            if (!ctx) return;

            off(ctx);

            children = ctx.element.querySelectorAll('[morgen-has-context]');
            for (i = 0; i < children.length; i++)
                for (key in children[i].__morgenContexts)
                    children[i].__morgenContexts[key].off();

            ctx.element.remove();
        };

        // Initialize the context.
        context = {
            $      : proxy,
            name   : name,
            element: element,
            render : innerRender,
            on     : on,
            off    : off,

            set    : setValue,
            get    : getValue,

            remove : remove,
            extras : extras,

            db     : null,
            cleanup: null,
            events : null,
            routes : null,

            __unwrap: unwrap
        };


        // Start the controller with the specified context.
        morgen.getDB(function (db) {
            context.db = db;
            controller(context);
            on();
        });

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
        var ctx, reloaded = [];

        for (var key in __morgen.contexts[name]) {
            ctx = __morgen.contexts[name][key];
            morgen.load(name, ctx.element, ctx.extras);
            ctx.element.classList.add('__morgen-reload');
            reloaded.push(ctx.element);
        }

        setTimeout(function () {
            for (var i = 0; i < reloaded.length; i++)
                reloaded[i].classList.remove('__morgen-reload');
        }, 1000);
    };


    morgen.remove = function (selector) {
        var elements = typeof selector == 'string' ? document.querySelector(selector) : selector,
            contexts, i, key;

        if (!(elements instanceof Array))
            elements = [elements];

        for (i = 0; i < elements.length; i++) {
            contexts = elements[i].__morgenContexts;

            for (key in contexts)
                contexts[key].off();

            if (elements[i].parentNode)
                elements[i].parentNode.removeChild(elements[i]);
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

        return controller;
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

