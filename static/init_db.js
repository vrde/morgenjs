(function (register, hub, initDB) {

    register('init_db', function (c) {

        initDB('mytestdb', 1);

        var upgradeDB = function (e) {
            var db = e.detail.db;

            if (!db.objectStoreNames.contains("links")) {
                var objectStore = db.createObjectStore("links", {
                    keyPath: "id",
                    autoIncrement: true
                });

                objectStore.createIndex("byReadAt", "readat");
            }
        };

        c.events = {
            'upgrade_db': upgradeDB
        };

    });

}) (window.morgen.register,
    window.morgen.hub,
    window.morgen.initDB);

