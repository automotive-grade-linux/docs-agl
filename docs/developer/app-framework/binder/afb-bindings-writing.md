
HOWTO WRITE a BINDING for AFB-DAEMON
===================================

Summary
-------

Afb-daemon binders serve files through HTTP protocol
and offers to developers the capability to expose application API methods through
HTTP or WebSocket protocol.

Binder bindings are used to add API to afb-daemon.
This part describes how to write a binding for afb-daemon.

Excepting this summary, this document target developers.

Before moving further through an example, here after
a short overview of binder bindings fundamentals.

### Nature of a binding

A binding is an independent piece of software. A binding is self contain and exposes application logic as sharable library.
A binding is intended to be dynamically loaded by afb-daemon to expose application API.

Technically, a binder binding does not reference and is not linked with any afb-daemon library.

### Class of bindings

Application binder supports two kinds of bindings: application bindings and service bindings.
Technically both class of binding are equivalent are use the same coding convention. Only sharing mode and security context diverge.

#### Application-bindings

Application-bindings implements the glue in between application's UI and services. Every AGL application
has a corresponding binder that typically activates one or many bindings to interface the application logic with lower platform services.
When an application is started by the AGL application framework, a dedicate binder is started that loads/activates application binding(s). 
API expose by application-binding are executed within corresponding application security context.

Application bindings generally handle a unique context for a unique client. As the application framework start
a dedicated instance of afb_daemon for each AGL application, if a given binding is used within multiple application each of those
application get a new and private instance of eventually "shared" binding.

#### Service-bindings

Service-bindings enable API activation within corresponding service security context and not within calling application context. 
Service-bindings are intended to run as a unique instance. Service-bindings can be shared in between multiple clients.

Service-bindings can either be stateless or manage client context. When managing context each client get a private context.

Sharing may either be global to the platform (ie: GPS service) or dedicated to a given user (ie: user preferences)
 
### Live cycle of bindings within afb-daemon

Application and service bindings are loaded and activated each time a new afb-daemon is started.

At launch time, every loaded binding initialise itself.
If a single binding initialisation fail corresponding instance of afb-daemon self aborts.

Conversely, when a binding initialisation succeeds, it should register 
its unique name as well as the list of verbs attached to the methods it exposes.

When initialised, on request from application clients to the right API/verb, binding methods
are activated by the afb-daemon attached to the application or service.

At exit time, no special action is enforced by afb-daemon. When a specific actions is required at afb-daemon stop,
developers should use 'atexit/on_exit' during binding initialisation sequence to register a custom exit function.

### Binding Contend

Afb-daemon's binding register two classes of objects: names and functions.

Bindings declare categories of names:
 - A unique binding name to access all API expose by this binding,
 - One name for each methods/verbs provided by this binding.

Bindings declare two categories of functions:
 - function use for the initialisation
 - functions implementing exposed API methods

Afb-daemon parses URI requests to extract the API(binding name) and the VERB(method to activate).
As an example, URI **foo/bar** translates to binding named **foo** and method named **bar**.
To serve such a request, afb-daemon looks for an active binding named **foo** and then within this binding for a method named **bar**.
When find afb-daemon calls corresponding method with attached parameter if any.

Afb-daemon ignores letter case when parsing URI. Thus **TicTacToe/Board** and **tictactoe/board** are equivalent.

#### The name of the binding

The name of a given binding is also known as the name
of the API prefix that defines the binding.

The name of a binding SHOULD be unique within a given afb-daemon instance.

For example, when a client of afb-daemon calls a URI named **foo/bar**. Afb-daemon
extracts the prefix **foo** and the suffix **bar**. **foo** must match a binding name and **bar** a VERB attached to some method.

#### Names of methods

Each binding exposes a set of methods that can be called
by the clients of a given afb-daemon.

VERB's name attached to a given binding (API) MUST be unique within a binding.

Bindings static declaration link VERBS to corresponding methods. 
When clients emit requests on a given API/VERB corresponding method is called by afb-daemon.

#### Initialisation function

Binding's initialisation function serves several purposes.

1. It allows afb-daemon to control binding version depending on initialisation function name.
As today, the only supported initialisation function is **afbBindingV1Register**. This identifies
version "one" of bindings.

2. It allows bindings to initialise itself.

3. It enables names declarations: descriptions, requirements and implementations of exposed API/VERB.

#### Functions instantiation of API/VERBs

When an API/VERB is called, afb-daemon constructs a request object. Then it 
passes this request object to the implementation function corresponding to requested method, this
within attached API binding.

An implementation function receives a request object that
is used to: get arguments of the request, send
answer, store session data.

A binding MUST set an answer to every received requests.

Nevertheless it is not mandatory to set the answer
before returning from API/VERB implementing function.
This behaviour is important for asynchronous actions.

API/VERB implementation that set an answer before returning are called *synchronous implementations*.
Those that do not systematically set an answer before returning are called *asynchronous implementations*.

