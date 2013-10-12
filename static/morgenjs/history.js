(function (register, dispatch, __morgen) {

    // Register a new controller to manage the History API.
    register('__morgen_history', function (c) {

        var pathname = window.location.pathname;

        c.events = [{
            '_scope': window,

            'popstate': function (e) {
                if (e.state)
                    dispatch('route', e.state);
                else
                    console.warn('[history] dropping routing with empty state');
            }
        }, {
            '_scope': document,

            'click': function (e) {
                var attrs = e.target.attributes,
                    href;

                if ('data-push' in attrs) {
                    href = e.target.attributes.href.value;
                    window.history.pushState({ href: href }, '', href);
                    dispatch('route', { href: href });

                    e.preventDefault();
                }
            }
        }];

        // Push current route
        window.history.replaceState({ href: pathname }, '', pathname);
        dispatch('route', { href: pathname });
    });

}) (window.morgen.register,
    window.morgen.dispatch,
    window.__morgen);

