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


    morgen.registerTemplate = function (name, template) {
        __morgen.templates[name] = morgen.compile(template);
    };

    morgen.render = function (name, context, element) {
        var template = __morgen.templates[name];
        element.innerHTML = template(context);
    };

}) (window.morgen,
    window.__morgen);