Asynchronous implementations typically launch asynchronous actions. They record some context at
request time and provide answer to the request only at completion of asynchronous actions.

The Tic-Tac-Toe example
-----------------------

This part explains how to write an afb-binding.
For the sake of being practical it uses many
examples based on tic-tac-toe.
This binding example is in *bindings/samples/tic-tac-toe.c*.

This binding is named ***tictactoe***.

Dependencies when compiling
---------------------------

Afb-daemon provides a configuration file for *pkg-config*.
Typing the command

	pkg-config --cflags afb-daemon

Print flags use for compilation:

	$ pkg-config --cflags afb-daemon
	-I/opt/local/include -I/usr/include/json-c 

For linking, you should use

	$ pkg-config --libs afb-daemon
	-ljson-c

Afb-daemon automatically includes dependency to json-c.
This is activated through **Requires** keyword in pkg-config.
While almost every binding replies on **json-c** this is not a must have dependency.

Internally, afb-daemon relies on **libsystemd** for its event loop, as well 
as for its binding to D-Bus.
Bindings developers are encouraged to leverage **libsystemd** when possible.
Nevertheless there is no hard dependency to **libsystemd** if ever
you rather not use it, feel free to do so.

> Afb-daemon binding are fully self contain. They do not enforce dependency on any libraries from the application framework.
> Afb-daemon dependencies requirer to run AGL bindings are given at runtime through pointers leveraging read-only
> memory feature.

Header files to include
-----------------------

Binding *tictactoe* has following includes:

```C
#define _GNU_SOURCE
#include <stdio.h>
#include <string.h>
#include <json-c/json.h>
#include <afb/afb-binding.h>
```

Header *afb/afb-binding.h* is the only hard dependency, it includes all features
that a binding MUST HAVE. Outside of includes used to support application logic,
common external headers used within bindings are:

- *json-c/json.h*: should be include to handle json objects;
- *systemd/sd-event.h*: should be include to access event main loop;
- *systemd/sd-bus.h*: should be include for dbus connections.

The *tictactoe* binding does not leverage systemd features, also only json.h
is used on top of mandatory afb/afb-binding.h.

When including *afb/afb-binding.h*, the macro **_GNU_SOURCE** MUST be
defined.

Choosing names
--------------

Designers of bindings should define a unique name for every API binding
as well as for methods VERBs. They should also define names for request
arguments passed as name/value pair in URI.

While forging names, designers should respect few rules to
ensure that created names are valid and easy to use across platforms.

All names and strings are UTF-8 encoded.

### Names for API (binding)

Binding API name are checked.
All characters are authorised except:

- the control characters (\u0000 .. \u001f)
- the characters of the set { ' ', '"', '#', '%', '&',
  '\'', '/', '?', '`', '\x7f' }

In other words the set of forbidden characters is
{ \u0000..\u0020, \u0022, \u0023, \u0025..\u0027,
  \u002f, \u003f, \u0060, \u007f }.

Afb-daemon makes no distinction between lower case
and upper case when searching for API/VERB.

### Names for methods

The names of methods VERBs are totally free and not checked.

However, the validity rules for method's VERB name are the
same as for Binding API name except that the dot(.) character
is forbidden.

Afb-daemon makes no case distinction when searching for an API by name.

### Names for arguments

Argument's name are not restricted and can be everything you wish.

> Warning arguments search is case sensitive and "index" and "Index"
> are not two different arguments.

### Forging names widely available

The key names of javascript object can be almost
anything using the arrayed notation:

	object[key] = value

Nevertheless this is not the case with javascript dot notation:

	object.key = value

Using the dot notation, the key must be a valid javascript
identifier and dash(-) as well as few other reserved characters cannot be used.

For this reason, we advise developper to chose name compatible with both javascript and HTML notation.

It is a good practice, even for arguments not to rely on case sensitivity.
This may reduce headache strength at debug time, especially with interpreted language like
javascript that may not warn you that a variable was not defined.

Writing a synchronous method implementation
-----------------------------------------

The method **tictactoe/board** is a synchronous implementation.
Here is its listing:

```C
/*
 * get the board
 */
static void board(struct afb_req req)
{
	struct board *board;
	struct json_object *description;

	/* retrieves the context for the session */
	board = board_of_req(req);
	INFO(afbitf, "method 'board' called for boardid %d", board->id);

	/* describe the board */
	description = describe(board);

	/* send the board's description */
	afb_req_success(req, description, NULL);
}
```

This example shows many aspects of a synchronous
method implementation. Let summarise it:

1. The function **board_of_req** retrieves the context stored
for the binding: the board.

2. The macro **INFO** sends a message of kind *INFO*
to the logging system. The global variable named **afbitf**
used represents the interface to afb-daemon.

3. The function **describe** creates a json_object representing
the board.

4. The function **afb_req_success** sends the reply, attaching to
it the object *description*.

### The incoming request

