(function (morgen) {
    // The module `route` provides a function to parse a set of rules.

    'use strict';

    var // Enums to map the route structure
        RULE = 0,
        FUNC = 1,

        parseParams = function (query) {
            // http://stackoverflow.com/a/2880929
            var match,
                pl     = /\+/g,  // Regex for replacing addition symbol with a space
                search = /([^&=]+)=?([^&]*)/g,
                decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
                urlParams = {};

            while (match = search.exec(query))
                urlParams[decode(match[1])] = decode(match[2]);

            return urlParams;
        },

        // Transform a string to a function implementing the rule.
        // E.g. from "post/:date/:id" to a function able to match
        // strings with the same pattern.
        createRule = function (rule) {
            var re = new RegExp('^' + rule.replace(/:\w+/g, '([^\\/]+)') + '$', 'g');

            return function (path) {
                var tokens = path.split('?'),
                    loc    = tokens[0],
                    query  = tokens[1],
                    match = re.exec(loc),
                    params;

                // This allows to reuse the regexp
                re.lastIndex = 0;

                if (!match)
                    return;

                match.shift();

                if (query)
                    params = parseParams(query);

                if (params)
                    match.push(params);

                return match;
            };
        };


    // Function to create a router from an array of rules.
    morgen.createRouter = function (routes) {
        var rules = [];

        for (var i = 0; i < routes.length; i++)
            rules.push([
                createRule(routes[i][RULE]),
                routes[i][FUNC]
            ]);


        return function (path) {
            var args;

            for (var i = 0; i < rules.length; i++) {
                args = rules[i][RULE](path);

                if (args)
                    return rules[i][FUNC].apply(null, args);
            }
        };

    };

}) (window.morgen);

