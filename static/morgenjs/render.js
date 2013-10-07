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
        var alreadyThere = name in __morgen.templates,
            key;

        __morgen.templates[name] = morgen.compile(template);

        if (alreadyThere)
            for (key in __morgen.tmpl2ctrl[name])
                morgen.reload(key);
    };

    morgen.render = function (name, context, element) {
        var template = __morgen.templates[name];
        element.innerHTML = template(context);
    };

}) (window.morgen,
    window.__morgen);

