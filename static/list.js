(function (register, load, create, uid) {

    register('list', function (c) {

        c.events = {
            'click a': function (e) { console.log('clicking on', e.target); },
            'submit form': function (e) {
                var value = c.$("input").value;
                c.element.appendChild(create('item', { id: uid(), value: value }).element);
                e.preventDefault();
            }
        };

        c.render('list');

        for (var i = 0; i < 5; i++)
            c.element.appendChild(
                create('item', { id: i, value: 'Hello ' + i }).element);

    });


}) (window.morgen.register,
    window.morgen.load,
    window.morgen.create,
    window.morgen.uid);

