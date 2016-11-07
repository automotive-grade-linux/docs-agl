
The afm-user-daemon
===================

Foreword
--------

This document describes application framework user daemon fundamentals. 
FCF (Fully Conform to Specification) implementation is still under development.
It may happen that current implementation somehow diverges with specifications.


Introduction
------------

The daemon **afm-user-daemon** is in charge of handling
applications on behalf of a user. Its main tasks are:

 - enumerate applications that end user can run
   and keep this list available on demand

 - start applications on behalf of end user, set user running
   environment, set user security context

 - list current runnable or running applications

 - stop (aka pause), continue (aka resume), terminate
   a running instance of a given application

 - transfer requests for installation/uninstallation
   of applications to the corresponding system daemon
   **afm-system-daemon**

The **afm-user-daemon** takes its orders from the session
instance of D-Bus.

The figure below summarizes the situation of **afm-user-daemon** in the system.

    +------------------------------------------------------------+
    |                          User                              |
    |                                 +---------------------+    |
    |     +---------------------+     |   Smack isolated    |    |
    |     |   D-Bus   session   +     |    APPLICATIONS     |    |
    |     +----------+----------+     +---------+-----------+    |
    |                |                          |                |
    |                |                          |                |
    |     +----------+--------------------------+-----------+    |
    |     |                                                 |    |
    |     |                  afm-user-daemon                |    |
    |     |                                                 |    |
    |     +----------+----------------------+----------+----+    |
    |                |                      |          :         |
    |                |                      |          :         |
    :================|======================|==========:=========:
    |                |                      |          :         |
    |     +----------+----------+     +-----+-----+    :         |
    |     |   D-Bus   system    +-----+  CYNARA   |    :         |
    |     +----------+----------+     +-----+-----+    :         |
    |                |                      |          :         |
    |     +----------+---------+    +-------+----------+----+    |
    |     | afm-system-daemon  +----+   SECURITY-MANAGER    |    |
    |     +--------------------+    +-----------------------+    |
    |                                                            |
    |                          System                            |
    +------------------------------------------------------------+


Tasks of **afm-user-daemon**
----------------------------

### Maintaining list of applications ###

At start **afm-user-daemon** scans the directories containing
applications and load in memory a list of avaliable applications
accessible by current user.

When **afm-system-daemon** installs or removes an application.
On success it sends the signal *org.AGL.afm.system.changed*.
When receiving such a signal, **afm-user-daemon** rebuilds its
applications list.

**afm-user-daemon** provides the data it collects about
applications to its clients. Clients may either request the full list
of avaliable applications or a more specific information about a
given application.

### Launching application ###

**afm-user-daemon** launches application. Its builds a secure
environment for the application before starting it within a
secured environment.

Different kind of applications can be launched.

This is set using a configuration file that describes
how to launch an application of a given kind within a given
mode.

There is two launching modes: local or remote.

Launching an application locally means that
the application and its binder are launched together.

Launching application remotely translates in only launching 
the application binder. The UI by itself has to be activated
remotely by the requested (ie: HTML5 homescreen in a browser)

Once launched, running instances of application receive
a runid that identify them.

### Managing instances of running applications ###

**afm-user-daemon** manages the list of applications
that it launched.

When owning the right permissions, a client can get the list
of running instances and details about a specific
running instance. It can also terminates, stops or
continues a given application.

### Installing and uninstalling applications ###

If the client own the right permissions,
**afm-user-daemon** delegates that task
to **afm-system-daemon**.


Starting **afm-user-daemon**
-----------------------------

**afm-user-daemon** is launched as a **systemd** service
attached to user sessions. Normally, the service file is
located at /usr/lib/systemd/user/afm-user-daemon.service.

The options for launching **afm-user-daemon** are:

    -a
    --application directory
    
         Includes the given application directory to
         the database base of applications.
    
         Can be repeated.
    
    -r
    --root directory 
    
         Includes root application directory or directories when
         passing multiple rootdir to
         applications database.

         Note that default root directory for
         applications is always added. In current version
         /usr/share/afm/applications is used as default.
        
    -m
    --mode (local|remote)
    
         Set the default launch mode.
         The default value is 'local'
    
    -d
    --daemon
    
         Daemonizes the process. It is not needed by sytemd.
    
    -q
    --quiet
    
         Reduces the verbosity (can be repeated).
    
    -v
    --verbose
    
         Increases the verbosity (can be repeated).
    
    -h
    --help
    
         Prints a short help.
    

