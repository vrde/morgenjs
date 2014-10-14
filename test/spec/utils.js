(function (describe, it, expect,
           updateConfig) {

    'use strict';


    describe('updateConfig', function () {
        it('overwrite the default values', function () {
            var newApiRoot = 'http://example.org/api/1/',
                key = 'abc';

            updateConfig({
                http: {
                    apiRoot: newApiRoot
                    appendParams: {
                        key: 'abc'
                    }
                }
            });

            expect(__morgen.config.http.apiRoot)
                .toBe(newApiRoot);

            expect(__morgen.config.http.appendParams.key)
                .toBe(key);
        });

    });

}) (
    // JasmineJS stuff
    window.describe,
    window.it,
    window.expect,

    // Domain specific stuff
    window.morgen.updateConfig
);

