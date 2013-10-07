import os
from datetime import datetime, timedelta
import logging
import codecs
import string

import tornado.httpserver
import tornado.websocket
import tornado.ioloop
import tornado.web
import tornado.log

from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler


wss = []


def ws_send(message):
    for ws in wss:
        ws.write_message(message)


class WSHandler(tornado.websocket.WebSocketHandler):
    def open(self):
        ua = self.request.headers.get('User-Agent')
        ip = self.request.remote_ip

        logging.info('open connection with {} {}'.format(ua, ip))
        if self not in wss:
            wss.append(self)

    def on_message(self, message):
        logging.debug('received message: {}'.format(message))

    def on_close(self):
        ua = self.request.headers.get('User-Agent')
        ip = self.request.remote_ip

        logging.debug('close connection with {} {}'.format(ua, ip))
        if self in wss:
            wss.remove(self)



class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('index.html')



class TemplateHandler(tornado.web.RequestHandler):
    TMPL = u'morgen.registerTemplate("%s", "%s");'

    def initialize(self, template_path):
        self.template_path = template_path

    def compile(self, name, template):
        template = template.replace('"', '\\"')
        template = u' '.join(map(string.lstrip, filter(bool, template.split('\n'))))
        template = self.TMPL % (name, template)

        return template

    def get(self, path):
        fullpath = os.path.join(self.template_path, path + '.html')
        try:
            template = codecs.open(fullpath, 'r').read()
        except:
            raise tornado.web.HTTPError(404)

        self.write(self.compile(path, template))



def make_application():
    application = tornado.web.Application([
            (r'^/virtual/template/(.*).html$', TemplateHandler, {'template_path': 'static/templates' }),
            (r'^/ws$', WSHandler),
            (r'.*', MainHandler),
        ],

        debug=True,
        template_path=os.path.join(os.path.dirname(__file__), "templates"),
        static_path=os.path.join(os.path.dirname(__file__), "static"),
    )

    return application


class FSEventHandler(FileSystemEventHandler):
    THRESHOLD = timedelta(seconds=0.5)

    def __init__(self, root):
        self.root = root
        self.debounce = {}

    def on_modified(self, event):
        src = event.src_path
        now = datetime.now()
        last = self.debounce.get(src)

        if not last or now - last > self.THRESHOLD:
            logging.info('firing event for {}'.format(src))
            ws_send(src[len(self.root):]);
            self.debounce[src] = now


def start_watching(path='.'):
    handler  = FSEventHandler(os.getcwd())
    observer = Observer()
    observer.schedule(handler, path, recursive=True)
    observer.start()

    return handler


def run_server(application):
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(8888)
    tornado.log.enable_pretty_logging()
    tornado.ioloop.IOLoop.instance().start()

def main():
    start_watching()
    app = make_application()
    run_server(app)


if __name__ == '__main__':
    main()

