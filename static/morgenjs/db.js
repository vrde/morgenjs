(function (morgen, indexedDB) {
    'use strict';

    var dbName, dbVersion,
        db, initDB, getDB;

    initDB = function (name, version) {
        dbName    = name;
        dbVersion = version;
    };


    getDB = function (onsuccess) {
        if (!dbName || !dbVersion) {
            console.info('Cannot find dbName or dbVersion, did you call morgen.initDB?');
            onsuccess();
            return;
        }

        if (typeof(db) != "undefined") {
            onsuccess(db);
            return;
        }

        var request = indexedDB.open(dbName, dbVersion);

        request.onerror = function(e) {
            console.error("DB::Can't open IndexedDB!!!", e);
        };

        request.onsuccess = function(e) {
            db = e.target.result;
            onsuccess(db);
        };

        request.onupgradeneeded = function(e) {
            morgen.dispatch('upgrade_db', { db: e.target.result });
        };
    };

    morgen.getDB  = getDB;
    morgen.initDB = initDB;

}) (window.morgen,
    window.indexedDB);

