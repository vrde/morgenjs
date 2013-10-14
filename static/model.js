(function (ns, dispatch) {

    ns.myapp = ns.myapp || {};

    ns.myapp.model = {

        all: function (db) {
            var objectStore = db.transaction('links').objectStore('links'),
                buffer = [];

            objectStore.openCursor().onsuccess = function(e) {
                var cursor = e.target.result;

                if (cursor) {
                    buffer.push(cursor.value);
                    cursor.continue();
                } else {
                    console.log('XXXXXXXXXXXXXXX');
                    dispatch('db:all', buffer);
                }
            };
        },

        add: function(db, data, onsuccess) {
            var transaction = db.transaction("links", "readwrite"),
                objectStore = transaction.objectStore("links"),
                request = objectStore.put(data);

            request.onsuccess = function(e) {
                dispatch('db:add', e.target.result);
            };
        }

    };

}) (window,
    window.morgen.dispatch);

