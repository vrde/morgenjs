(function (morgen) {
    // The module `route` provides a function to parse a set of rules.

    'use strict';

    var // Enums to map the route structure
        RULE = 0,
        FUNC = 1,

        // Transform a string to a function implementing the rule.
        // E.g. from "post/:date/:id" to a function able to match
        // strings with the same pattern.
        createRule = function (rule) {
            var re = new RegExp('^' + rule.replace(/:\w+/g, '(\\w+)') + '$', 'g');

            return function (path) {
                var match = re.exec(path);

                // This allows to reuse the regexp
                re.lastIndex = 0;

                if (!match)
                    return;

                match.shift();

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