For any implementation, the request is received by a structure of type
**struct afb_req**.

> Note that this is a PLAIN structure, not a pointer to a structure.

The definition of **struct afb_req** is:

```C
/*
 * Describes the request by bindings from afb-daemon
 */
struct afb_req {
	const struct afb_req_itf *itf;	/* the interfacing functions */
	void *closure;			/* the closure for functions */
};
```

It contains two pointers: first one *itf*, points to functions used
to handle internal request. Second one *closure* point onto function closure. 

> The structure must never be used directly.
> Instead developer should use the intended functions provided
> by afb-daemon as described here after.

*req* is used to get arguments of the request, to send
answer, to store session data.

This object and its interface is defined and documented
in the file names *afb/afb-req-itf.h*

The above example uses twice *req* object request.

The first time, to retrieve the board attached to the session of the request.

The second time, to send the reply: an object that describes the current board.

### Associating a client context to a session

When *tic-tac-toe* binding receives a request, it musts get
the board describing the game associated to the session.

For a binding, having data associated to a session is common.
This data is called "binding context" for the session.
Within *tic-tac-toe* binding the context is the board.

Requests *afb_req* offer four functions for storing and retrieving session associated context.

These functions are:

- **afb_req_context_get**:
  retrieves context data stored for current binding.

- **afb_req_context_set**:
  store context data of current binding.

- **afb_req_context**:
  if exist retrieves context data of current binding.
  if context does not yet exist, creates a new context and store it.

- **afb_req_context_clear**:
  reset the stored context data.

The binding *tictactoe* use a convenient function to retrieve
its context: the board. This function is *board_of_req*:

```C
/*
 * retrieves the board of the request
 */
static inline struct board *board_of_req(struct afb_req req)
{
	return afb_req_context(req, (void*)get_new_board, (void*)release_board);
}
```

The function **afb_req_context** ensures an existing context
for the session of the request.
Its two last arguments are functions to allocate and free context. 
Note function type casts to avoid compilation warnings.

Here is the definition of the function **afb_req_context**

```C
/*
 * Gets the pointer stored by the binding for the session of 'req'.
 * If the stored pointer is NULL, indicating that no pointer was
 * already stored, afb_req_context creates a new context by calling
 * the function 'create_context' and stores it with the freeing function
 * 'free_context'.
 */
static inline void *afb_req_context(struct afb_req req, void *(*create_context)(), void (*free_context)(void*))
{
	void *result = afb_req_context_get(req);
	if (result == NULL) {
		result = create_context();
		afb_req_context_set(req, result, free_context);
	}
	return result;
}
```

The second argument if the function that creates the context.
For binding *tic-tac-toe* (function **get_new_board**).
The function **get_new_board** creates a new board and set usage its count to 1.
The boards are checking usage count to free resources when not used.

The third argument is a function that frees context resources.
For binding *tic-tac-toe* (function **release_board**).
The function **release_board** decrease usage count of the board passed in argument.
When usage count falls to zero, data board are freed.

Definition of other functions dealing with contexts:

```C
/*
 * Gets the pointer stored by the binding for the session of 'req'.
 * When the binding has not yet recorded a pointer, NULL is returned.
 */
void *afb_req_context_get(struct afb_req req);

/*
 * Stores for the binding the pointer 'context' to the session of 'req'.
 * The function 'free_context' will be called when the session is closed
 * or if binding stores an other pointer.
 */
void afb_req_context_set(struct afb_req req, void *context, void (*free_context)(void*));

/*
 * Frees the pointer stored by the binding for the session of 'req'
 * and sets it to NULL.
 *
 * Shortcut for: afb_req_context_set(req, NULL, NULL)
 */
static inline void afb_req_context_clear(struct afb_req req)
{
	afb_req_context_set(req, NULL, NULL);
}
```

### Sending reply to a request

Two kinds of replies: successful or failure.

> Sending a reply to a request MUST be done once and only once.

It exists two functions for "success" replies: **afb_req_success** and **afb_req_success_f**.

```C
/*
 * Sends a reply of kind success to the request 'req'.
 * The status of the reply is automatically set to "success".
 * Its send the object 'obj' (can be NULL) with an
 * informationnal comment 'info (can also be NULL).
 *
 * For convenience, the function calls 'json_object_put' for 'obj'.
 * Thus, in the case where 'obj' should remain available after
 * the function returns, the function 'json_object_get' shall be used.
 */
void afb_req_success(struct afb_req req, struct json_object *obj, const char *info);

/*
 * Same as 'afb_req_success' but the 'info' is a formatting
 * string followed by arguments.
 *
 * For convenience, the function calls 'json_object_put' for 'obj'.
 * Thus, in the case where 'obj' should remain available after
 * the function returns, the function 'json_object_get' shall be used.
 */
void afb_req_success_f(struct afb_req req, struct json_object *obj, const char *info, ...);
```

It exists two functions for "failure" replies: **afb_req_fail** and **afb_req_fail_f**.

