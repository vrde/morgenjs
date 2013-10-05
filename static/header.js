(function (register) {

    var tmpl = '<div><h1>Hello, {{name}}!</h1><div data-scope="container"></div></div>';

    register('header', function (c) {
        c.render(tmpl, { name: c.extras.name.toLowerCase() });
    });

}) (window.morgen.register);

