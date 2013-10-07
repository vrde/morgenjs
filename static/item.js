(function (register) {

    register('item', function (c) {

        c.events = {
            'click .foo': function (e) {alert('bar');},
            'click .edit': function (e) { console.log('edit', c.extras.value); },
            'click .remove': function (e) { console.log('remove'); c.remove(); }
        };

        c.render('item', c.extras);
        c.ready();
    });


}) (window.morgen.register);

