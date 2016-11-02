# AGL Application Framework

This page summarizes all materials related to AGL Application Framework

## Source Code

The current code of AGL App-Framework is stored on AGL Code Repository. It's divided in the following projects:

* [src/app-framework-main](https://gerrit.automotivelinux.org/gerrit/gitweb?p=src%2Fapp-framework-main.git;a=summary) Main services
* [src/app-framework-binder](https://gerrit.automotivelinux.org/gerrit/gitweb?p=src%2Fapp-framework-binder.git;a=summary): Binder Daemon
* [src/app-framework-demo](https://gerrit.automotivelinux.org/gerrit/gitweb?p=src%2Fapp-framework-demo.git;a=summary) Demos

## Building AGL with Application Framework support

The Application Framework can be added easily to an AGL build using the feature 'agl-appfw-smack'.

Typically, the following command can be called to initialize AGL build:

    # meta-agl/scripts/aglsetup.sh -m porter agl-appfw-smack agl-demo agl-devel
    ...
    # bitbake agl-demo-platform

## Documentation

Technical documentation is maintained in the source code and should be browsable with the [upcoming AGL documentation system](https://github.com/automotive-grade-linux/docs-agl)

Temporarily, a static documentation has been made in PDF format:

* [Introduction to Application Framework](http://iot.bzh/download/public/2016/appfw/01_Introduction-to-AppFW-for-AGL-1.0.pdf)
* [AppFW Core Documentation](http://iot.bzh/download/public/2016/appfw/02_Documentation-AppFW-Core-2.0.pdf)
* [Privileges Management](http://iot.bzh/download/public/2016/appfw/03-AGL-AppFW-Privileges-Management.pdf)

Some extra guides are also available in PDF format:

* [Build your 1st AGL Application](http://iot.bzh/download/public/2016/sdk/AGL-Devkit-Build-your-1st-AGL-Application.pdf)
* Applications Templates are available on [github:iotbzh/app-framework-templates](https://github.com/iotbzh/app-framework-templates)

### Bindings Examples

Some bindings are  available to quickstart new projects:

* GPS - see [github:iotbzh/af-gps-binding](https://github.com/iotbzh/af-gps-binding/blob/master/src/af-gps-binding.c)
* OpenXC Reader - see [github:iotbzh/txc-demo](https://github.com/iotbzh/txc-demo/blob/master/binding/txc-binding.c)
* CPU/Memory stats - see [github:iotbzh/txc-demo](https://github.com/iotbzh/txc-demo/blob/master/binding/stat-binding.c)
* Radio - see [gerrit:src/app-framework-binder](https://gerrit.automotivelinux.org/gerrit/gitweb?p=src/app-framework-binder.git;a=tree;f=bindings/radio;hb=master)
* Audio - see [gerrit:src/app-framework-binder](https://gerrit.automotivelinux.org/gerrit/gitweb?p=src/app-framework-binder.git;a=tree;f=bindings/audio;hb=master)

The list is not exhaustive. ***Please add other bindings here !***


### Demos

* Simple HTML5 Demos apps (ported from Tizen) on [github:iotbzh/afm-widget-examples](https://github.com/iotbzh/afm-widget-examples)
* Installable package with [TXC Demo Application](http://iot.bzh/download/public/2016/afb-demos/txc-demo_0.1.wgt)
* Applications available in [gerrit:app-framework-demo](https://gerrit.automotivelinux.org/gerrit/gitweb?p=src/app-framework-demo.git;a=summary)

## Presentations

* Oct 16 - [Application Security Model - Status Update](http://iot.bzh/download/public/2016/genivi/CyberSecurity-Genivi-Q42016-Fulup-IoTbzh.pdf)
* Sept 16 - [Building Applications with AGL Framework](http://iot.bzh/download/public/2016/genivi/CyberSecurity-Genivi-Q42016-Fulup-IoTbzh.pdf) - Also visible in [PDF version](http://iot.bzh/download/public/2016/publications/build-agl-application-AMM-Munich-2016.pdf)
* Feb 16 - [HTML5 Apps for Automotive Systems](http://iot.bzh/download/public/2016/publications/HTML5_Applications_for_Automotive_Systems.pdf)
* Feb 16 - [Application & Security Framework Proposal AGL 2.0](http://iot.bzh/download/public/2016/security/Security-Proposal-AGL20-Fulup.pdf)
* Jan 16 - [Security Architecture Proposal](http://iot.bzh/download/public/2016/security/Security-Architecture-AGL20.pdf)

## History

### Motivation for rewriting the App. Framework

To get the background and motivation on why Application Framework has been rewritten:

* [Tizen Security: lessons learnt](http://iot.bzh/download/public/2015/tizen-security-lessons-learnt-initial.pdf)
* [this discussion](https://lists.linuxfoundation.org/pipermail/automotive-discussions/2016-October/002749.html)
* [Linux Automotive Security](http://iot.bzh/download/public/2016/security/Linux-Automotive-Security-v10.pdf)


### Comparison/Relationship with Tizen



                              Tizen           AGL
                              ----------------------------------
    App/OS isolation           yes            yes
    Container option           no             possible
    Native App                 partial*       yes
    HTML5 App                  yes            yes
    Cloud App                  No             yes
    Unified API (HTLM/Native)  No             yes
    service as App**           No             yes
    Adding API    ***          core           core or App
    Devel model                bespoke        Standard Web


