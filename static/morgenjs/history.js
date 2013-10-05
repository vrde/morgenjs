(function (register) {

    register('__morgen_history', function (c) {

        c.events = {
            '_scope': window,

            'popstate': function (e) {
                console.log('popstate', e);
            }
        };

    });

}) (window.morgen.register);

