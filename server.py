"""
Morgen.

Usage:
    morgen [--root=<PATH>] [--address=<ADDRESS>] [--port=<PORT>]


--root=<PATH>           specify the root directory to serve [default: app]
--address=<ADDRESS>     bind the listen socket to the specified address: [default: 0.0.0.0]
--port=<PORT>           listen to the specified port: [default: 8888]

"""

import os
from datetime import datetime, timedelta
import logging
import codecs
import string

import tornado.httpserver
import tornado.websocket
import tornado.escape
import tornado.template
import tornado.ioloop
import tornado.web
import tornado.log

from watchdog.observers import Observer
from watchdog.events import PatternMatchingEventHandler

from docopt import docopt

wss = []


def ws_send(message, sender=None):
    """Utility function to send a message to all the clients
    connected. It will skip the `sender` if it is set."""

    for ws in wss:
        if sender != ws:
            ws.write_message(
                tornado.escape.json_encode(message))



class WSHandler(tornado.websocket.WebSocketHandler):
    """Handle the websocket connections"""


    def open(self):
        """Open a new connection and add it to the set of clients"""

        ua = self.request.headers.get('User-Agent')
        ip = self.request.remote_ip

        logging.info('open connection with {} {}'.format(ua, ip))
        if self not in wss:
            wss.append(self)


    def on_message(self, message):
        """Broadcast a message to all the clients connected but not the
        client originating the request."""

        
        logging.info('received message: {}'.format(message))
        ws_send(tornado.escape.json_decode(message), self)


    def on_close(self):
        """Remove a client from the list of connected clients"""

        ua = self.request.headers.get('User-Agent')
        ip = self.request.remote_ip

        logging.debug('close connection with {} {}'.format(ua, ip))
        if self in wss:
            wss.remove(self)



class MainHandler(tornado.web.RequestHandler):
    """Serve the index.html file, adding the Morgen javascript library."""

    def initialize(self, root):
        self.root = root

        morgen_loader = tornado.template.Loader(
                    os.path.join(os.path.dirname(__file__),
                    'templates'))

        local_loader = tornado.template.Loader(self.root)

        self.head_fragment = morgen_loader.load('head_fragment.html')
        self.index = local_loader.load('index.html')


    def get(self):
        self.write(self.index.generate(
            morgen=self.head_fragment.generate(),
            root=self.root))
        self.finish()



class TemplateHandler(tornado.web.RequestHandler):
    """Encapsulate a template into a javascript structure."""

    TMPL = u'morgen.registerTemplate("%s", "%s");'


    def initialize(self, root):
        self.root = root


    def compile(self, name, template):
        """Create a javascript string from an HTML template"""

        template = template.replace('"', '\\"')
        template = u' '.join(map(string.lstrip, filter(bool, template.split('\n'))))
        template = self.TMPL % (name, template)

        return template


    def get(self, tmpl_root, path):
        """Read and compile a template resource"""
        fullpath = os.path.join(self.root, tmpl_root, path + '.html')
        try:
            template = codecs.open(fullpath, 'r', 'utf8').read()
        except:
            raise tornado.web.HTTPError(404)

        self.write(self.compile(path, template))



def make_application(args):
    root = args['--root']

    application = tornado.web.Application([
            # Core JS files and tests
            (r'^/__morgen/(.*)', tornado.web.StaticFileHandler,
                                 { 'path': os.path.join(os.path.dirname(__file__), 'static') }),
            (r'^/__morgen_test/index.html', MainHandler,
                                 { 'root': os.path.join(os.path.dirname(__file__), 'test') }),

            (r'^/__morgen_test/(.*)', tornado.web.StaticFileHandler,
                                 { 'path': os.path.join(os.path.dirname(__file__), 'test') }),


            # Application templates and static resources
            (r'^/{}/([^\/]*)/(.*).html$'.format(root), TemplateHandler, { 'root': root }),
            (r'^/{}/(.*)'.format(root), tornado.web.StaticFileHandler, { 'path': root }),


            # Websockets and main handler
            (r'^/ws$', WSHandler),
            (r'.*', MainHandler, { 'root': root }),

        ],

        debug=True
    )

    return application


class FSEventHandler(PatternMatchingEventHandler):
    THRESHOLD = timedelta(seconds=0.5)

    def __init__(self, root):
        super(FSEventHandler, self).__init__(
            patterns=['*.html', '*.js', '*.css'],
            ignore_patterns=['.git'],
            ignore_directories=True)

        self.root = root
        self.debounce = {}

    def on_modified(self, event):
        src = event.src_path
        now = datetime.now()
        last = self.debounce.get(src)

        if not last or now - last > self.THRESHOLD:
            logging.info('firing event for {}'.format(src))
            ws_send({
                'type'   : 'filechange',
                'payload': '/' + src
            })
            self.debounce[src] = now


def start_watching(path='.'):
    test_path = os.path.join(os.path.dirname(__file__), 'test/')
    morgen_path = os.path.join(os.path.dirname(__file__), 'static/')

    test_handler = FSEventHandler(test_path)
    morgen_handler = FSEventHandler(morgen_path)
    handler = FSEventHandler(os.getcwd())

    observer = Observer()
    observer.schedule(test_handler, test_path, recursive=True)
    observer.schedule(morgen_handler, morgen_path, recursive=True)
    observer.schedule(handler, path, recursive=True)
    observer.start()

    return handler


def run_server(application, args):
    port, address = int(args['--port']), args['--address']
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(port, address)
    tornado.log.enable_pretty_logging()
    logging.info('Morgen server listening on {}:{}'.format(address, port))
    tornado.ioloop.IOLoop.instance().start()


def serve(args):
    start_watching(args['--root'])
    app = make_application(args)
    run_server(app, args)


def main():
    args = docopt(__doc__, version='Morgen 0.1')
    serve(args)


if __name__ == '__main__':
    main()

