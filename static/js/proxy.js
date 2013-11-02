(function (morgen) {
    'use strict';

    morgen.makeproxy = function (elems) {


        if (!(elems instanceof NodeList))
            elems = [elems];


        var proxy = {

            each: function (f) {
                var elem, i = 0;
                while (elem = elems[i++]) {
                    f(elem);
                }

                return proxy;
            },

            get: function (i) {
                return proxy.array[i];
            },

            appendChild: function (child) {
                proxy.each(function (elem) {
                    elem.appendChild(child);
                });

                return proxy;
            },

            addClass: function (className) {
                proxy.each(function (elem) {
                    elem.classList.add(className);
                });

                return proxy;
            },


            removeClass: function (className) {
                proxy.each(function (elem) {
                    elem.classList.remove(className);
                });

                return proxy;
            },


            toggleClass: function (className, v) {
                proxy.each(function (elem) {
                    elem.classList.toggle(className, v);
                });

                return proxy;
            },


            focus: function () {
                if (!elems[0])
                    return;

                return elems[0].focus();
            },


            prop: function (property, value) {
                if (!elems[0])
                    return;

                if (value !== undefined)
                    elems[0][property] = value;

                return elems[0][property];

            },


            setAttribute: function (property, value) {
                return proxy.prop(property, value);
            },


            value: function (v) {
                return proxy.prop('value', v);
            },


            textContent: function (v) {
                return proxy.prop('textContent', v);
            },


            checked: function (v) {
                return proxy.prop('checked', v);
            },


            length: elems.length,


            array: elems

        };

        return proxy;
    };


}) (window.morgen);

