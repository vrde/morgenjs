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


            toggleClass: function (className) {
                proxy.each(function (elem) {
                    elem.classList.toggle(className);
                });

                return proxy;
            },


            prop: function (property, value) {
                if (!elems[0])
                    return;

                if (value !== undefined)
                    elems[0][property]= value;

                return elems[0][property];

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

