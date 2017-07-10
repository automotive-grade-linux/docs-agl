# Renesas Porter Hardware setup

Here is a non exhaustive list of hardware parts that could be used to setup the Porter board development environment:

* Porter board with its power supply
* mini USB-A cable for serial console
* USB 2.0 Hub
* USB keyboard
* USB mouse
* Ethernet cable
* HDMI type A (full size HDMI) cable and associated display
* micro-SD Card (at least 4GB)
* USB touch screen device like the GeChic 1502i

For more information and latest news, please check [Here][R-car Porter]:

The following documents may also be helpful:

* Porter Hardware Manual [Link][Porter HardwareManual]
* Porter (Rev B) Setup Manual [Link][PORTER SetupManual]

## Building the AGL Demo Platform for Renesas Porter

Before set up Build Environment you need to setup the proprietary drivers.

* Download Renesas graphics drivers with a "click through" license from Renesas website [Link][rcar demoboard]

under the Target hardware: R-Car H2, M2 and E2 section.

**Note**:

* that you have to register with a free account on MyRenesas and accept the license condition before downloading them.
 The operation is fast and simple but nevertheless mandatory to access evaluation of non open-source drivers for free.
 Once you registered, you can download two zip files.
* The files must be store into directory ~/Downloads (or $XDG_DOWNLOAD_DIR).

Here after is an example of their names:

```bash
chmod a+r $XDG_DOWNLOAD_DIR/*.zip
ls -l $XDG_DOWNLOAD_DIR
total 8220
-rw-r--r-- 1 1000 1000 6047383 Jul 11 11:03 R-Car_Series_Evaluation_Software_Package_for_Linux-20151228.zip
-rw-r--r-- 1 1000 1000 2394750 Jul 11 11:03 R-Car_Series_Evaluation_Software_Package_of_Linux_Drivers-20151228.zip
```

## Set up Build Environment

* To build AGL demo platform for Renesas Porter board use machine **porter** and feature **agl-demo**:

```bash
cd $AGL_TOP
source meta-agl/scripts/aglsetup.sh -m porter -b build agl-devel agl-demo agl-netboot agl-appfw-smack
```

**Note**:

* **IMPORTANT** read the log to be sure to have any error during your setup.

In case the graphical drivers were not found, you could notice an error message as follow:

```bash
[snip]
--- fragment /ssd/agl2016-for-kickstart-update/meta-agl/templates/machine/porter/50_setup.sh
/ssd/agl2016-for-kickstart-update /ssd/agl2016-for-kickstart-update/build
The graphics and multimedia acceleration packages for the R-Car M2 Porter board can be download from :
  <http://www.renesas.com/secret/r_car_download/rcar_demoboard.jsp>

These 2 files from there should be store in your'/home/users/Downloads' directory.
  R-Car_Series_Evaluation_Software_Package_for_Linux-20151228.zip
  R-Car_Series_Evaluation_Software_Package_of_Linux_Drivers-20151228.zip
Copying gfx drivers and multimedia packages for 'porter' failed.
ERROR: Script /ssd/agl2016-for-kickstart-update/build/conf/setup.sh failed
OK
Generating setup file: /ssd/agl2016-for-kickstart-update/build/agl-init-build-env ... OK
------------ aglsetup.sh: Done
[snip]
```

* If you encounters this issue, or any other unwanted behavior, you can fix the error mentioned and then clean up by removing the “$AGL_TOP/build” directory then launch the procedure again.
* After this command, the working directory is changed to $AGL_TOP/build.
* Users may want to check that the board is correctly selected in the environment:

```bash
grep -w -e "^MACHINE =" $AGL_TOP/build/conf/local.conf
    MACHINE = "porter"
```

Configure for Release or Development:  
Development images require extra tools for developer convenience, in particular:

* a debugger (gdb)
* some tweaks, including a disabled root password
* a SFTP server
* the TCF Agent for easier application deployment and remote debugging
* ...

We explicitely activate these Debug facilities by specifying the “agl-devel agl-netboot” feature.

### Build your image

The process to build an image is simple:

```bash
bitbake agl-demo-platform
```

