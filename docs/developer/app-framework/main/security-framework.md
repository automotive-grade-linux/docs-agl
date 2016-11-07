
The security framework
======================

NOT STARTED !!!!!!

Setting Smack rules for the application
---------------------------------------

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
---------------------------------------

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




