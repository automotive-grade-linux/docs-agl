# Building the AGL Demo Platform for Renesas Porter

* Download Renesas [graphics drivers with a "click through" license from Renesas website](https://www.renesas.com/en-eu/solutions/automotive/rcar-demoboard.html) in directory ~/Downloads (or $XDG_DOWNLOAD_DIR).

* To build AGL demo platform for Renesas Porter board use machine **porter** and feature **agl-demo**:

```
source meta-agl/scripts/aglsetup.sh -m porter agl-demo agl-netboot agl-appfw-smack
bitbake agl-demo-platform
```
