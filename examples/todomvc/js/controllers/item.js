(function (app, register, dispatch) {
	'use strict';

    register('item', function (c) {
        c.events = {
            'change [type="checkbox"]': function (e) {
                c.extras.completed = e.target.checked;

                c.$().toggleClass('completed', c.extras.completed);
                app.model.put(c.db, c.extras);

                dispatch('list:update');
            },

            'dblclick label': function () {
                c.$().addClass('editing');
                c.$('.edit').focus();
            },

            'keypress .edit': function (e) {
                if (e.which == 13) {
                    c.extras.label = e.target.value;

                    c.$().removeClass('editing');
                    c.set('label', c.extras.label);
                    app.model.put(c.db, c.extras);
                }
            },

            'click .destroy': function () {
                app.model.del(c.db, c.extras.id);
                c.remove();
                dispatch('list:update');
            },

            'list:setAll': function (e) {
                c.extras.completed = e.detail;

                c.$().toggleClass('completed', c.extras.completed);
                c.$('[type="checkbox"]').checked(c.extras.completed);

                app.model.put(c.db, c.extras);
            },

            'list:clearAll': function () {
                if (c.extras.completed) {
                    app.model.del(c.db, c.extras.id);
                    c.remove();
                }
            }
        };


        c.render('item', c.extras);
        c.$().toggleClass('completed', c.extras.completed);
        c.$('[type="checkbox"]').checked(c.extras.completed);
    });

})(
    window.app,
    window.morgen.register,
    window.morgen.dispatch
);

