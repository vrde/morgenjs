(function (register, load, create) {

    var tmpl = '<div><form><input /></form><ul data-scope="items"></ul></div>';

    register('list', function (c) {

        c.events = {
            'click a': function (e) { console.log('ciao'); },
            'submit form': function (e) {
                var value = c.$("input").value;
                c.element.appendChild(create('item', { value: value }).element);
                e.preventDefault();
            }
        };

        c.render(tmpl);

        for (var i = 0; i < 5; i++)
            c.element.appendChild(
                create('item', { value: 'item number ' + i }).element);
    });


}) (window.morgen.register, window.morgen.load, window.morgen.create);

