# AGL Message Signaling

## Architecture

This [document](./architecture.md) presents an architecture for message signaling in AGL.

Also available as a [PDF Document](http://iot.bzh/download/public/2016/signaling/AGL-Message-Signaling-Architecture.pdf)

## Documentation

Developer Guidelines are available as a [PDF Document](http://iot.bzh/download/public/2016/signaling/AGL-Message-Signaling-Developer-Guidelines.pdf) 

A GPS Binding example is available on Github: [github:iotbzh/af-gps-binding](https://github.com/iotbzh/af-gps-binding)

## OpenXC Demo

A reference HTML5 application has been developed: see [github:iotbzh/txc-demo](https://github.com/iotbzh/txc-demo).

This application uses a [OpenXC trace file](http://openxcplatform.com/resources/traces.html) to display 4 different panels representing live vehicle data.

It's available as an [AGL Application package](http://iot.bzh/download/public/2016/afb-demos/txc-demo_0.1.wgt) installable through AGL Application Framework.

## Low level CAN service

A project to access and decode CAN bus has been developed and part of AGL since Daring Dab version: [Low level CAN service](https://gerrit.automotivelinux.org/gerrit/#/admin/projects/apps/low-level-can-service)

This rewrite of OpenXC to adapt the project to AGL.

Must be used in conjunction with the [low level CAN generator](https://gerrit.automotivelinux.org/gerrit/#/admin/projects/src/low-level-can-generator) to custom your service.

## High Level ViWi service

An implementation of [ViWi](https://www.w3.org/Submission/2016/SUBM-viwi-protocol-20161213/) protocol has been made and available : [github.com:iotbzh/high-level-viwi-service](https://github.com/iotbzh/high-level-viwi-service)

## Benchmarks

Some tests to evaluate the performances of the framework have been done by simulating CAN Data: [AGL-AppFW-CAN-Signaling-Benchmark.pdf](http://iot.bzh/download/public/2016/signaling/AGL-AppFW-CAN-Signaling-Benchmark.pdf)

## AMM Munich'16 Presentation

[Jose's presentation at AGL AMM Munich'16](http://iot.bzh/download/public/2016/build-agl-application-AMM-Munich-2016/)

## AMM Tokyo'17 Presentation

[Kusakabe-san from Fujitsu-Ten presentation at AGL AMM Tokyo'17](http://schd.ws/hosted_files/aglmmwinter2017/37/20170201_AGL-AMM_F10_kusakabe.pdf)

## F2F Karslruhe'17 Presentation

[Romain's presentation at AGL F2F Karslruhe'17](http://iot.bzh/download/public/2017/F2F-Karslruhe/AGL-Signaling.pdf)
[Kusakabe-san from Fujitsu-Ten presentation at AGL F2F Karslruhe'17](https://wiki.automotivelinux.org/_media/agl-distro/20170402_ften_can_kusakabe_v2.pdf)
