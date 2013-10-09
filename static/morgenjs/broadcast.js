(function (register, load) {

    'use strict';

    var controller;

    function getXPath(node) {
        var comp, comps = [];
        var parent = null;
        var xpath = '';
        var getPos = function(node) {
            var position = 1, curNode;
            if (node.nodeType == Node.ATTRIBUTE_NODE) {
                return null;
            }
            for (curNode = node.previousSibling; curNode; curNode = curNode.previousSibling) {
                if (curNode.nodeName == node.nodeName) {
                    ++position;
                }
            }
            return position;
        };

        if (node instanceof Document) {
            return '/';
        }

        for (; node && !(node instanceof Document); node = node.nodeType == Node.ATTRIBUTE_NODE ? node.ownerElement : node.parentNode) {
            comp = comps[comps.length] = {};
            switch (node.nodeType) {
                case Node.TEXT_NODE:
                    comp.name = 'text()';
                    break;
                case Node.ATTRIBUTE_NODE:
                    comp.name = '@' + node.nodeName;
                    break;
                case Node.PROCESSING_INSTRUCTION_NODE:
                    comp.name = 'processing-instruction()';
                    break;
                case Node.COMMENT_NODE:
                    comp.name = 'comment()';
                    break;
                case Node.ELEMENT_NODE:
                    comp.name = node.nodeName;
                    break;
            }
            comp.position = getPos(node);
        }

        for (var i = comps.length - 1; i >= 0; i--) {
            comp = comps[i];
            xpath += '/' + comp.name;
            if (comp.position != null) {
                xpath += '[' + comp.position + ']';
            }
        }

        return xpath.toLowerCase();

    }


    function createXPathFromElement(elm) {
        var allNodes = document.getElementsByTagName('*'),
            segs, elm, i, sib;
        for (segs = []; elm && elm.nodeType == 1; elm = elm.parentNode) {
            if (elm.hasAttribute('id')) {
                    var uniqueIdCount = 0;
                    for (var n=0;n < allNodes.length;n++) {
                        if (allNodes[n].hasAttribute('id') && allNodes[n].id == elm.id) uniqueIdCount++;
                        if (uniqueIdCount > 1) break;
                    }
                    if ( uniqueIdCount == 1) {
                        segs.unshift('id("' + elm.getAttribute('id') + '")');
                        return segs.join('/');
                    } else {
                        segs.unshift(elm.localName.toLowerCase() + '[@id="' + elm.getAttribute('id') + '"]');
                    }
            } else if (elm.hasAttribute('class')) {
                segs.unshift(elm.localName.toLowerCase() + '[@class="' + elm.getAttribute('class') + '"]');
            } else {
                for (i = 1, sib = elm.previousSibling; sib; sib = sib.previousSibling) {
                    if (sib.localName == elm.localName)  i++; }
                    segs.unshift(elm.localName.toLowerCase() + '[' + i + ']');
            }
        }
        return segs.length ? '/' + segs.join('/') : null;
    }

    function lookupElementByXPath(path) {
        var evaluator = new XPathEvaluator();
        var result = evaluator.evaluate(path, document.documentElement, null,XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        return  result.singleNodeValue;
    }

    controller = function (c) {
        // Register the events we need
        c.events = [{
            '_scope': document,

            'click': function (e) {
                var xpath = getXPath(e.target);
                console.log(xpath);

                __morgen.ws.send(xpath);
            }
        }, 
        /*
        {
            '_scope': window,

            'popstate': function (e) {
                console.log('popstate');
                __morgen.ws.send('popstate');
            }
        },
        */
        {
            '_scope': __morgen.ws,
            'message': function(evt) {
                return;
                var xpath = evt.data.toLowerCase(),
                    elem  = lookupElementByXPath(xpath);

                console.log(xpath, elem);
                elem.dispatchEvent(new Event('click'));
            }
        }];

        };


    // Register the `__morgen_broadcast` controller.
    register('__morgen_broadcast', controller);

}) (window.morgen.register, window.morgen.load);