Launcher Configuration 
-----------------------------

It contains rules for launching applications.
When **afm-user-daemon** has to launch an application,
it looks for launch mode (local or remote), as well as
for the type of application describe in ***config.xml***
widget configuration file.

This tuple mode+type allows to select the adequate rule.

Configuration file is **/etc/afm/afm-launch.conf**.

It contains sections and rules. It can also contain comments
and empty lines to improve readability.

The separators are space and tabulation, any other character
should have a meaning.

The format is line oriented.
The new line character separate the lines.

Lines having only separators are blank lines and ignored.
Line having character #(sharp) at first position are comment
lines and ignored.

Lines not starting with a separator are different
from lines starting with a separator character.

The grammar of the configuration file is defined below:

    CONF: *COMMENT *SECTION
    
    SECTION: MODE *RULE
    
    RULE: +TYPE VECTOR ?VECTOR
    
    MODE: 'mode' +SEP ('local' | 'remote') *SEP EOL
    
    TYPE: DATA *SEP EOL
    
    VECTOR: +SEP DATA *(+SEP NDATA) *SEP EOL
    
    DATA: CHAR *NCHAR
    NDATA: +NCHAR

    EOL: NL *COMMENT
    COMMENT: *SEP CMT *(SEP | NCHAR) NL

    NL: '\x0a'
    SEP: '\x20' | '\x09'
    CMT: '#'
    CHAR: '\x00'..'\x08' | '\x0b'..'\x1f' | '\x21' | '\x22' | '\x24'..'\xff'
    NCHAR: CMT | CHAR
    
Here is a sample of configuration file for defining how
to launch an application of types *application/x-executable*,
*text/x-shellscript* and *text/html* in local mode:

    mode local
    
    application/x-executable
    text/x-shellscript
        %r/%c
    
    text/html
        /usr/bin/afb-daemon --mode=local --readyfd=%R --alias=/icons:%I --port=%P --rootdir=%r --token=%S --sessiondir=%D/.afb-daemon
        /usr/bin/web-runtime http://localhost:%P/%c?token=%S

This shows that:

 - within a section, several rules can be defined
 - within a rule, several types can be defined
 - within a rule, one or two vectors can be defined
 - vectors are using %substitution
 - launched binaries must be defined with their full path

### mode local

Within this mode, the launchers have either one or two description vectors.
All of those vectors are treated as programs
and are executed with 'execve' system call.

The first vector is the leader vector and it defines the process
group. The second vector (if any) is attached to the group
defined by this first vector.

### mode remote

Within this mode, the launchers have either one or two vectors
describing them.

The first vector is process as a program and is executed with
system call 'execve'.

The second vector (if any) defines a text that is returned
to the caller. This mechanism can be used to return a uri
for remote UI to connect on the newly launched application.

The daemon ***afm-user-daemon*** allocates a port for each
new remote application.
The current implementation port allocation is incremental.
A smarter (cacheable and discoverable) allocation should be defined.

### %substitutions

Vectors can include sequences of 2 characters that have a special
meaning. These sequences are named *%substitution* because their
first character is the percent sign (%) and because each occurrence
of the sequence is replaced, at launch time, by the value associated
to sequences.

