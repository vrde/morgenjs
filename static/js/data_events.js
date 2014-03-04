(function (register, dispatch, __morgen) {

    register('__morgen_data_events', function (c) {

        var pathname = window.location.pathname;

        c.events = {
            '_scope': document,

            'click': function (e) {
                var node = e.target,
                    originalNode = node,
                    href;

                while (node) {
                    if (node.attributes && node.attributes['data-dispatch']) {
                        eventName = node.attributes['data-dispatch'].value;
                        dispatch(eventName, { target: originalNode });

                        // DO NOT DISPATCH EVENTS ATTACHED TO THE PARENTS
                        return;
                    }

                    node = node.parentNode;
                }
            }
        };
    });

}) (window.morgen.register,
    window.morgen.dispatch,
    window.__morgen);