```C
/*
 * Sends a reply of kind failure to the request 'req'.
 * The status of the reply is set to 'status' and an
 * informational comment 'info' (can also be NULL) can be added.
 *
 * Note that calling afb_req_fail("success", info) is equivalent
 * to call afb_req_success(NULL, info). Thus even if possible it
 * is strongly recommended to NEVER use "success" for status.
 *
 * For convenience, the function calls 'json_object_put' for 'obj'.
 * Thus, in the case where 'obj' should remain available after
 * the function returns, the function 'json_object_get' shall be used.
 */
void afb_req_fail(struct afb_req req, const char *status, const char *info);

/*
 * Same as 'afb_req_fail' but the 'info' is a formatting
 * string followed by arguments.
 *
 * For convenience, the function calls 'json_object_put' for 'obj'.
 * Thus, in the case where 'obj' should remain available after
 * the function returns, the function 'json_object_get' shall be used.
 */
void afb_req_fail_f(struct afb_req req, const char *status, const char *info, ...);
```

> For convenience, these functions automatically call **json_object_put** to release **obj**.
> Because **obj** usage count is null after being passed to a reply function, it SHOULD not be used anymore.
> If exceptionally **obj** needs to remain usable after reply function then using **json_object_get** on **obj**
> to increase usage count and cancels the effect the **json_object_put** is possible.

Getting argument of invocation
------------------------------

Many methods expect arguments. Afb-daemon's bindings
retrieve arguments by name and not by position.

Arguments are passed by requests through either HTTP
or WebSockets.

For example, the method **join** of binding **tic-tac-toe**
expects one argument: the *boardid* to join. Here is an extract:

```C
/*
 * Join a board
 */
static void join(struct afb_req req)
{
	struct board *board, *new_board;
	const char *id;

	/* retrieves the context for the session */
	board = board_of_req(req);
	INFO(afbitf, "method 'join' called for boardid %d", board->id);

	/* retrieves the argument */
	id = afb_req_value(req, "boardid");
	if (id == NULL)
		goto bad_request;
	...
```

The function **afb_req_value** searches in the request *req*
for argument name passed in the second argument. When argument name
is not passed, **afb_req_value** returns NULL.

> The search is case sensitive and *boardid* is not equivalent to *BoardId*.
> Nevertheless having argument names that only differ by name case is not a good idea.

### Basic functions for querying arguments

The function **afb_req_value** is defined here after:

```C
/*
 * Gets from the request 'req' the string value of the argument of 'name'.
 * Returns NULL if when there is no argument of 'name'.
 * Returns the value of the argument of 'name' otherwise.
 *
 * Shortcut for: afb_req_get(req, name).value
 */
static inline const char *afb_req_value(struct afb_req req, const char *name)
{
	return afb_req_get(req, name).value;
}
```

It is defined as a shortcut to call the function **afb_req_get**.
That function is defined here after:

```C
/*
 * Gets from the request 'req' the argument of 'name'.
 * Returns a PLAIN structure of type 'struct afb_arg'.
 * When the argument of 'name' is not found, all fields of result are set to NULL.
 * When the argument of 'name' is found, the fields are filled,
 * in particular, the field 'result.name' is set to 'name'.
 *
 * There is a special name value: the empty string.
 * The argument of name "" is defined only if the request was made using
 * an HTTP POST of Content-Type "application/json". In that case, the
 * argument of name "" receives the value of the body of the HTTP request.
 */
struct afb_arg afb_req_get(struct afb_req req, const char *name);
```

That function takes 2 parameters: the request and the name
of the argument to retrieve. It returns a PLAIN structure of
type **struct afb_arg**.

There is a special name that is defined when the request is
of type HTTP/POST with a Content-Type being application/json.
This name is **""** (the empty string). In that case, the value
of this argument of empty name is the string received as a body
of the post and is supposed to be a JSON string.

The definition of **struct afb_arg** is:

```C
/*
 * Describes an argument (or parameter) of a request
 */
struct afb_arg {
	const char *name;	/* name of the argument or NULL if invalid */
	const char *value;	/* string representation of the value of the argument */
				/* original filename of the argument if path != NULL */
	const char *path;	/* if not NULL, path of the received file for the argument */
				/* when the request is finalized this file is removed */
};
```

The structure returns the data arguments that are known for the
request. This data include a field named **path**. This **path**
can be accessed using the function **afb_req_path** defined here after:

```C
/*
 * Gets from the request 'req' the path for file attached to the argument of 'name'.
 * Returns NULL if when there is no argument of 'name' or when there is no file.
 * Returns the path of the argument of 'name' otherwise.
 *
 * Shortcut for: afb_req_get(req, name).path
 */
static inline const char *afb_req_path(struct afb_req req, const char *name)
{
	return afb_req_get(req, name).path;
}
```

The path is only defined for HTTP/POST requests that send file.

### Arguments for received files

As it is explained above, clients can send files using HTTP/POST requests.