Here is the list of *%substitutions*:

 - ***%%***: %.

   This simply emits the percent sign %

 - ***%a***: appid

   Holds application Id of launched application.

   Defined by the attribute **id** of the element **<widget>**
   of **config.xml**.

 - ***%b***: bindings

   In the future should represent the list of bindings and bindings directory separated by ','.
   Warning: not supported in current version.

 - ***%c***: content

   The file within the widget directory that is the entry point.

   For HTML applications, it represents the relative path to main
   page (aka index.html).

   Defined by attribute **src** of the element **<content>** within **config.xml**.

 - ***%D***: datadir

   Path of the directory where the application runs (cwd)
   and stores its data.

   It is equal to %h/%a.

 - ***%H***: height

   Requested height for the widget.

   Defined by the attribute **height** of the element **<widget>**
   of **config.xml**.

 - ***%h***: homedir

   Path of the home directory for all applications.

   It is generally equal to $HOME/app-data

 - ***%I***: icondir

   Path of the directory were the icons of the applications can be found.

 - ***%m***: mime-type

   Mime type of the launched application.

   Defined by the attribute **type** of the element **<content>**
   of **config.xml**.

 - ***%n***: name

   Name of the application as defined by the content of the
   element **<name>** of **config.xml**.

 - ***%P***: port

   A port to use. It is currently a kind of random port. The precise
   model is to be defined later.

 - ***%R***: readyfd

   Number of file descriptor to use for signaling
   readiness of launched process.

 - ***%r***: rootdir

   Path of directory containing the widget and its data.

 - ***%S***: secret

   An hexadecimal number that can be used to initialize pairing of client
   and application binder.

 - ***%W***: width

   Requested width for the widget.

   Defined by the attribute **width** of the element **<widget>**
   of **config.xml**.


The D-Bus interface
-------------------

### Overview of the dbus interface

***afm-user-daemon*** takes its orders from the session instance
of D-Bus. D-Bus is nice to use in this context because it allows
discovery and signaling.

The dbus session is by default addressed by environment
variable ***DBUS_SESSION_BUS_ADDRESS***. Using **systemd** 
variable *DBUS_SESSION_BUS_ADDRESS* is automatically set for
user sessions.

The **afm-user-daemon** is listening on destination name
***org.AGL.afm.user*** at object path ***/org/AGL/afm/user***
on interface ***org.AGL.afm.user*** for following members:
 ***runnables***, ***detail***, ***start***, ***terminate***,
***stop***, ***continue***, ***runners***, ***state***,
***install*** and ***uninstall***.

D-Bus is mainly used for signaling and discovery. Its optimized
typed protocol is not used except for transmission of standalone strings.

Clients and Services are using JSON serialisation to exchange data. 

The D-Bus interface is defined by:

 * DESTINATION: **org.AGL.afm.user**

 * PATH: **/org/AGL/afm/user**

 * INTERFACE: **org.AGL.afm.user**

The signature of any member of the interface is ***string -> string***
for ***JSON -> JSON***.

This is the normal case. In case of error, the current implementation
returns a dbus error as a string.

Here an example using *dbus-send* to query data on
installed applications.

    dbus-send --session --print-reply \
        --dest=org.AGL.afm.user \
        /org/AGL/afm/user \
        org.AGL.afm.user.runnables string:true

### Using ***afm-util***

The command line tool ***afm-util*** uses dbus-send to send
orders to **afm-user-daemon**. This small scripts allows to
send command to ***afm-user-daemon*** either interactively
at shell prompt or scriptically.

The syntax is simple: it accept a command and when requires attached arguments.

Here is the summary of ***afm-util***:

 - **afm-util runnables      **:

   list the runnable widgets installed

 - **afm-util install    wgt **:

   install the wgt file

 - **afm-util uninstall  id  **:

   remove the installed widget of id

 - **afm-util detail     id  **:

   print detail about the installed widget of id

 - **afm-util runners        **:

   list the running instance

 - **afm-util start      id  **:

   start an instance of the widget of id

 - **afm-util terminate  rid **:

   terminate the running instance rid

 - **afm-util stop       rid **:

   stop the running instance rid

 - **afm-util continue   rid **:

   continue the previously rid

 - **afm-util state      rid **:

   get status of the running instance rid


Here is how to list applications using ***afm-util***:

    afm-util runnables

---

### The protocol over D-Bus

Recall:

 * **DESTINATION**: org.AGL.afm.user

 * **PATH**: /org/AGL/afm/user

 * **INTERFACE**: org.AGL.afm.user

---

#### Method org.AGL.afm.user.detail

**Description**: Get details about an application from its id.

