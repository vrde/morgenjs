(function (morgen, app) {
	'use strict';

    morgen.register('list', function (c) {

        var add = function (data) {
            var el = morgen.create('item', data).element;

            c.$('#todo-list').appendChild(el);
            morgen.dispatch('list:update');
        };

        var all = function (rs) {
            var i  = 0, c;

            while (c = rs[i++])
                add(c);
        };

        c.routes = [
            ['/', function () {
                c.$('#todo-list').removeClass('only-completed');
                c.$('#todo-list').removeClass('only-active');
            }],
            ['/active', function () {
                c.$('#todo-list').removeClass('only-completed');
                c.$('#todo-list').addClass('only-active');
            }],
            ['/completed', function () {
                c.$('#todo-list').removeClass('only-active');
                c.$('#todo-list').addClass('only-completed');
            }]
        ];

        c.events = {
            'submit #new-todo-form': function (e) {
                app.model.put(c.db, { label: c.get('newtodo') });
                c.set('newtodo', '');
                e.preventDefault();
            },

            'change #toggle-all': function (e) {
                var s = e.target.checked;

                morgen.dispatch('list:setAll', s);
                morgen.dispatch('list:update');
            },

            'click #clear-completed': function () {
                morgen.dispatch('list:clearAll');
                morgen.dispatch('list:update');
            },

            'db:add': function (e) {
                add(e.detail);
            },

            'list:update': function () {
                var left      = c.$('.todo-item:not(.completed)').length,
                    completed = c.$('.todo-item.completed').length;

                c.set('left', left);
                c.set('completed', completed);

                c.$('#clear-completed').toggleClass('hidden', !completed);
                c.$('#toggle-all').checked(!left);
            },

            'route': function (e) {
                var href = e.detail.href;

                c.$('#filters .selected').removeClass('selected');
                c.$('#filters a[href="' + href + '"]').addClass('selected');
            }
        };

        c.render('todo');

        app.model.all(c.db, all);
    });

})(window.morgen,
   window.app);

