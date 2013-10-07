(function (morgen, __morgen) {
    'use strict';

    var compile, lookup;

    morgen.compile = function (template) {
        return function (context) {
            context = context || {};
            return template.replace(/\{\{\s*(\w+)\s*\}\}/g, function(match, key) {
                return context[key];
            });
        };
    };


    morgen.registeTemplate = function (name, template) {
        __morgen.templates[name] = morgen.compile(template);
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
                var func = morgen.compile(this.responseText);
                __morgen.templates[name] = func;
                morgen.render(name, context, element, callback);
            };

            request.send();
        }
    };

}) (window.morgen,
    window.__morgen);

