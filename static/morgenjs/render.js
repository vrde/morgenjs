(function (morgen, __morgen) {
    'use strict';

    var compile, lookup;

    compile = function (template) {
        return function (context) {
            context = context || {};
            return template.replace(/\{\{\s*(\w+)\s*\}\}/g, function(match, key) {
                return context[key];
            });
        };
    };


    morgen.cache = function (name, func) {
        __morgen.templates[name] = func;
    };


    morgen.render = function (name, context, element, callback) {
        var request, template = __morgen.templates[name];

        if (template) {
            element.innerHTML = template(context);

            if (callback)
                callback();

        } else {
            request = new XMLHttpRequest();
            request.open('GET', '/static/templates/' + name + '.html', false);

            request.onload = function (e) {
                var func = compile(this.responseText);
                __morgen.templates[name] = func;
                morgen.render(name, context, element, callback);
            };

            request.send();
        }
    };

}) (window.morgen,
    window.__morgen);

