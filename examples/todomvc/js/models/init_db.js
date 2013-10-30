(function (register, initDB) {

    'use strict';

    register('init_db', function (c) {

        initDB('todomvc', 1);

        var upgradeDB = function (e) {
            var db = e.detail.db,
                objectStore;

            if (!db.objectStoreNames.contains('todos')) {
                objectStore = db.createObjectStore('todos', {
                    keyPath: 'id',
                    autoIncrement: true
                });
            }
        };

        c.events = {
            'upgrade_db': upgradeDB
        };

    });

}) (window.morgen.register,
    window.morgen.initDB);