Once done, what may take up to few hours, you should get the end result in the directory:

```bash
$AGL_TOP/build/tmp/deploy/images/porter.
```

**Note**:

* In case of failure of the build it is safe to first check that the Linux distribution chosen for your host has been validated for version 2.0 of Yocto.

## Booting AGL Demo Platform on Renesas Porter using a micro-SD card

**Note**:

Porter boards have 2 SD slots:

* one for SD cards
* another one for micro-SD cards.

At the time of writing, we didn't succeed to boot a board using the SD slot with the current kernel (3.10):

* Only the micro-SD slot was usable.

To boot the board using a micro-SD card, there are two operations that should be done prior to first initial boot:

* Create a SD-card with one ext3 partition,
* Set up the board to boot on the SD-card.

Then for each build, the SD-card is merely rewritten and used to boot the configured board.

## Deployment

### Format the SD-card on the host

* Plug microSD card and get its associated device by either running *dmesg | tail -15* or *lsblk*, for example:

```bash
dmesg | tail -15

  [ 1971.462160] sd 6:0:0:0: [sdc] Mode Sense: 03 00 00 00
  [ 1971.462277] sd 6:0:0:0: [sdc] No Caching mode page found
  [ 1971.462278] sd 6:0:0:0: [sdc] Assuming drive cache: write through
  [ 1971.463870]  sdc: sdc1 sdc2
```

Here, the SD-card is attached to the device sdc.

```bash
lsblk

  NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
  sda      8:0    0 167,7G  0 disk
  ├─sda1   8:1    0   512M  0 part /boot/efi
  ├─sda2   8:2    0 159,3G  0 part /
  └─sda3   8:3    0   7,9G  0 part [SWAP]
  sdb      8:16   0 931,5G  0 disk
  └─sdb1   8:17   0 931,5G  0 part /media/storage
  sdc      8:32   1  14,9G  0 disk
  ├─sdc1   8:33   1    40M  0 part
  └─sdc2   8:34   1   788M  0 part
```

**Note**:

* **WARNING** This is a critical operation, each computer is different and device can change during time, so do this operation each time you incert the microSD card.
* In the **example** above, we see the first SATA drive as 'sda'.
* In the **example** above, 'sdc' corresponds to the microSD card.*

### Format the SD-card

Create EXT3 partition on the SD-card using fdisk and set the MBR.

* For **example**, if the microSD card is */dev/sdc*:

```bash
sudo fdisk /dev/sdc

  Welcome to fdisk (util-linux 2.27.1).
  Changes will remain in memory only, until you decide to write them.
  Be careful before using the write command.


  Command (m for help): o
  Created a new DOS disklabel with disk identifier 0x96e5850d.

  Command (m for help): n
  Partition type
     p   primary (0 primary, 0 extended, 4 free)
     e   extended (container for logical partitions)
  Select (default p):

  Using default response p.
  Partition number (1-4, default 1):
  First sector (2048-31291391, default 2048):
  Last sector, +sectors or +size{K,M,G,T,P} (2048-31291391, default 31291391):

  Created a new partition 1 of type 'Linux' and of size 14,9 GiB.

  Command (m for help): w
  The partition table has been altered.
  Calling ioctl() to re-read partition table.
  Syncing disks.
```

Initialize the ext3 partition using “mke2fs”:

* for **example** if the microSD card is associated with *sdc*:

```bash
sudo mke2fs -t ext3 /dev/sdc1

  mke2fs 1.42.13 (17-May-2015)
  Creating filesystem with 3911168 4k blocks and 979200 inodes
  Filesystem UUID: 690804b9-6c7d-4bbb-b1c1-e9357efabc52
  Superblock backups stored on blocks:
      32768, 98304, 163840, 229376, 294912, 819200, 884736, 1605632, 2654208

  Allocating group tables: done
  Writing inode tables: done
  Creating journal (32768 blocks): done
  Writing superblocks and filesystem accounting information: done
```

### Copying the built image to the SD-card

Insert the SD-card into your build host:

* Your desktop system may probably offer a choice to mount the SD-card automatically in some directory.
* In the next sample code, we'll suppose that the SD-card mount directory is stored in the variable $SDCARD.
* For example **example** the microSD card is associated with device *sdc*:

