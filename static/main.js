(function (register) {

    var tmpl = '<div class="main"><div data-scope="header"></div><div data-scope="content"></div></div>';


    register('main', function (c) {
        c.render(tmpl);
    });


}) (window.morgen.register);

