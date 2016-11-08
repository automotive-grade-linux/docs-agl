
Overview of AFB-DAEMON
======================

Roles of afb-daemon
-------------------

The name **afb-daemon** stands for *Application
Framework Binder Daemon*. That is why afb-daemon
is also named ***the binder***.

**Afb-daemon** is in charge to bind one instance of
an application to the AGL framework and AGL system.

On the following figure, you can use a typical use
of afb-daemon:

<a id="binder-fig-basis"><h4>Figure: binder afb-daemon, basis</h4></a>

	. . . . . . . . . . . . . . . . . . . . . . . . . .
	.        Isolated security context                .
	.                                                 .
	.        +------------------------------+         .
	.        |                              |         .
	.        |    A P P L I C A T I O N     |         .
	.        |                              |         .
	.        +--------------+---------------+         .
	.                       |                         .
	.                       |                         .
	.   +-------------------+----------------------+  .
	.   |                            :             |  .
	.   |        b i n d e r         :             |  .
	.   |    A F B - D A E M O N     :  BINDINGS   |  .
	.   |                            :             |  .
	.   +-------------------+----------------------+  .
	.                       |                         .
	. . . . . . . . . . . . | . . . . . . . . . . . . .
	                        |
	                        v
	                   AGL SYSTEM

The application and its companion binder run in secured and isolated
environment set for them. Applications are intended to access to AGL
system through the binder.

The binder afb-daemon serves multiple purposes:

1. It acts as a gateway for the application to access the system;

2. It acts as an HTTP server for serving files to HTML5 applications;

3. It allows HTML5 applications to have native extensions subject
to security enforcement for accessing hardware ressources or
for speeding parts of algorithm.

Use cases of the binder afb-daemon
----------------------------------

This section tries to give a better understanding of the binder
usage through several use cases.

### Remotely running application

One of the most interresting aspect of using the binder afb-daemon
is the ability to run applications remotely. This feature is
possible because the binder afb-daemon implements native web
protocols.

