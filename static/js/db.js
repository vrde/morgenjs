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
            onsuccess();
            return;
        }

        if (typeof(db) != "undefined") {
            onsuccess(db);
            return;
        }

        var request = indexedDB.open(dbName, dbVersion);

        request.onerror = function(e) {
            console.error('Can\'t open IndexedDB!!!', e);
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

