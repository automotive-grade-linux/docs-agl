
Application framework
=====================

Foreword
--------

This document describes application framework fundamentals. 
FCF (Fully Conform to Specification) implementation is still under development.
It may happen that current implementation somehow diverges with specifications.

Overview
--------

The application framework on top of the security framework
provides components to install and uninstall applications
as well as to run them in a secured environment.

The goal of the framework is to manage applications and hide security details
to applications.

For the reasons explained in introduction, it was choose not to reuse Tizen
application framework directly, but to rework a new framework inspired from Tizen.

fundamentals remain identical: the applications are distributed
in a digitally signed container that should match widget specifications
normalized by the W3C. This is described by the technical
recommendations [widgets] and [widgets-digsig] of the W3 consortium.

As today this model allows the distribution of HTML, QML and binary applications
but it could be extended to any other class of applications.

The management of widget package signatures.
Current model is only an initial step, it might be extended in the
future to include new feature (ie: incremental delivery).


Comparison to other frameworks
------------------------------

### Tizen framework

### xdg-app

### ostro

organization of directory of applications
=========================================

The main path for applications are: APPDIR/PKGID/VER.

Where:

 - APPDIR is as defined above
 - PKGID is a directory whose name is the package identifier
 - VER is the version of the package MAJOR.MINOR

The advantage of such an organization is to allow several versions to live together.
This is required for multiple reasons (ie: roll back) and to comply with developers habits.

Identity of installed files
---------------------------

All the files are installed as user "userapp" and group "userapp".
All files have rw(x) for user and r-(x) for group and others.

This allows any user to read files.


labeling the directories of applications
-----------------------------------------


organization of data
====================

The data of a user are contain within its directory and are labeled using the application labels

Setting Smack rules for the application
=======================================

For Tizen, the following rules are set by the security manager for each application.

    System ~APP~             rwx
    System ~PKG~             rwxat
    System ~PKG~::RO         rwxat
    ~APP~  System            wx
    ~APP~  System::Shared    rxl
    ~APP~  System::Run       rwxat
    ~APP~  System::Log       rwxa
    ~APP~  _                 l
    User   ~APP~             rwx
    User   ~PKG~             rwxat
    User   ~PKG~::RO         rwxat
    ~APP~  User              wx
    ~APP~  User::Home        rxl
    ~APP~  User::App::Shared rwxat
    ~APP~  ~PKG~             rwxat
    ~APP~  ~PKG~::RO         rxl

Here, ~PKG~ is the identifier of the package and ~APP~ is the identifier of the application.

What user can run an application?
=================================

Not all user are able to run all applications.
How to manage that?


[meta-intel]:       https://github.com/01org/meta-intel-iot-security                "A collection of layers providing security technologies"
[widgets]:          http://www.w3.org/TR/widgets                                    "Packaged Web Apps"
[widgets-digsig]:   http://www.w3.org/TR/widgets-digsig                             "XML Digital Signatures for Widgets"
[libxml2]:          http://xmlsoft.org/html/index.html                              "libxml2"
[openssl]:          https://www.openssl.org                                         "OpenSSL"
[xmlsec]:           https://www.aleksey.com/xmlsec                                  "XMLSec"
[json-c]:           https://github.com/json-c/json-c                                "JSON-c"
[d-bus]:            http://www.freedesktop.org/wiki/Software/dbus                   "D-Bus"
[libzip]:           http://www.nih.at/libzip                                        "libzip"
[cmake]:            https://cmake.org                                               "CMake"
[security-manager]: https://wiki.tizen.org/wiki/Security/Tizen_3.X_Security_Manager "Security-Manager"
[app-manifest]:     http://www.w3.org/TR/appmanifest                                "Web App Manifest"
[tizen-security]:   https://wiki.tizen.org/wiki/Security                            "Tizen security home page"
[tizen-secu-3]:     https://wiki.tizen.org/wiki/Security/Tizen_3.X_Overview         "Tizen 3 security overview"


