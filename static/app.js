(function (window) {

    var ws = new WebSocket("ws://localhost:8888/ws");

    ws.onopen = function(evt) { console.log("socket opened"); };
    ws.onmessage = function(evt) { console.log("message: " + evt.data); };
    ws.onclose = function(evt) { console.log("socket closed"); };

    window.ws = ws;

}) (window);

