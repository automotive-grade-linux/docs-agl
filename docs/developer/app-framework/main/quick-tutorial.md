
AGL Application Framework: A Quick Tutorial
===========================================

Introduction
------------
This document proposes a quick tutorial to demonstrate the major functionnalities of the AGL Application Framework. For more complete information, please refer to the inline documentation available in the main git repository: 
https://gerrit.automotivelinux.org/gerrit/#/admin/projects/src/app-framework-main
https://gerrit.automotivelinux.org/gerrit/#/admin/projects/src/app-framework-binder

For more information on AGL, please visit:
https://www.automotivelinux.org/

----------

Sample applications
-------------------
4 sample applications (.wgt files) are prebuilt and available at the following address:
https://github.com/iotbzh/afm-widget-examples

You can get them by cloning this git repository on your desktop (will be useful later in this tutorial):

```
$ git clone https://github.com/iotbzh/afm-widget-examples
```

Using the CLI tool
------------------

### Setup Environment
Connect your AGL target board to the network and copy some sample widgets on it through SSH (set BOARDIP with your board IP address) :
```
$ cd afm-widget-examples
$ BOARDIP=1.2.3.4
$ scp *.wgt root@$BOARDIP:~/
```

Connect through SSH on the target board and check for Application Framework daemons:

    $ ssh root@$BOARDIP
    root@porter:~# ps -ef|grep bin/afm
    afm        409     1  0 13:00 ?        00:00:00 /usr/bin/afm-system-daemon
    root       505   499  0 13:01 ?        00:00:00 /usr/bin/afm-user-daemon
    root       596   550  0 13:22 pts/0    00:00:00 grep afm

