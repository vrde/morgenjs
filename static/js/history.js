(function (register, dispatch, __morgen) {

    // Register a new controller to manage the History API.
    register('__morgen_history', function (c) {

        var path = window.location.pathname + window.location.search;

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
                var node = e.target,
                    href;

                while (node) {
                    if (node.attributes && node.attributes['data-push']) {
                        href = node.attributes['href'].value;
                        window.history.pushState({ href: href }, '', href);
                        dispatch('route', { href: href });

                        e.preventDefault();
                        return;
                    }

                    node = node.parentNode;
                }
            }
        }];

        // Dunno if useful
        // window.history.replaceState({ href: pathname }, '', pathname);

        // Push current route
        dispatch('route', { href: path });
    });

}) (window.morgen.register,
    window.morgen.dispatch,
    window.__morgen);

