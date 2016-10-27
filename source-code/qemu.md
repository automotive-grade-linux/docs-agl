# Building the AGL Demo Platform for QEMU

To build the QEMU version of the AGL demo platform use machine **qemux86-64** and feature **agl-demo**:

```
source meta-agl/scripts/aglsetup.sh -m qemux86-64 agl-demo agl-netboot agl-appfw-smack
bitbake agl-demo-platform
```