We can see that there are two daemons running:
* **afm-system-daemon** runs with a system user 'afm' and is responsible for installing/uninstalling packages
* **afm-user-daemon** runs as a user daemon (currently as root because it's the only real user on the target board) and is responsible for the whole lifecycle of the applications running inside the user session.

The application framework has a tool running on the Command Line Interface (CLI). Using the **afm-util** command, you can install, uninstall, list, run, stop ... applications. 

To begin, run '**afm-util help**' to get a quick help on commands:

    root@porter:~# afm-util help
    usage: afm-util command [arg]
    
    The commands are:
    
      list
      runnables      list the runnable widgets installed
    
      add wgt
      install wgt    install the wgt file
    
      remove id
      uninstall id   remove the installed widget of id
    
      info id
      detail id      print detail about the installed widget of id
    
      ps
      runners        list the running instance
    
      run id
      start id       start an instance of the widget of id
    
      kill rid
      terminate rid       terminate the running instance rid
    
      stop rid
      pause rid      stop the running instance rid
    
      resume rid
      continue rid   continue the previously rid
    
      status rid
      state rid     get status of the running instance rid

### Install an application

You can then install your first application:

    root@porter:~# afm-util install /home/root/annex.wgt 
    { "added": "webapps-annex@0.0" }

Let's install a second application:

    root@porter:~# afm-util install /home/root/memory-match.wgt 
    { "added": "webapps-memory-match@1.1" }

Note that usually, **afm-util** will return a **JSON result**, which is the common format for messages returned by the Application Framework daemons.

### List installed applications
You can then list all installed applications:

    root@porter:~# afm-util list
    [ { "id": "webapps-annex@0.0", "version": "0.0.10", "width": 0, "height": 0, "name": "Annex", "description": "Reversi\/Othello", "shortname": "", "author": "Todd Brandt <todd.e.brandt@intel.com>" },
     { "id": "webapps-memory-match@1.1", "version": "1.1.7", "width": 0, "height": 0, "name": "MemoryMatch", "description": "Memory match", "shortname": "", "author": "Todd Brandt <todd.e.brandt@intel.com>" } ]

Here, we can see the two previously installed applications.

### Get information about an application
Let's get some details about the first application:

    root@porter:~# afm-util info webapps-annex@0.0
    { "id": "webapps-annex@0.0", "version": "0.0.10", "width": 0, "height": 0, "name": "Annex", "description": "Reversi\/Othello", "shortname": "", "author": "Todd Brandt <todd.e.brandt@intel.com>" }

Note that AGL applications are mostly handled by afm-util through their IDs. In our example, the application ID is 'webapps-annex@0.0'.

### Start application
Let's start the first application Annex:

    root@porter:~# afm-util start webapps-annex@0.0
    1

As the application is a HTML5 game, you should then get a webview running with QML on the board display.

### Security Context
The application has been started in the user session, with a dedicated security context, enforced by SMACK. To illustrate this, we can take a look at the running processes and their respective SMACK labels:

    root@porter:~# ps -efZ |grep webapps-annex | grep -v grep
    User::App::webapps-annex        root       716   491  0 13:19 ?        00:00:00 /usr/bin/afb-daemon --mode=local --readyfd=8 --alias=/icons /usr/share/afm/icons --port=12348 --rootdir=/usr/share/afm/applications/webapps-annex/0.0 --token=7D6D2F16 --sessiondir=/home/root/app-data/webapps-annex/.afb-daemon
    User::App::webapps-annex        root       717   491  0 13:19 ?        00:00:00 /usr/bin/qt5/qmlscene http://localhost:12348/index.html?token=7D6D2F16 /usr/bin/web-runtime-webkit.qml

In the previous result, we see that the application is composed of two processes:
* the application binder (afb-daemon)
* the application UI (qmlscene ...)

While most system processes run with the label 'System', we see that the application runs with a specific SMACK label 'User::App::webapps-annex': this label is used to force the application to follow a Mandatory Access Control (MAC) scheme. This means that those processes run in their own security context, isolated from the rest of the system (and other applications). Global security rules can then be applied to restrict access to all other user or system resources.

### Check running applications
To check for running applications, just run:

    root@porter:~# afm-util ps
    [ { "runid": 1, "state": "running", "id": "webapps-annex@0.0" } ]

The 'runid' is the application instance ID and is used as an argument for the subcommands controlling the application runtime state (kill/stop/resume/status)

### Stop application
To stop the application that was just started (the one with RUNID 1), just run the stop command:

    root@porter:~# afm-util terminate 1
    true
    
The application is now stopped, as confirmed by a list of running apps:

    root@porter:~# afm-util ps
    [ ]


### Uninstall application
To uninstall an application, simply use its ID:

    root@porter:~# afm-util uninstall webapps-annex@0.0
    true

Then list the installed apps to confirm the removal:

    root@porter:~# afm-util list
    [ { "id": "webapps-memory-match@1.1", "version": "1.1.7", "width": 0, "height": 0, "name": "MemoryMatch", "description": "Memory match", "shortname": "", "author": "Todd Brandt <todd.e.brandt@intel.com>" } ]

afm-client: a sample HTML5 'Homescreen'
---------------------------------------

**afm-client** is a HTML5 UI that allows to install/uninstall applications as well as starting/stopping them as already demonstrated with afm-util.

The HTML5 UI is accessible remotely through this URL: 
http://[board_ip]:1234/opa?token=132456789

### Installing an application

By clicking on the '**Upload**' button on the right, you can send an application package (WGT file) and install it. Select for example the file '**rabbit.wgt**' that was cloned initially from the git repository afm-widget-examples.

Then a popup requester ask for a confirmation: 'Upload Application rabbit.wgt ?'. Click on the '**Install**' button.

You should then see some changes in the toolbar: a new icon appeared, representing the freshly installed application.

### Running an application
In the toolbar, click on the button representing the Rabbit application. You'll get a popup asking to:
* start the application
* or get some info about it
* or uninstall it

Click on the 'start' item: the application starts and should be visible as a webview on the target board display. Note that at this point, we could also run the application remotely, that is in the same browser as the Homescreen app. By default, the application framework is configured to run applications 'locally' on the board display.

### Stopping an application

In the Homescreen application, click again on the Rabbit application button, then select 'stop': the application then stops.

### Uninstalling an application

From the same popup menu, you can select 'uninstall' to remove the application from the system. As a consequence, the application icon should disappear from the toolbar.

afb-client: a template for Angular Applications
-----------------------------------------------

Another package '**afb-client**' is also available for testing.
This is a sample HTML5 application demonstrating various basic capabilities of the Binder daemon. It can be used by developers as a template to start writing real AGL Applications.

This application is not available as WGT file yet and it should be started manually without any specific security context:

    root@porter:~# /usr/bin/afb-daemon --mode=remote --port=1235 --token='' --sessiondir=/home/root/.afm-daemon --rootdir=/usr/share/agl/afb-client --alias=/icons:/usr/share/afm/icons

Then you can access it from a browser:
http://[board_ip]:1235/opa/?token=132456789

afb-client is a simple application to demonstrate the built-in capabilities of the binder daemon (handling sessions and security tokens, testing POSTs uploads...) and was used during the application framework development to validate the proposed features.