```bash
export SDCARD=/tmp/agl
mkdir -p $SDCARD
sudo mount /dev/sdc1 $SDCARD
```

Go to your build directory:

```bash
cd $AGL_TOP/build/tmp/deploy/images/porter
```

Make sure the filesystem is empty:

```bash
sudo rm -rf ${SDCARD:-bad_dir}/*
```

*** IMPORTANT ***
Verify that **tar** version is 1.28 or newer:

```bash
tar --version
tar (GNU tar) 1.28
[snip]
```

If your distribution is up to date on this dependency, you can use the host tool directly. Let's define a variable for the following steps:

```bash
TAR=$(which tar)
```

Otherwise, a native up-to-date version of tar is also generated while building AGL distribution:

```bash
TAR=$AGL_TOP/build/tmp/sysroots/x86_64-linux/usr/bin/tar-native/tar
$TAR --version
tar (GNU tar) 1.28
[snip]
```

Copy Automotive Grade Linux (AGL) files onto the mircoSD card by extracting the root file system archive:

```bash
sudo $TAR --extract --numeric-owner --preserve-permissions --preserve-order --totals \
           --xattrs-include='*' --directory=$SDCARD --file=agl-demo-platform-porter.tar.bz2
```

Copy Kernel Image and Device Tree Blob file into the **boot** directory:

```bash
sudo cp uImage+dtb /tmp/agl/boot/
```

Ensure the changes have been written to the disk:

```bash
sync
```

 Unmount the micrSD card:

```bash
sudo umount $SDCARD
```

### Booting the board

Turn the board off using the power switch.
Insert the microSD-card into the appropriate slot.
Verify that you have plugged in, at least, the following:

* External monitor on HDMI port
* Input device (keyboard, mouse, touchscreen...) on USB port.

Turn the board on using the power switch.
After a few seconds, you'll see the AGL splash screen on the display and you'll be able to log in on the console terminal (login is 'root', no password):

```bash
Automotive Grade Linux 2.0.0 porter ttySC6

porter login:
```

### To access the shell (serial)

Install a serial client on your computer.
This can be “screen”, “picocom”, “minicom”.
The lighter of the 3 is “picocom” (it has less dependencies).
Plug a USB cable from your computer to the serial CP2102 USB port of the porter board (near the power switch and fan connector).
With “dmesg” you can check the device created for the serial link.
To get it, you must switch the board on.
For example:

```bash
dmesg | tail
  [609575.767056] usb 2-1.6.4: new full-speed USB device number 21 using ehci-pci
  [609575.854083] usb 2-1.6.4: New USB device found, idVendor=10c4, idProduct=ea60
  [609575.854089] usb 2-1.6.4: New USB device strings: Mfr=1, Product=2, SerialNumber=3
  [609575.854100] usb 2-1.6.4: Product: CP2102 USB to UART Bridge Controller
  [609575.854102] usb 2-1.6.4: Manufacturer: Silicon Labs
  [609575.854104] usb 2-1.6.4: SerialNumber: 0001
  [609575.990209] usbcore: registered new interface driver usbserial
  [609575.990221] usbcore: registered new interface driver usbserial_generic
  [609575.990229] usbserial: USB Serial support registered for generic
  [609575.995184] usbcore: registered new interface driver cp210x
  [609575.995198] usbserial: USB Serial support registered for cp210x
  [609575.995239] cp210x 2-1.6.4:1.0: cp210x converter detected
  [609576.068184] usb 2-1.6.4: reset full-speed USB device number 21 using ehci-pci
  [609576.154125] usb 2-1.6.4: cp210x converter now attached to ttyUSB0
```

The link is attached to the device /dev/ttyUSB0.
It is time to launch your serial client.
Example:

```bash
picocom -b 38400 /dev/ttyUSB0
```

or

```bash
minicom -b 38400 -D /dev/ttyUSB0
```

or

```bash
screen /dev/ttyUSB0 38400
```

Power on the Porter board to see a shell on the console