Received files are attached to "file" argument name. For example, the
following HTTP fragment (from test/sample-post.html)
will send an HTTP/POST request to the method
**post/upload-image** with 2 arguments named *file* and
*hidden*.

```html
<h2>Sample Post File</h2>
<form enctype="multipart/form-data">
    <input type="file" name="file" />
    <input type="hidden" name="hidden" value="bollobollo" />
    <br>
    <button formmethod="POST" formaction="api/post/upload-image">Post File</button>
</form>
```

Argument named **file** should have both its value and path defined.

The value is the name of the file as it was set by the HTTP client.
Generally it is the filename on client side.

The path is the effective path of saved file on the temporary local storage
area of the application. This is a randomly generated and unique filename. 
It is not linked with the original filename as used on client side.

After success the binding can use the uploaded file directly from local storage path with no restriction:
read, write, remove, copy, rename...
Nevertheless when request reply is set and query terminated, the uploaded temporary file at
path is destroyed.

### Arguments as a JSON object

Bindings may also request every arguments of a given call as one single object.
This feature is provided by the function **afb_req_json** defined here after:

```C
/*
 * Gets from the request 'req' the json object hashing the arguments.
 * The returned object must not be released using 'json_object_put'.
 */
struct json_object *afb_req_json(struct afb_req req);
```

It returns a json object. This object depends on how the request was built:

- For HTTP requests, this json object uses key names mapped on argument name. 
Values are either string for common arguments or object ie: { "file": "...", "path": "..." }

- For WebSockets requests, returned directly the object as provided by the client.

> In fact, for Websockets requests, the function **afb_req_value**
> can be seen as a shortcut to
> ***json_object_get_string(json_object_object_get(afb_req_json(req), name))***

Initialisation of the binding and declaration of methods
-----------------------------------------------------

To be active, binding's methods should be declared to
afb-daemon. Furthermore, the binding itself must be recorded.

The registration mechanism is very basic: when afb-need starts,
it loads all bindings listed in: command line or configuration file.

Loading a binding follows the following steps:

1. Afb-daemon loads the binding with *dlopen*.

2. Afb-daemon searches for a symbol named **afbBindingV1Register** using *dlsym*.
This symbol is assumed to be the exported initialisation function of the binding.

3. Afb-daemon builds an interface object for the binding.

4. Afb-daemon calls the found function **afbBindingV1Register** with interface pointer
as parameter.

5. Function **afbBindingV1Register** setups the binding and initialises it.

6. Function **afbBindingV1Register** returns the pointer to a structure
describing the binding: version, name (prefix or API name), and list of methods.

7. Afb-daemon checks that the returned version and name can be managed.
If so, binding and its methods are register to become usable as soon as
afb-daemon initialisation is finished.

Here after the code used for **afbBindingV1Register** from binding *tic-tac-toe*:

```C
/*
 * activation function for registering the binding called by afb-daemon
 */
const struct afb_binding *afbBindingV1Register(const struct afb_binding_interface *itf)
{
   afbitf = itf;         // records the interface for accessing afb-daemon
   return &binding_description;  // returns the description of the binding
}
```

It is a very minimal initialisation function because *tic-tac-toe* binding doesn't
have any application related initialisation step. It merely record daemon's interface
and returns its description.

The variable **afbitf** is a binding global variable. It keeps the
interface to afb-daemon that should be used for logging and pushing events.
Here is its declaration:

```C
/*
 * the interface to afb-daemon
 */
const struct afb_binding_interface *afbitf;
```

The description of the binding is defined here after.

```C
/*
 * array of the methods exported to afb-daemon
 */
static const struct afb_verb_desc_v1 binding_methods[] = {
   /* VERB'S NAME     SESSION MANAGEMENT          FUNCTION TO CALL  SHORT DESCRIPTION */
   { .name= "new",   .session= AFB_SESSION_NONE, .callback= new,   .info= "Starts a new game" },
   { .name= "play",  .session= AFB_SESSION_NONE, .callback= play,  .info= "Asks the server to play" },
   { .name= "move",  .session= AFB_SESSION_NONE, .callback= move,  .info= "Tells the client move" },
   { .name= "board", .session= AFB_SESSION_NONE, .callback= board, .info= "Get the current board" },
   { .name= "level", .session= AFB_SESSION_NONE, .callback= level, .info= "Set the server level" },
   { .name= "join",  .session= AFB_SESSION_CHECK,.callback= join,  .info= "Join a board" },
   { .name= "undo",  .session= AFB_SESSION_NONE, .callback= undo,  .info= "Undo the last move" },
   { .name= "wait",  .session= AFB_SESSION_NONE, .callback= wait,  .info= "Wait for a change" },
   { .name= NULL } /* marker for end of the array */
};

/*
 * description of the binding for afb-daemon
 */
static const struct afb_binding binding_description =
{
   /* description conforms to VERSION 1 */
   .type= AFB_BINDING_VERSION_1,
   .v1= {				/* fills the v1 field of the union when AFB_BINDING_VERSION_1 */
      .prefix= "tictactoe",		/* the API name (or binding name or prefix) */
      .info= "Sample tac-tac-toe game",	/* short description of of the binding */
      .methods = binding_methods		/* the array describing the methods of the API */
   }
};
```

