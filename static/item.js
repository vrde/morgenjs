(function (register) {

    var tmpl = '<li><a href="/item/{{id}}" data-push>{{value}}</a> <button class="foo">Fooo</button><button class="edit">Edit</button><button class="remove">Remove</button></li>';

    register('item', function (c) {

        c.events = {
            'click .foo': function (e) {alert('bar');},
            'click .edit': function (e) { console.log('edit', c.extras.value); },
            'click .remove': function (e) { console.log('remove'); c.remove(); }
        };

        c.render(tmpl, c.extras);

    });


}) (window.morgen.register);

