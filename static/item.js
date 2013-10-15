(function (register, model) {

    register('item', function (c) {

        c.events = {
            'click .foo': function (e) {alert('fabiooohhhhh');},
            'click .edit': function (e) { console.log('edit', c.extras.value); },
            'click .remove': function (e) { model.del(c.db, c.extras.id); }
        };

        c.render('item', c.extras);
    });


}) (window.morgen.register,
    window.myapp.model);

