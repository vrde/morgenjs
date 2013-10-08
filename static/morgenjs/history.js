(function (register, dispatch, __morgen) {

    // Register a new global event, to be binded to all
    // the elements containing `[data-push]`.
    __morgen.events = {
        'click [data-push]': function (e) {
            var href = e.target.attributes.href.value;

            window.history.pushState({ href: href }, '', href);
            dispatch('route', { href: href });

            e.preventDefault();
        }
    };


    // Register a new controller to manage the History API.
    register('__morgen_history', function (c) {

        c.events = {
            '_scope': window,

            'popstate': function (e) {
                if (e.state)
                    dispatch('route', e.state);
                else
                    console.warn('[history] dropping routing with empty state');
            }
        };

        c.ready();
    });

}) (window.morgen.register,
    window.morgen.dispatch,
    window.__morgen);

