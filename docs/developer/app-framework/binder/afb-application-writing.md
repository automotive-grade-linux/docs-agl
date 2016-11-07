
HOWTO WRITE an APPLICATION above AGL FRAMEWORK
==============================================

Programmation Languages for Applications
-----------------------------------------

### Writing an HTML5 application

Developers of HTML5 applications (client side) can easily create
applications for AGL framework using their preferred
HTML5 framework.

Developers may also take advantage of powerful server side plugins to improve
application behavior. Server side plugins return an application/json mine-type
and can be accessed though either HTTP or Websockets.

In a near future, JSON-RPC protocol should be added to complete current x-afb-json1 protocol.

Two examples of HTML5 applications are given:

- [afb-client](https://gerrit.automotivelinux.org/gerrit/gitweb?p=src/app-framework-demo.git;a=tree;f=afb-client) a simple "hello world" application template

- [afm-client](https://gerrit.automotivelinux.org/gerrit/gitweb?p=src/app-framework-demo.git;a=tree;f=afm-client) a simple "Home screen" application template

### Writing a Qt application

Writing Qt applications is also supported. Qt offers standard API to send request through HTTP or WebSockets.

It is also possible to write QML applications. A sample QML application [token-websock] is avaliable..

- [token-websock](https://gerrit.automotivelinux.org/gerrit/gitweb?p=src/app-framework-binder.git;a=blob;f=test/token-websock.qml)
a simple "hello world" application in QML

### Writing "C" application

C applications can use afb-daemon binder through a websocket connection.

The library **libafbwsc** is provided for C clients that need
to connect with an afb-daemon binder.

The program **afb-client-demo** is the C example that use
**libafbwsc** library.
Source code is available here
[src/afb-client-demo.c](https://gerrit.automotivelinux.org/gerrit/gitweb?p=src/app-framework-binder.git;a=blob;f=src/afb-client-demo.c).

Current implementation relies on libsystemd and file descriptors.
This model might be review in the future to support secure sockets
and free the dependency with libsystemd.

Handling sessions within applications
-------------------------------------

Applications should understand sessions and tokens management when interacting with afb-daemon binder.

Applications are communicating with their private binder(afb-daemon) using
a network connection or potentially any other connection channel. While current version
does not yet implement unix domain this feature might be added in a near future.
Developers need to be warn that HTTP protocol is a none connected protocol. This prevents
from using HTTP socket connection to authenticate clients.

For this reason, the binder should authenticate the application
by using a shared secret. The secret is named "token" and the identification
of client is named "session".

The examples **token-websock.qml** and **afb-client** are demonstrating
how authentication and sessions are managed.

### Handling sessions

Plugins and other binder feature need to keep track of client
instances. This is especially important for plugins running as services
as they may typically have to keep each client's data separated.

For HTML5 applications, the web runtime handles the cookie of session
that the binder afb-daemon automatically sets.

Session identifier can be set using the parameter
**uuid** or **x-afb-uuid** in URI requests. Within current version of the
framework session UUID is supported by both HTTP requests and websocket negotiation.

### Exchanging tokens

At application start, AGL framework communicates a shared secret to both binder
and client application. This initial secret is called the "initial token".

For each of its client application, the binder manages a current active
token for session management. This authentication token can be use to restrict
access to some plugin's methods.

The token must be included in URI request on HTTP or during websockets
connection using parameter **token** or **x-afb-token**.

To ensure security, tokens must be refreshed periodically.

### Example of session management

In following examples, we suppose that **afb-daemon** is launched with something equivalent to:

    $ afb-daemon --port=1234 --token=123456 [...]

making the expectation that **AuthLogin** plugin is requested as default.

#### Using curl

First, connects with the initial token, 123456:

    $ curl http://localhost:1234/api/auth/connect?token=123456
    {
      "jtype": "afb-reply",
      "request": {
         "status": "success",
         "token": "0aef6841-2ddd-436d-b961-ae78da3b5c5f",
         "uuid": "850c4594-1be1-4e9b-9fcc-38cc3e6ff015"
      },
      "response": {"token": "A New Token and Session Context Was Created"}
    }

It returns an answer containing session UUID, 850c4594-1be1-4e9b-9fcc-38cc3e6ff015,
and a refreshed token, 850c4594-1be1-4e9b-9fcc-38cc3e6ff015.

Check if session and token is valid:

    $ curl http://localhost:1234/api/auth/check?token=0aef6841-2ddd-436d-b961-ae78da3b5c5f\&uuid=850c4594-1be1-4e9b-9fcc-38cc3e6ff015
    {
      "jtype": "afb-reply",
      "request": {"status":"success"},
      "response": {"isvalid":true}
    }

Refresh the token:

    $ curl http://localhost:1234/api/auth/refresh?token=0aef6841-2ddd-436d-b961-ae78da3b5c5f\&uuid=850c4594-1be1-4e9b-9fcc-38cc3e6ff015
    {
      "jtype": "afb-reply",
      "request": {
         "status":"success",
         "token":"b8ec3ec3-6ffe-448c-9a6c-efda69ad7bd9"
      },
      "response": {"token":"Token was refreshed"}
    }

Close the session:

    curl http://localhost:1234/api/auth/logout?token=b8ec3ec3-6ffe-448c-9a6c-efda69ad7bd9\&uuid=850c4594-1be1-4e9b-9fcc-38cc3e6ff015
    {
      "jtype": "afb-reply",
      "request": {"status": "success"},
      "response": {"info":"Token and all resources are released"}
    }

Checking on closed session for uuid should be refused:

    curl http://localhost:1234/api/auth/check?token=b8ec3ec3-6ffe-448c-9a6c-efda69ad7bd9\&uuid=850c4594-1be1-4e9b-9fcc-38cc3e6ff015
    {
      "jtype": "afb-reply",
      "request": {
         "status": "failed",
         "info": "invalid token's identity"
      }
    }

#### Using afb-client-demo

> The program is packaged within AGL in the rpm **libafbwsc-dev**

Here is an example of exchange using **afb-client-demo**:

    $ afb-client-demo ws://localhost:1234/api?token=123456
    auth connect
    ON-REPLY 1:auth/connect: {"jtype":"afb-reply","request":{"status":"success",
       "token":"63f71a29-8b52-4f9b-829f-b3028ba46b68","uuid":"5fcc3f3d-4b84-4fc7-ba66-2d8bd34ae7d1"},
       "response":{"token":"A New Token and Session Context Was Created"}}
    auth check
    ON-REPLY 2:auth/check: {"jtype":"afb-reply","request":{"status":"success"},"response":{"isvalid":true}}
    auth refresh
    ON-REPLY 4:auth/refresh: {"jtype":"afb-reply","request":{"status":"success",
       "token":"8b8ba8f4-1b0c-48fa-962d-4a00a8c9157e"},"response":{"token":"Token was refreshed"}}
    auth check
    ON-REPLY 5:auth/check: {"jtype":"afb-reply","request":{"status":"success"},"response":{"isvalid":true}}
    auth refresh
    ON-REPLY 6:auth/refresh: {"jtype":"afb-reply","request":{"status":"success",
       "token":"e83b36f8-d945-463d-b983-5d8ed73ba529"},"response":{"token":"Token was refreshed"}}

After closing connection, reconnect as here after:

    $ afb-client-demo ws://localhost:1234/api?token=e83b36f8-d945-463d-b983-5d8ed73ba529\&uuid=5fcc3f3d-4b84-4fc7-ba66-2d8bd34ae7d1 auth check
    ON-REPLY 1:auth/check: {"jtype":"afb-reply","request":{"status":"success"},"response":{"isvalid":true}}

Same connection check using **curl**:

    $ curl http://localhost:1234/api/auth/check?token=e83b36f8-d945-463d-b983-5d8ed73ba529\&uuid=5fcc3f3d-4b84-4fc7-ba66-2d8bd34ae7d1
    {"jtype":"afb-reply","request":{"status":"success"},"response":{"isvalid":true}}

Format of replies
-----------------

Replies use javascript object returned as serialized JSON.

This object contains at least 2 mandatory fields of name **jtype** and **request**
and one optional field of name **response**.

### Template

This is a template of replies:

```json
{
   "jtype": "afb-reply",
   "request": {
      "status": "success",
      "info": "informationnal text",
      "token": "e83b36f8-d945-463d-b983-5d8ed73ba52",
      "uuid": "5fcc3f3d-4b84-4fc7-ba66-2d8bd34ae7d1",
      "reqid": "application-generated-id-23456"
   },
   "response": ....any response object....
}
```

### Field jtype

The field **jtype** must have a value of type string equal to **"afb-reply"**.

### Field request

The field **request** must have a value of type object. This request object
has at least one field named **status** and four optional fields named
**info**, **token**, **uuid**, **reqid**.

#### Subfield request.status

**status** must have a value of type string. This string is equal to **"success"**
only in case of success.

#### Subfield request.info

**info** is of type string and represent optional information added to the reply.

#### Subfield request.token

**token** is of type string. It is sent either at session creation 
or when the token is refreshed.

#### Subfield request.uuid

**uuid** is of type string. It is sent at session creation.

#### Subfield request.reqid

**reqid** is of type string. It is sent in response to HTTP requests
that added a parameter of name **reqid** or **x-afb-reqid** at request time.
Value returns in the reply has the exact same value as the one received in the request.

### Field response

This field response optionally contains an object returned when request succeeded.

Format of events
----------------

Events are javascript object serialized as JSON.

This object contains at least 2 mandatory fields of name **jtype** and **event**
and one optional field of name **data**.

### Template

Here is a template of event:

```json
{
   "jtype": "afb-event",
   "event": "sample_api_name/sample_event_name",
   "data": ...any event data...
}
```

### Field jtype

The field **jtype** must have a value of type string equal to **"afb-event"**.

### Field event

The field **event** carries the event's name.

The name of the event is made of two parts separated by a slash:
the name of the name of the API that generated the event
and the name of event within the API.

### Field data

This field data if present holds the data carried by the event.

