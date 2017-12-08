# System services and daemons

<!-- section-todo -->

Domain              | Improvement
------------------- | -----------
Platform-Services-1 | SystemD ?
Platform-Services-2 | Secure daemon ?

<!-- end-section-todo -->

## Tools

- **connman**: An internet connection manager designed to be slim and to use as
  few resources as possible. It is a fully modular system that can be extended,
  through plug-ins, to support all kinds of wired or wireless technologies.
- **bluez** is a Bluetooth stack. Its goal is to program an implementation of
  the Bluetooth wireless standards specifications. In addition to the basic stack,
  the `bluez-utils` and `bluez-firmware` packages contain low level utilities such
  as `dfutool` which can interrogate the Bluetooth adapter chipset in order to
  determine whether its firmware can be upgraded.
- **gstreamer** is a pipeline-based multimedia framework. It can be used to build
  a system that reads files in one format, processes them, and exports them in
  another format.
- **alsa** is a software framework and part of the Linux kernel that provides an
  **API** for sound card device drivers.

<!-- section-config -->

Domain               | `Tool` name | _State_
-------------------- | ----------- | -------
Platform-Utilities-1 | `connman`   | _Used_ as a connection manager.
Platform-Utilities-2 | `bluez`     | _Used_ as a Bluetooth manager.
Platform-Utilities-3 | `gstreamer` | _Used_ to manage multimedia file format.
Platform-Utilities-4 | `alsa`      | _Used_ to provides an API for sound card device drivers.

<!-- end-section-config -->
