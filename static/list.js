(function (register, load) {

    var tmpl = '<ul data-scope="items"></ul>';

    register('list', function (c) {

        c.events = {
            'click a': function (e) { console.log('ciao'); }
        };

        c.render(tmpl);

        for (var i = 0; i < 5; i++)
            c.element.appendChild(load('item', null, { value: i }).element);
    });


}) (window.morgen.register, window.morgen.load);

