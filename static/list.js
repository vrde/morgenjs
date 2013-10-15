(function (register, load, create, uid, model) {

    register('list', function (c) {

        c.events = {
            'submit form': function (e) {
                var value = c.$("input").value;
                model.add(c.db, { value: value });
                e.preventDefault();
            },

            'db:all': function (e) {
                var list = e.detail,
                    r;

                for (var i = 0; i < list.length; i++) {
                    r = list[i];
                    c.element.appendChild(
                        create('item', { id: r.id, value: r.value }).element);
                }
            },

            'db:add': function (e) {
                var r = e.detail;
                c.element.appendChild(create('item', { id: r.id, value: r.value }).element);
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

