
Overview of tests shipped with AFB-Daemon
=========================================

List of tests
-------------

Here are the tests shipped in the source tree:

* **afb-client-demo** (command-line WebSockets)

* **token-websock.qml** (Qt/QML WebSockets)

* ***.html** (HTML5/JS HTTP-REST & WebSockets)


Detail of tests
---------------

### afb-client-demo (command-line WebSockets)

This clients interactively calls bindings APIs from the command line, using the binder
[WebSockets](https://en.wikipedia.org/wiki/WebSocket) facility.

If _afb-daemon_ has been launched with the following parameters:


    $ afb-daemon --port=1234 --token=123456 [...]


Then run the client with :

    afb-client-demo ws://localhost:1234/api?token=123456 [<api> <verb> [<json-data>]]

For instance, to initialize the Audio binding from the command line :

    afb-client-demo ws://localhost:1234/api?token=123456

The command doesn't return. You should type requests of type <api> <verb> [<json-data>].
So, try:

    auth connect
    hello pingjson true

<br />



### token-websock.qml (Qt/QML WebSockets)

If _afb-daemon_ has been launched with the following parameters:

    $ afb-daemon --port=1234 --token=123456 [...]

and Qt5 is installed.

For installing Qt5 on **Ubuntu 16.04**:

    $ apt-get install qmlscene qml-module-qtwebsockets qml-module-qtquick-controls

For installing Qt5 on **Fedora 23** :

    $ dnf install qt5-qtdeclarative-devel qt5-qtwebsockets-devel qt5-qtquickcontrols


Then run the client with :

    qmlscene test/token-websock.qml

and interactively press the buttons, "Connect", "Refresh", "Logout".

<br />


### *.html (HTML5/JS HTTP-REST & WebSockets)

If _afb-daemon_ has been launched with the following parameters:

    $ afb-daemon --port=1234 --rootdir=$PWD/test [...]

_("$PWD/test_" being the "test" subdirectory of the source tree)_


Then open your preferred Web browser, connect to the following URL:

    http://localhost:1234

and interactively run the various tests.

