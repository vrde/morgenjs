(function (register, load, create, uid, model) {

    register('list', function (c) {

        c.events = {
            'submit form': function (e) {
                var value = c.$("input").value;
                model.add(c.db, { value: value });
                e.preventDefault();
            },

            'db:all': function (e) {
                console.debug('***');
                for (var i = 0; i < 1; i++)
                    c.element.appendChild(
                        create('item', { id: i, value: 'Hello ' + i }).element);
            }
        };


        c.render('list');
        model.all(c.db);

    });


}) (window.morgen.register,
    window.morgen.load,
    window.morgen.create,
    window.morgen.uid,
    window.myapp.model);

