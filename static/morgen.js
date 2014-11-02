(function (window, Ractive) {

    'use strict';

    var morgen = {
        __templates: { },

        // config dict for tweaking the main behaviour
        // can be manipulated using utils.config
        __config: {
            http: {
                apiRoot: null,
                withCredentials: false,
                appendParams: {}
            }
        },
    };

    window.morgen = morgen;


    function encodeData (data) {
        var query = [];
        for (var key in data)
            query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        return query.join('&');
    }

    function updateDict (src, dest) {
        for (var key in src)
            if (typeof(src[key]) == 'object')
                updateDict(src[key], dest[key]);
            else
                dest[key] = src[key];
    }

    function isEmpty(obj) {
        if (!obj)
            return false;

        for (var prop in obj)
            if (obj.hasOwnProperty(prop)) return false;

        return true;
    }

    function makeproxy (elems) {


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

            prependChild: function (child) {
                proxy.each(function (elem) {
                    if (elem.firstChild)
                        elem.insertBefore(child, elem.firstChild);
                    else
                        elem.appendChild(child);
                });

                return proxy;
            },

            appendChild: function (child) {
                proxy.each(function (elem) {
                    elem.appendChild(child);
                });

                return proxy;
            },

            swapClass: function (classFrom, classTo) {
                proxy.each(function (elem) {
                    if (elem.classList.contains(classFrom)) {
                        elem.classList.remove(classFrom);
                        elem.classList.add(classTo);
                    } else if (elem.classList.contains(classTo)) {
                        elem.classList.remove(classTo);
                        elem.classList.add(classFrom);
                    } else {
                        elem.classList.add(classTo);
                    }
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
                    if (v === undefined)
                        elem.classList.toggle(className);
                    else
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


    morgen.query = function (selector) {
        return makeproxy(document.querySelectorAll(selector));
    };

    morgen.queryone = function (selector) {
        return morgen.query(selector).get(0);
    };

    

    morgen.updateConfig = function (data) {
        updateDict(data, morgen.__config);
    };


    morgen.httpSend = function (method, url, data, success, error) {
        var xhr = new XMLHttpRequest(),
            contentType = method == 'get' ? 'text/plain' : 'application/x-www-form-urlencoded'

        if (morgen.__config.http.apiRoot)
            url = morgen.__config.http.apiRoot + url

        if (!isEmpty(morgen.__config.http.appendParams))
            url = [url, encodeData(morgen.__config.http.appendParams)].join(url.indexOf('?') == -1 ? '?' : '&');

        xhr.open(method, url, true);
        xhr.withCredentials = morgen.__config.http.withCredentials;
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Content-Type', contentType + ';charset=UTF-8');
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                if (xhr.status == 200 || xhr.status === 0)
                    success && success(JSON.parse(xhr.responseText));
                else
                    error && error();
            }
        };

        xhr.onerror = error;
        xhr.ontimeout = error;

        try {
            xhr.send(data);
        } catch (e) {
            error && error();
        }

        return xhr;
    };


    morgen.httpGet = function (url, data, success, error) {
        // FIXME: this is a bit shitty
        if (typeof(data) == 'function') {
            error = success;
            success = data;
            data = null;
        }
        if (data) {
            url = url + '?' + encodeData(data)
        }
        return morgen.httpSend('get', url, null, success, error);
    };


    morgen.httpPost = function (url, data, success, error) {
        // FIXME: this is a bit shitty
        if (typeof(data) == 'function') {
            error = success;
            success = data;
            data = null;
        }
        return morgen.httpSend('post', url, data instanceof FormData ? data : encodeData(data), success, error);
    };


    morgen.cookie = function (name, value) {
        // thanks to:
        //  - http://stackoverflow.com/a/11344672/597097
        //  - https://developer.mozilla.org/en-US/docs/Web/API/document.cookie

        // read cookie
        if (value === undefined) {
            var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
            return result === null ? undefined : JSON.parse(decodeURIComponent(result[1]));
        }
        // delete cookie
        else if (value === null) {
              document.cookie = [name, '=; expires=Thu, 01-Jan-1970 00:00:01 GMT;'].join('');
        }
        // write cookie
        else {
              document.cookie = [name, '=', encodeURIComponent(JSON.stringify(value)), '; path=/', '; max-age=', 60*60*24*365].join('');
        }
    };

    morgen.template = function (name, template) {
        if (template !== undefined)
            morgen.__templates[name] = Ractive.parse(template);
        return morgen.__templates[name];
    };




    /**
     * Routing things
     */


    function parseParams (query) {
        // http://stackoverflow.com/a/2880929
        var match,
            pl     = /\+/g,  // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
            urlParams = {};

        while (match = search.exec(query))
            urlParams[decode(match[1])] = decode(match[2]);

        return urlParams;
    }

    // Transform a string to a function implementing the rule.
    // E.g. from "post/:date/:id" to a function able to match
    // strings with the same pattern.
    function createRule (rule) {
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
    }


    // Function to create a router from an array of rules.
    function makeDispatcher (routes) {
        var rules = [],
            // Enums to map the route structure
            RULE = 0,
            FUNC = 1;

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
    }

    morgen.router = function (routes) {
        var dispatcher = makeDispatcher(routes),
            path = window.location.pathname + window.location.search;

        window.addEventListener('popstate', function (e) {
            var href = e.state.href;
            dispatcher(href);
        });

        document.addEventListener('click', function (e) {
            var node = e.target,
                href;

            while (node) {
                if (node.attributes && node.attributes['href']) {
                    href = node.attributes['href'].value;
                    if (href[0] == '/') {
                        window.history.pushState({ href: href }, '', href);
                        dispatcher(href);

                        e.preventDefault();
                    }
                    return;
                }

                node = node.parentNode;
            }
        });

        dispatcher(path);
    }

}) (window, Ractive);