The structure **binding_description** describes the binding.
It declares the type and version of the binding, its name, a short description
and its methods list.

The list of methods is an array of structures describing the methods and terminated by a NULL marker.

In version one of afb-damon binding, a method description contains 4 fields:

- the name of the method,

- the session management flags,

- the implementation function to be call for the method,

- a short description.

The structure describing methods is defined as follows:

```C
/*
 * Description of one method of the API provided by the binding
 * This enumeration is valid for bindings of type 1
 */
struct afb_verb_desc_v1
{
       const char *name;                       /* name of the method */
       enum AFB_session_v1 session;            /* authorisation and session requirements of the method */
       void (*callback)(struct afb_req req);   /* callback function implementing the method */
       const char *info;                       /* textual description of the method */
};
```

For technical reasons, the enumeration **enum AFB_session_v1** is not exactly an
enumeration but the wrapper of constant definitions that can be mixed using bitwise or
(the C operator |).

The constants that can bit mixed are:

Constant name            | Meaning
-------------------------|-------------------------------------------------------------
**AFB_SESSION_CREATE**   | Equals to AFB_SESSION_LOA_EQ_0|AFB_SESSION_RENEW
**AFB_SESSION_CLOSE**    | Closes the session after the reply and set the LOA to 0
**AFB_SESSION_RENEW**    | Refreshes the token of authentification
**AFB_SESSION_CHECK**    | Just requires the token authentification
**AFB_SESSION_LOA_LE_0** | Requires the current LOA to be lesser then or equal to 0
**AFB_SESSION_LOA_LE_1** | Requires the current LOA to be lesser then or equal to 1
**AFB_SESSION_LOA_LE_2** | Requires the current LOA to be lesser then or equal to 2
**AFB_SESSION_LOA_LE_3** | Requires the current LOA to be lesser then or equal to 3
**AFB_SESSION_LOA_GE_0** | Requires the current LOA to be greater then or equal to 0
**AFB_SESSION_LOA_GE_1** | Requires the current LOA to be greater then or equal to 1
**AFB_SESSION_LOA_GE_2** | Requires the current LOA to be greater then or equal to 2
**AFB_SESSION_LOA_GE_3** | Requires the current LOA to be greater then or equal to 3
**AFB_SESSION_LOA_EQ_0** | Requires the current LOA to be equal to 0
**AFB_SESSION_LOA_EQ_1** | Requires the current LOA to be equal to 1
**AFB_SESSION_LOA_EQ_2** | Requires the current LOA to be equal to 2
**AFB_SESSION_LOA_EQ_3** | Requires the current LOA to be equal to 3

If any of this flag is set, afb-daemon requires an authentication token
as if **AFB_SESSION_CHECK** flag was also set.

The special value **AFB_SESSION_NONE** is zero and can be used to bypass token check.

> Note that **AFB_SESSION_CREATE** and **AFB_SESSION_CLOSE** might be removed in later versions.

Sending messages to the log system
----------------------------------

Afb-daemon provides 4 levels of verbosity and 5 methods for logging messages.

The verbosity is managed. Options allow the change the verbosity of afb-daemon
and the verbosity of the bindings can be set binding by binding.

The methods for logging messages are defined as macros that test the
verbosity level and that call the real logging function only if the
message must be output. This avoid evaluation of arguments of the
formatting messages if the message must not be output.

### Verbs for logging messages

The 5 logging methods are:

Macro   | Verbosity | Meaning                           | syslog level
--------|:---------:|-----------------------------------|:-----------:
ERROR   |     0     | Error conditions                  |     3
WARNING |     1     | Warning conditions                |     4
NOTICE  |     1     | Normal but significant condition  |     5
INFO    |     2     | Informational                     |     6
DEBUG   |     3     | Debug-level messages              |     7

You can note that the 2 methods **WARNING** and **INFO** have the same level
of verbosity. But they don't have the same *syslog level*. It means that
they are output with a different level on the logging system.

All of these methods have the same signature:

```C
void ERROR(const struct afb_binding_interface *afbitf, const char *message, ...);
```

The first argument **afbitf** is the interface to afb daemon that the
binding received at initialisation time when **afbBindingV1Register** is called.

The second argument **message** is a formatting string compatible with printf/sprintf.

The remaining arguments are arguments of the formating message like with printf.

### Managing verbosity

Depending on the level of verbosity, the messages are output or not.
The following table explains what messages will be output depending
ont the verbosity level.