```bash
KOELSCH SPI_LOADER(DDR3L_1333) V0.16a 2014.10.03
 DEVICE S25FL512


U-Boot 2013.01.01-gb653737-dirty (Mar 26 2015 - 14:37:46)

CPU: Renesas Electronics R8A7791 rev 2.0
Board: Porter Board

DRAM:  1 GiB
MMC:   sh-sdhi: 0, sh-sdhi: 1
SF: Detected S25FL512S with page size 256 KiB, total 64 MiB
In:    serial
Out:   serial
Err:   serial
Net:   sh_eth
Hit any key to stop autoboot:  0
=>
```

### U-Boot configurations

Follow the steps below to configure boot from microSD card and to set screen resolution:

* Power up the board and, using your preferred terminal emulator.
* Type a character to abort the boot and enter the U-boot menu.
* Type **print** to check the environment:

```bash
print
```

* Verify that the ethaddr environment variable is set to the same MAC address value shown on the label on top of the RJ45 Ethernet connector.
* If not please set it using the following command:

```bash
setenv ethaddr <MAC address>
```

For example:

```bash
setenv ethaddr 2e:09:0a:00:75:b5
```

* Set the follow environment variables:

```bash
setenv bootargs_console 'console=ttySC6,38400 ignore_loglevel'
setenv bootargs_video 'vmalloc=384M video=HDMI-A-1:1920x1080-32@60'
setenv bootargs_root 'root=/dev/mmcblk0p1 rootdelay=3 ro rootfstype=ext4 rootwait'
setenv bootmmc '1:1'
setenv bootcmd_sd 'ext4load mmc ${bootmmc} 0x40007fc0 boot/uImage+dtb'
setenv bootcmd 'setenv bootargs ${bootargs_console} ${bootargs_video} ${bootargs_root}; run bootcmd_sd; bootm 0x40007fc0'
```

**WARNINGS:**

* If no display shows up when booting, e.g. for a non-full HD screen, replace  **1920x1080** value in the **bootargs_video** variable with lower screen resolution such as **1024x768**.   Unfortunately for the moment there are no universally supported setting.

* Depending on your board (Porter rev B or rev C, Koelsch etc.), the SD card slots may differ.

Try setting **bootmmc** to **0:1** or **2:1** depending on the slot and card format.

For Renesas Porter Rev 1.0 use screen resolution **1024x768** and set **bootmmc** to **2:1**.

* Save the environment variables:

```bash
saveenv
  Saving Environment to SPI Flash...
  SF: Detected S25FL512S with page size 256 KiB, total 64 MiB
  Erasing SPI flash...Writing to SPI flash...done
```

* Reboot:

```bash
reset
```

### Writing a “hello world” application

Yocto project provides a good reference on its complete solution for developers:

* ADT: The Application Development Toolkit is the complete solution;
* the cross-toolchain is a simple build environment.

Reading [adt-manual][yocto adt-manual] is a good starting point.
A Docker image with prebuilt AGL SDK is also made available by [IoT.bzh][Iot.bzh link].
Check the following document for more information [Link][iot.bzh SDK Kickstart on Renesas Porter board]:

Here, for a quick demo we will build the cross-toolchain and write a sample application.
First, let's create the build toolchain:

```bash
cd $AGL_TOP
source poky/oe-init-build-env
bitbake meta-ide-support
```

The small following “hello world” example:

```bash
cat hello.c
#include <stdio.h>
int main() { printf(“Hello world\n”); return 0; }
```

… can now be compiled and executed this way:

```bash
. $AGL_TOP/build/tmp/environment-setup-*
$CC -o hello hello.c
scp hello root@porterboard:/
ssh root@porterboard /hello
```

where 'porterboard' is replaced by the IP address or the hostname of your Porter board.

### Running CES 2016 Demos

The CES demos are located in /opt/AGL/CES2016 (on the microSD-Card).
To run the demo, execute the following commands on the target (from a weston terminal or from the serial console)

```bash
cd /opt/AGL/CES2016
export LD_PRELOAD=/usr/lib/libEGL.so
```

For the main demo, run:

```bash
/usr/bin/qt5/qmlscene -–fullscreen -I imports Main.qml
```

