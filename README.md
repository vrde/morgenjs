MorgenJS
========

MorgenJS is a nice framework to build single page webapps.
It is still extremely experimental, and the API is totally unstable, so don't rely on it. I just put it online to show the code to some interested people.



Why
===
There are many awesome libraries/frameworks out there: [BackboneJS](http://backbonejs.org/) and [AngularJS](http://angularjs.org/) to name a few. They are doing a great job helping with the architecture and provinding utils, bindings, and all a developer needs to build an app.

But the **development** is still the same: edit styles, save, switch to the browser, reload; or edit the scripts, save, switch to the browser, reload; or edit the templates, save, switch to the browser, reload. I think it's a huge waste of time, for many reasons:
- saving, switching and reloading interrupts your flow and takes time, if you are doing once is 2 seconds. If you are doing hundreds of times in a day, it's minutes, in a week of work, it's hours.
- switching and reloading destroys the **context**. The URL may help, since it's a way to keep the context, but it's not enough. Imagine you are working on a dialog, and opening a dialog requires you to follow a path in the UI. If you are reloading you need to repeat the click--flow to get to the dialog. Even worse if you have to insert some data to get to the context you need.

If this is not enough to persuade you, what about different instances of the browser to check compatibility? And maybe you have many different devices. You should spend time coding, not clicking and tapping everywhere to debug the UI.

MorgenJS tries to fix this problem, giving to the developer a nice tool to update styles, scripts and templates in real time and without reloading the app, and propagating events throughly all the devices connected.



Tech stack
==========
- Python
- TornadoWeb
- WatchDog
- VanillaJS



Quickstart
==========
Please note that **MorgenJS is not production ready**, it's still an experiment and will change a lot in the near future. Anyway, if you are brave enough to give it a try, you can take a look to the TodoMVC implementation I've done.

Requirements
------------
A modern (2.7) Python installation, [Pip](http://www.pip-installer.org/) or [easyinstall](http://pythonhosted.org/distribute/easy_install.html). A virtualenv manager can be helpful, I recommend [Pew](https://github.com/berdario/invewrapper).

Take a look also to the [Python watchdog supported platforms](http://pythonhosted.org/watchdog/installation.html#supported-platforms-and-caveats). I've just tested it in my Ubuntu box and it's working, never tried a Mac OS X, will do it soon.



How to run the TodoMVC example
------------------------------


    git clone git@github.com:vrde/morgenjs.git
    cd morgenjs
    pip install -e .
    cd examples
    morgen --root=todomvc

Hopefully, you can see the TodoMVC implementation up and running on [http://localhost:8888](http://localhost:8888).



How to run the internal test suite
----------------------------------
Point your browser to [http://localhost:8888/__morgen_test/index.html](http://localhost:8888/__morgen_test/index.html).

