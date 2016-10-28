# Building the AGL Demo Platform for Raspberry Pi

## Raspberry Pi 3

To build AGL demo platform for Raspberry Pi 3 use machine **raspberrypi3** and feature **agl-demo**:

```
source meta-agl/scripts/aglsetup.sh -m raspberrypi3 agl-demo agl-netboot agl-appfw-smack
bitbake agl-demo-platform
```

## Raspberry Pi 2

To build AGL demo platform for Raspberry Pi 2 use machine **raspberrypi2** and feature **agl-demo**:

```
source meta-agl/scripts/aglsetup.sh -m raspberrypi2 agl-demo agl-netboot agl-appfw-smack
bitbake agl-demo-platform
```