Level of verbosity | Outputed macro
:-----------------:|--------------------------
0                  | ERROR
1                  | ERROR + WARNING + NOTICE
2                  | ERROR + WARNING + NOTICE + INFO
3                  | ERROR + WARNING + NOTICE + INFO + DEBUG

### Output format and destination

The syslog level is used for forging a prefix to the message.
The prefixes are:

syslog level | prefix
:-----------:|---------------
0            | <0> EMERGENCY
1            | <1> ALERT
2            | <2> CRITICAL
3            | <3> ERROR
4            | <4> WARNING
5            | <5> NOTICE
6            | <6> INFO
7            | <7> DEBUG


The message is pushed to standard error.
The final destination of the message depends on how systemd service
was configured through its variable **StandardError**. It can be
journal, syslog or kmsg. (See man sd-daemon).

Sending events
--------------

Since version 0.5, bindings can broadcast events to any potential listener.
As today only unattended even are supported. Targeted events are expected for next
coming version.

The binding *tic-tac-toe* broadcasts events when the board changes.
This is done in the function **changed**:

```C
/*
 * signals a change of the board
 */
static void changed(struct board *board, const char *reason)
{
	...
	struct json_object *description;

	/* get the description */
	description = describe(board);

	...

	afb_daemon_broadcast_event(afbitf->daemon, reason, description);
}
```

The description of the changed board is pushed via the daemon interface.

Within binding *tic-tac-toe*, *reason* indicates the origin of
the change. In function **afb_daemon_broadcast_event** the second
parameter is the name of broadcasted event. The third argument is the
object that is transmitted with the event.

Function **afb_daemon_broadcast_event** is defined here after:

```C
/*
 * Broadcasts widely the event of 'name' with the data 'object'.
 * 'object' can be NULL.
 * 'daemon' MUST be the daemon given in interface when activating the binding.
 *
 * For convenience, the function calls 'json_object_put' for 'object'.
 * Thus, in the case where 'object' should remain available after
 * the function returns, the function 'json_object_get' shall be used.
 */
void afb_daemon_broadcast_event(struct afb_daemon daemon, const char *name, struct json_object *object);
```

> Be aware, as with reply functions **object** is automatically released using
> **json_object_put** when using this function. Call **json_object_get** before
> calling **afb_daemon_broadcast_event** to keep **object** available
> after function returns.

Event name received by listeners is prefixed with binding name.
So when a change occurs after a move, the reason is **move** and every clients
receive an event **tictactoe/move**.

> Note that nothing is said about case sensitivity of event names.
> However, the event is always prefixed with the name that the binding
> declared, with the same case, followed with a slash /.
> Thus it is safe to compare event using a case sensitive comparison.



Writing an asynchronous method implementation
-------------------------------------------

The *tic-tac-toe* example allows two clients or more to share the same board.
This is implemented by the method **join** that illustrated partly how to
retrieve arguments.

When two or more clients are sharing a same board, one of them can wait
until the state of the board changes, but this could also be implemented using
events because an even is generated each time the board changes.

In this case, the reply to the wait is sent only when the board changes.
See the diagram below:

	CLIENT A       CLIENT B         TIC-TAC-TOE
	   |              |                  |
	   +--------------|----------------->| wait . . . . . . . .
	   |              |                  |                     .
	   :              :                  :                      .
	   :              :                  :                      .
	   |              |                  |                      .
	   |              +----------------->| move . . .           .
	   |              |                  |          V           .
	   |              |<-----------------+ success of move      .
	   |              |                  |                    .
	   |<-------------|------------------+ success of wait  <

Here, this is an invocation of the binding by an other client that
unblock the suspended *wait* call.
Nevertheless in most case this should be a timer, a hardware event, a sync with
a concurrent process or thread, ...

Common case of an asynchronous implementation.

Here is the listing of the function **wait**:

```C
static void wait(struct afb_req req)
{
	struct board *board;
	struct waiter *waiter;

	/* retrieves the context for the session */
	board = board_of_req(req);
	INFO(afbitf, "method 'wait' called for boardid %d", board->id);

	/* creates the waiter and enqueues it */
	waiter = calloc(1, sizeof *waiter);
	waiter->req = req;
	waiter->next = board->waiters;
	afb_req_addref(req);
	board->waiters = waiter;
}
```

After retrieving the board, the function adds a new waiter to
waiters list and returns without setting a reply.

Before returning, it increases **req** request's reference count using **afb_req_addref** function.

> When a method returns without setting a reply,
> it **MUST** increment request's reference count
> using **afb_req_addref**. If unpredictable behaviour may pop up.

Later, when a board changes, it calls *tic-tac-toe* **changed** function
with reason of change in parameter.

Here is the full listing of the function **changed**:

```C
/*
 * signals a change of the board
 */
static void changed(struct board *board, const char *reason)
{
	struct waiter *waiter, *next;
	struct json_object *description;

	/* get the description */
	description = describe(board);

	waiter = board->waiters;
	board->waiters = NULL;
	while (waiter != NULL) {
		next = waiter->next;
		afb_req_success(waiter->req, json_object_get(description), reason);
		afb_req_unref(waiter->req);
		free(waiter);
		waiter = next;
	}

	afb_event_sender_push(afb_daemon_get_event_sender(afbitf->daemon), reason, description);
}
```

