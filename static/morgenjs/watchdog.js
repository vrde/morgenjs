(function (register, bind) {
    var reloadScript, controller;

    reloadScript = function (src) {
        var oldElem  = document.querySelector("[src^='" + src + "']"),
            newElem  = document.createElement('script');

       newElem.src = [src, Math.random()].join('?');

       oldElem.parentNode.replaceChild(newElem, oldElem);
       return newElem;
    };

    controller = function (c) {
        var ws, log, onmessage;

        ws = new WebSocket("ws://localhost:8888/ws");

        log = function (e) { console.log('[core] socket activity:', e.type); };

        onmessage = function(evt) {
            var filename = evt.data,
                root     = window.location.origin,
                src      = filename,
                elem     = document.querySelector("[src^='" + src + "']");

            if (filename == '/templates/index.html')
                window.location.reload();

            if (elem) {
                reloadScript(src);
                console.log('core: reload', elem.src);
            } else {
                console.error('core: cannot find', src);
            }
        };

        c.events = {
            '_scope'          : ws,
            'open,close,error': log,
            'message'         : onmessage
        };

        c.cleanup = function () {
            if (ws.readyState == ws.OPEN)
                ws.close();
        };
    };

    
    
    register(controller, 'ROOT');

    bind('ROOT', 'html');

}) (window.morgen.register, window.morgen.bind);