To start the demo using IVI Shell, run the appropriate scripts located in /opt/AGL/CES2016:

```bash
./switch_to_ivi-shell.sh
./start_CES2016_ivi-shell.sh
```

This will restart Weston with IVI Shell enabled and launch the demo.
With the above commands, the demo application has still some decorations.
They can be dropped by adding '--fullscreen' in the script. Use the following command once to modify the script.

```bash
sed -i 's/Main.qml/--fullscreen Main.qml/' start_CES2016_ivi-shell.sh
```

Then restart the demo:

```bash
killall qmlscene
./start_CES2016_ivi-shell.sh
```

#### IMPORTANT

Please note that the current image uses Evaluation drivers:

* as a consequence, the graphics and multimedia acceleration provided by these drivers will stop after 3 hours. When this happens, simply reboot the board and restart the demo.

For more information, you can check the embedded README:

```bash
cat /opt/AGL/CES2016/README.md
Open source QML UI

To run on target:
$ cd /opt/AGL/CES2016
$ /usr/bin/qt5/qmlscene -I imports Main.qml

For development it can be nice to use Scaled.qml instead so it fits your screen.



© 2015 Jaguar Land Rover. All Rights Reserved.
Licensed under Creative Commons Attribution 4.0 International
https://creativecommons.org/licenses/by/4.0/legalcode

(Optional) switch shell for weston to ivi-shell and start demo apps if you want to start demo apps with ivi-shell.
$ cd /opt/AGL/CES2016
$ ./switch_to_ivi-shell
(Option a) $ ./start_CES2016_ivi-shell.sh
(Option b) $ ./start_CES2016_with_navi_ivi-shell.sh

Option a: start QML UI only.
Option b: start QML + CarNavigation:/home/navi. For the time being, CarNavigation expects to be Wayland native application, which will be showed on top of QML by using LayerManagerControl.
```

### More Documentation

More documents, provide by [Iot.bzh][Iot.bzh link], are available to guide developers with AGL and Renesas boards:

* [AGL-Devkit-Image-and-SDK-for-porter.pdf][iot.bzh AGL-Devkit-Image-and-SDK-for-porter]

Detailed guide on how to build AGL for Renesas boards and using AGL SDK inside a ready-to-use Docker container.

* [AGL-Devkit-Build-your-1st-AGL-Application.pdf][Iot.bzh AGL-Devkit-Build-your-1st-AGL-Application]

Generic guide on how to build various application types (HTML5, native, Qt, QML, …) for AGL.

* [AGL-Devkit-HowTo_bake_a_service.pdf][Iot.bzh AGL_Phase2-Devkit-HowTo_bake_a_service]

Generic guide on how to add a new service in the BSP.

[R-car Porter]: http://elinux.org/R-Car/Boards/Porter
[Porter HardwareManual]: http://elinux.org/images/8/83/Porter_HardwareManual_02242015.pdf
[PORTER SetupManual]: http://elinux.org/images/1/11/PORTER_B_SetupManual_rev0.01.pdf
[rcar demoboard]: https://www.renesas.com/en-eu/solutions/automotive/rcar-demoboard.html
[Iot.bzh link]: http://iot.bzh/
[iot.bzh SDK Kickstart on Renesas Porter board]: http://iot.bzh/download/public/2016/sdk/AGL-Application-SDK-Kickstart-on-Renesas-Porter-board.pdf
[yocto adt-manual]: http://www.yoctoproject.org/docs/2.0/adt-manual/adt-manual.html
[iot.bzh AGL-Devkit-Image-and-SDK-for-porter]: http://iot.bzh/download/public/2016/sdk/AGL-Devkit-Image-and-SDK-for-porter.pdf
[Iot.bzh AGL-Devkit-Build-your-1st-AGL-Application]: http://iot.bzh/download/public/2016/sdk/AGL-Devkit-Build-your-1st-AGL-Application.pdf
[Iot.bzh AGL_Phase2-Devkit-HowTo_bake_a_service]: http://iot.bzh/download/public/2016/bsp/AGL_Phase2-Devkit-HowTo_bake_a_service.pdf
