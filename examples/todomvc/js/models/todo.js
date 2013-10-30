(function (ns, dispatch) {

    'use strict';

    ns.app.model = {

        all: function (db, success) {
            var objectStore = db.transaction('todos').objectStore('todos'),
                buffer = [];

            objectStore.openCursor().onsuccess = function (e) {
                var cursor = e.target.result;

                if (cursor) {
                    buffer.push(cursor.value);
                    cursor.continue();
                } else {
                    success(buffer);
                }
            };
        },

        put: function (db, data, success) {
            var transaction = db.transaction('todos', 'readwrite'),
                objectStore = transaction.objectStore('todos'),
                request = objectStore.put(data);

            request.onsuccess = function (e) {
                var action = data.id == e.target.result ? 'update' : 'add';

                data.id = e.target.result;
                success && success(data);
                dispatch('db:' + action + ':' + data.id, data);
                dispatch('db:' + action, data)
            };
        },

        del: function (db, id, success) {
            var transaction = db.transaction('todos', 'readwrite'),
                objectStore = transaction.objectStore('todos'),
                request = objectStore.delete(id);

            request.onsuccess = function () {
                success && success(data);
                dispatch('db:del:' + id, id);
                dispatch('db:del', id);
            };
        }

    };

}) (window,
    window.morgen.dispatch);

