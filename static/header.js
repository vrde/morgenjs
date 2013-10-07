(function (register) {

    var tmpl = '<div><h1>Hello, {{name}}!</h1><a href="/" data-push>home</a><div data-scope="container"></div></div>';

    register('header', function (c) {
        c.render(tmpl, { name: c.extras.name.toUpperCase() });

        c.ready();
    });


}) (window.morgen.register);

