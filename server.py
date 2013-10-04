import os

import tornado.httpserver
import tornado.websocket
import tornado.ioloop
import tornado.web

from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler


wss = []

def ws_send(message):
    print 'WS:', message
    for ws in wss:
        ws.write_message(message)


class WSHandler(tornado.websocket.WebSocketHandler):
    def open(self):
        print 'new connection'
        self.write_message("Hello World")
        if self not in wss:
            wss.append(self)

    def on_message(self, message):
        print 'message received %s' % message

    def on_close(self):
        print 'connection closed'
        if self in wss:
            wss.remove(self)



class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('index.html')



def make_application():
    application = tornado.web.Application([
            (r'^/$', MainHandler),
            (r'^/ws$', WSHandler),
        ],

        debug=True,
        template_path=os.path.join(os.path.dirname(__file__), "templates"),
        static_path=os.path.join(os.path.dirname(__file__), "static"),
    )

    return application


class FSEventHandler(FileSystemEventHandler):
    def on_any_event(self, event):
        ws_send({
            'event_type'  : event.event_type,
            'is_directory': event.is_directory,
            'src_path'    : event.src_path
        })


def start_watching(path='.'):
    handler  = FSEventHandler()
    observer = Observer()
    observer.schedule(handler, path, recursive=True)
    observer.start()

    return handler


def run_server(application):
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(8888)
    tornado.ioloop.IOLoop.instance().start()


if __name__ == '__main__':
    start_watching()
    app = make_application()
    run_server(app)