**Input**: the id of the application as below.

Either just a string:

    "appli@x.y"

Or an object having the field "id" of type string:

    {"id":"appli@x.y"}

**Output**: A JSON object describing the application containing
the fields described below.

    {
      "id":          string, the application id (id@version)
      "version":     string, the version of the application
      "width":       integer, requested width of the application
      "height":      integer, resqueted height of the application
      "name":        string, the name of the application
      "description": string, the description of the application
      "shortname":   string, the short name of the application
      "author":      string, the author of the application
    }

---

#### Method org.AGL.afm.user.runnables

**Description**: Get the list of applications that can be run.

**Input**: any valid json entry, can be anything except null.

**output**: An array of description of the runnable applications.
Each item of the array contains an object containing the detail of
an application as described above for the method
*org.AGL.afm.user.detail*.

---

#### Method org.AGL.afm.user.install

**Description**: Install an application from its widget file.

If an application of the same *id* and *version* exists, it is not
reinstalled except when *force=true*.

Applications are installed in the subdirectories of the common directory
reserved for applications.
If *root* is specified, the application is installed under
sub-directories of defined *root*.

Note that this methods is a simple accessor to the method
***org.AGL.afm.system.install*** of ***afm-system-daemon***.

After the installation and before returning to the sender,
***afm-user-daemon*** sends the signal ***org.AGL.afm.user.changed***.

**Input**: The *path* of widget file to be installed. Optionally,
a flag to *force* reinstallation and/or a *root* directory.

Simple form a simple string containing the absolute widget path:

    "/a/path/driving/to/the/widget"

Or an object:

    {
      "wgt": "/a/path/to/the/widget",
      "force": false,
      "root": "/a/path/to/the/root"
    }

"wgt" and "root" MUST be absolute paths.

**output**: An object containing field "added" to use as application ID.

    {"added":"appli@x.y"}

---

#### Method org.AGL.afm.user.uninstall

**Description**: Uninstall an application from its id.


Note that this methods is a simple accessor to
***org.AGL.afm.system.uninstall*** method from ***afm-system-daemon***.

After the uninstallation and before returning to the sender,
***afm-user-daemon*** sends the signal ***org.AGL.afm.user.changed***.

**Input**: the *id* of the application and, optionally, the path to
application *root*.

Either a string:

    "appli@x.y"

Or an object:

    {
      "id": "appli@x.y",
      "root": "/a/path/to/the/root"
    }

**output**: the value 'true'.

---

#### Method org.AGL.afm.user.start

**Description**:

**Input**: the *id* of the application and, optionally, the
start *mode* as below.

Either just a string:

    "appli@x.y"

Or an object containing field "id" of type string and
optionally a field mode:

    {"id":"appli@x.y","mode":"local"}

The field "mode" is a string equal to either "local" or "remote".

**output**: The *runid* of the application launched. *runid* is an integer.

---

#### Method org.AGL.afm.user.terminate

**Description**: Terminates the application attached to *runid*.

**Input**: The *runid* (an integer) of running instance to terminate.

**output**: the value 'true'.

---

#### Method org.AGL.afm.user.stop

**Description**: Stops the application attached to *runid* until terminate or continue.

**Input**: The *runid* (integer) of the running instance to stop.

**output**: the value 'true'.

---

#### Method org.AGL.afm.user.continue

**Description**: Continues the application attached to *runid* previously stopped.

**Input**: The *runid* (integer) of the running instance to continue.

**output**: the value 'true'.

---

#### Method org.AGL.afm.user.state

**Description**: Get informations about a running instance of *runid*.

**Input**: The *runid* (integer) of the running instance inspected.

**output**: An object describing instance state. It contains:
the runid (integer), the id of the running application (string),
the state of the application (string either: "starting", "running", "stopped").

Example of returned state:

    {
      "runid": 2,
      "state": "running",
      "id": "appli@x.y"
    }

---

#### Method org.AGL.afm.user.runners

**Description**: Get the list of currently running instances.

**Input**: anything.

**output**: An array of states, one per running instance, as returned by
the methodd ***org.AGL.afm.user.state***.