The list of waiters is walked and a reply is sent to each waiter.
After sending the reply, the reference count of the request
is decremented using **afb_req_unref** to allow resources to be freed.

> The reference count **MUST** be decremented using **afb_req_unref** to free
> resources and avoid memory leaks.
> This usage count decrement should happen **AFTER** setting reply or 
> bad things may happen.

How to build a binding
---------------------

Afb-daemon provides a *pkg-config* configuration file that can be
queried by providing **afb-daemon** in command line arguments.
This configuration file provides data that should be used
for bindings compilation. Examples:

```bash
$ pkg-config --cflags afb-daemon
$ pkg-config --libs afb-daemon
```

### Example for cmake meta build system

This example is the extract for building the binding *afm-main* using *CMAKE*.

```cmake
pkg_check_modules(afb afb-daemon)
if(afb_FOUND)
	message(STATUS "Creation afm-main-binding for AFB-DAEMON")
	add_library(afm-main-binding MODULE afm-main-binding.c)
	target_compile_options(afm-main-binding PRIVATE ${afb_CFLAGS})
	target_include_directories(afm-main-binding PRIVATE ${afb_INCLUDE_DIRS})
	target_link_libraries(afm-main-binding utils ${afb_LIBRARIES})
	set_target_properties(afm-main-binding PROPERTIES
		PREFIX ""
		LINK_FLAGS "-Wl,--version-script=${CMAKE_CURRENT_SOURCE_DIR}/afm-main-binding.export-map"
	)
	install(TARGETS afm-main-binding LIBRARY DESTINATION ${binding_dir})
else()
	message(STATUS "Not creating the binding for AFB-DAEMON")
endif()
```

Let now describe some of these lines.

```cmake
pkg_check_modules(afb afb-daemon)
```

This first lines searches to the *pkg-config* configuration file for
**afb-daemon**. Resulting data are stored in the following variables:

Variable          | Meaning
------------------|------------------------------------------------
afb_FOUND         | Set to 1 if afb-daemon binding development files exist
afb_LIBRARIES     | Only the libraries (w/o the '-l') for compiling afb-daemon bindings
afb_LIBRARY_DIRS  | The paths of the libraries (w/o the '-L') for compiling afb-daemon bindings
afb_LDFLAGS       | All required linker flags for compiling afb-daemon bindings
afb_INCLUDE_DIRS  | The '-I' preprocessor flags (w/o the '-I') for compiling afb-daemon bindings
afb_CFLAGS        | All required cflags for compiling afb-daemon bindings

If development files are found, the binding can be added to the set of
target to build.

```cmake
add_library(afm-main-binding MODULE afm-main-binding.c)
```

This line asks to create a shared library having a single
source file named afm-main-binding.c to be compiled.
The default name of the created shared object is
**libafm-main-binding.so**.

```cmake
set_target_properties(afm-main-binding PROPERTIES
	PREFIX ""
	LINK_FLAGS "-Wl,--version-script=${CMAKE_CURRENT_SOURCE_DIR}/afm-main-binding.export-map"
)
```

This lines are doing two things:

1. It renames the built library from **libafm-main-binding.so** to **afm-main-binding.so**
by removing the implicitly added prefix *lib*. This step is not mandatory
because afb-daemon doesn't check names of files at load time.
The only filename convention used by afb-daemon relates to **.so** termination.
*.so pattern is used when afb-daemon automatically discovers binding from a directory hierarchy.

2. It applies a version script at link time to only export the reserved name
**afbBindingV1Register** for registration entry point. By default, when building 
a shared library linker exports all the public symbols (C functions that are not **static**).

Next line are:

```cmake
target_include_directories(afm-main-binding PRIVATE ${afb_INCLUDE_DIRS})
target_link_libraries(afm-main-binding utils ${afb_LIBRARIES})
```

As you can see it uses the variables computed by ***pkg_check_modules(afb afb-daemon)***
to configure the compiler and the linker.

### Exporting the function afbBindingV1Register

The function **afbBindingV1Register** MUST be exported. This can be achieved
using a version script at link time. Here after is a version script used for
*tic-tac-toe* (bindings/samples/export.map).

	{ global: afbBindingV1Register; local: *; };

This sample [version script](https://sourceware.org/binutils/docs-2.26/ld/VERSION.html#VERSION)
exports as global the symbol *afbBindingV1Register* and hides any
other symbols.

This version script is added to the link options using the
option **--version-script=export.map** is given directly to the
linker or using the option **-Wl,--version-script=export.map**
when the option is given to the C compiler.

### Building within yocto

Adding a dependency to afb-daemon is enough. See below:

	DEPENDS += " afb-daemon "

