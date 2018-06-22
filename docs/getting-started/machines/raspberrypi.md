# Building the AGL Demo Platform for Raspberry Pi

## Raspberry Pi 3

To build AGL demo platform for Raspberry Pi 3 use machine **raspberrypi3** and feature **agl-demo**:

```bash
source meta-agl/scripts/aglsetup.sh -m raspberrypi3 agl-demo agl-netboot agl-appfw-smack
bitbake agl-demo-platform
```

## Raspberry Pi 2

To build AGL demo platform for Raspberry Pi 2 use machine **raspberrypi2** and feature **agl-demo**:

```bash
source meta-agl/scripts/aglsetup.sh -m raspberrypi2 agl-demo agl-netboot agl-appfw-smack
bitbake agl-demo-platform
```

## Booting AGL Demo Platform on Raspberry Pi

Follow the steps below to copy the image to microSD card and to boot it on Raspberry Pi 2 or 3:

* Connect your sdcard in your linux machine.
* Copy output image from build machine to linux machine that is connected your sdcard. (Often, those are same machines)
* Output Image location in build machine for Raspberry Pi 2: *tmp/deploy/images/raspberrypi2/agl-demo-platform-raspberrypi2.wic.xz*
* Output Image location in build machine for Raspberry Pi 3: *tmp/deploy/images/raspberrypi3/agl-demo-platform-raspberrypi3.wic.xz*
* Unmount the microSD card and after that flash output image to it card with root user:

*Note: the sdimage files can also be named rpi-sdimg-ota in case you have the **"agl-sota"** feature enabled*

```bash
sudo umount [sdcard device]
xzcat [output image] | sudo dd of=[sdcard device] bs=4M
sync
```

* Plug your microSD card into Raspberry Pi 2 or 3 and boot the board