So the [figure binder, basis](#binder-fig-1) would become
when the application is run remotely:

<a id="binder-fig-remote"><h4>Figure: binder afb-daemon and remotely running application</h4></a>

	             +------------------------------+
	             |                              |
	             |    A P P L I C A T I O N     |
	             |                              |
	             +--------------+---------------+
	                            |
	                       ~ ~ ~ ~ ~ ~
	                      :  NETWORK  :
	                       ~ ~ ~ ~ ~ ~
	                            |
	. . . . . . . . . . . . . . | . . . . . . . . . . . . . .
	. Isolated security         |                           .
	.   context                 |                           .
	.                           |                           .
	.     . . . . . . . . . . . . . . . . . . . . . . . .   .
	.     .                                             .   .
	.     .               F I R E W A L L               .   .
	.     .                                             .   .
	.     . . . . . . . . . . . . . . . . . . . . . . . .   .
	.                           |                           .
	.       +-------------------+----------------------+    .
	.       |                            :             |    .
	.       |    A F B - D A E M O N     :   BINDINGS  |    .
	.       |                            :             |    .
	.       +-------------------+----------------------+    .
	.                           |                           .
	. . . . . . . . . . . . . . | . . . . . . . . . . . . . .
	                            |
	                            v
	                       AGL SYSTEM

### Adding native features to HTML5/QML applications

Applications can provide with their packaged delivery a binding.
That binding will be instanciated for each application instance.
The methods of the binding will be accessible by applications and
will be excuted within the security context.

### Offering services to the system

It is possible to run the binder afb-daemon as a daemon that provides the
API of its bindings.

This will be used for:

1. offering common APIs

2. provide application's services (services provided as application)

In that case, the figure showing the whole aspects is

<a id="binder-fig-remote"><h4>Figure: binder afb-daemon for services</h4></a>

	. . . . . . . . . . . . . . . . . . . . . . 
	.  Isolated security context application  . 
	.                                         . 
	.    +------------------------------+     . 
	.    |                              |     . 
	.    |    A P P L I C A T I O N     |     . 
	.    |                              |     . 
	.    +--------------+---------------+     .     . . . . . . . . . . . . . . . . . . . . . .
	.                   |                     .     .        Isolated security context A      .
	.                   |                     .     .                                         .
	. +-----------------+------------------+  .     . +------------------------------------+  .
	. |                        :           |  .     . |                        :           |  .
	. |      b i n d e r       :           |  .     . |      b i n d e r       :  service  |  .
	. |  A F B - D A E M O N   : BINDINGS  |  .     . |  A F B - D A E M O N   : BINDINGS  |  .
	. |                        :           |  .     . |                        :     A     |  .
	. +-----------------+------------------+  .     . +-----------------+------------------+  .
	.                   |                     .     .                   |                     .
	. . . . . . . . . . | . . . . . . . . . . .     . . . . . . . . . . | . . . . . . . . . . .
	                    |                                               |
	                    v                                               v
	         ================================================================================
	                                     D - B U S   &   C Y N A R A
	         ================================================================================
	                    ^                                               ^
	                    |                                               |
	. . . . . . . . . . | . . . . . . . . . . .     . . . . . . . . . . | . . . . . . . . . . .
	.                   |                     .     .                   |                     .
	. +-----------------+------------------+  .     . +-----------------+------------------+  .
	. |                        :           |  .     . |                        :           |  .
	. |      b i n d e r       :  service  |  .     . |      b i n d e r       :  service  |  .
	. |  A F B - D A E M O N   : BINDINGS  |  .     . |  A F B - D A E M O N   : BINDINGS  |  .
	. |                        :     B     |  .     . |                        :     C     |  .
	. +------------------------------------+  .     . +------------------------------------+  .
	.                                         .     .                                         .
	.        Isolated security context B      .     .        Isolated security context C      .
	. . . . . . . . . . . . . . . . . . . . . .     . . . . . . . . . . . . . . . . . . . . . .


For this case, the binder afb-daemon takes care to attribute one single session
context to each client instance. It allows bindings to store and retrieve data
associated to each of its client.

The bindings of the binder afb-daemon
------------------------------------

The binder can instanciate bindings. The primary use of bindings
is to add native methods that can be accessed by applications
written with any language through web technologies ala JSON RPC.

This simple idea is declined to serves multiple purposes:

1. add native feature to applications

2. add common API available by any applications

3. provide customers services

A specific document explains how to write an afb-daemon binder binding:
[HOWTO WRITE a BINDING for AFB-DAEMON](afb-binding-writing.html)


Launching the binder afb-daemon
-------------------------------

The launch options for binder **afb-daemon** are:

	  --help

		Prints help with available options

	  --version

		Display version and copyright

	  --verbose

		Increases the verbosity, can be repeated

	  --port=xxxx

		HTTP listening TCP port  [default 1234]

	  --rootdir=xxxx

		HTTP Root Directory [default $AFBDIR or else $HOME/.AFB]

	  --rootbase=xxxx

		Angular Base Root URL [default /opa]

		This is used for any application of kind OPA (one page application).
		When set, any missing document whose url has the form /opa/zzz
		is translated to /opa/#!zzz

	  --rootapi=xxxx

		HTML Root API URL [default /api]

		The bindings are available within that url.

	  --alias=xxxx

		Maps a path located anywhere in the file system to the
		a subdirectory. The syntax for mapping a PATH to the
		subdirectory NAME is: --alias=/NAME:PATH.

		Example: --alias=/icons:/usr/share/icons maps the
		content of /usr/share/icons within the subpath /icons.

		This option can be repeated.

	  --apitimeout=xxxx

		binding API timeout in seconds [default 20]

		Defines how many seconds maximum a method is allowed to run.
		0 means no limit.

	  --cntxtimeout=xxxx

		Client Session Timeout in seconds [default 3600]

	  --cache-eol=xxxx

		Client cache end of live [default 100000 that is 27,7 hours]

	  --sessiondir=xxxx

		Sessions file path [default rootdir/sessions]

	  --session-max=xxxx

		Maximum count of simultaneous sessions [default 10]

	  --ldpaths=xxxx

		Load bindings from given paths separated by colons
		as for dir1:dir2:binding1.so:... [default = $libdir/afb]

		You can mix path to directories and to bindings.
		The sub-directories of the given directories are searched
		recursively.

		The bindings are the files terminated by '.so' (the extension
		so denotes shared object) that contain the public entry symbol.

	  --binding=xxxx

		Load the binding of given path.

	  --token=xxxx

		Initial Secret token to authenticate.

		If not set, no client can authenticate.

		If set to the empty string, then any initial token is accepted.

	  --mode=xxxx

		Set the mode: either local, remote or global.

		The mode indicate if the application is run locally on the host
		or remotely through network.

	  --readyfd=xxxx

		Set the #fd to signal when ready

		If set, the binder afb-daemon will write "READY=1\n" on the file
		descriptor whose number if given (/proc/self/fd/xxx).

	  --dbus-client=xxxx

		Transparent binding to a binder afb-daemon service through dbus.

		It creates an API of name xxxx that is implemented remotely
		and queried via DBUS.

	  --dbus-server=xxxx

		Provides a binder afb-daemon service through dbus.

		The name xxxx must be the name of an API defined by a binding.
		This API is exported through DBUS.

	  --foreground

		Get all in foreground mode (default)

	  --daemon

		Get all in background mode


Future development of afb-daemon
--------------------------------

- The binder afb-daemon would launch the applications directly.

- The current setting of mode (local/remote/global) might be reworked to a
mechanism for querying configuration variables.

- Implements "one-shot" initial token. It means that after its first
authenticated use, the initial token is removed and no client can connect
anymore.

- Creates some intrinsic APIs.

- Make the service connection using WebSocket not DBUS.

- Management of targetted events.

- Securisation of LOA.

- Integration of the protocol JSON-RPC for the websockets.


