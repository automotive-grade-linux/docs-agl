# AGL Kickstart on Renesas R-Car Starter Kit Gen3 (h3ulcb, m3ulcb)

Here is a non exhaustive list of hardware parts that could be used to setup the R-Car Starter Kit Gen3 board development environment:

* Starter Kit Gen3 board with its power supply
* micro USB-A cable for serial console
* USB 2.0 Hub
* Ethernet cable
* HDMI type D (Micro connector) cable and associated display
* micro-SD Card (at least 4GB)
* USB touch screen device like the GeChic 1502i (optional)

For more information and latest news, please check :

* [elinux page for h3ulcb][R-car h3ulcb]
* [elinux page for m3ulcb][R-car m3ulcb]

The following documents may also be helpful:

* [Yocto-Gen3 on elinux][R-car yocto]

# Building the AGL Demo Platform for R-Car Starter Kit Gen3

Before setting up the build environment, you need to download the proprietary drivers.

* Download Renesas graphics drivers with a "click through" license from Renesas website [Link][rcar demoboard]
    * Under the Target hardware: **R-Car H3/M3** section.

#### Note:

* You have to register with a free account on MyRenesas and accept the license conditions before downloading them the drivers.  
The operation is fast and simple but nevertheless mandatory to access evaluation of non open-source drivers for free.  
Once you registered, you can download two zip files.
* The files must be stored into your download directory (usually $HOME/Downloads, pointed by $XDG_DOWNLOAD_DIR).
Here after is an example of the typical files downloaded at the time of writing:

```
chmod a+r $XDG_DOWNLOAD_DIR/*.zip
ls -l $XDG_DOWNLOAD_DIR
total 8220
-rw-r--r-- 1 XXX XXX    4619114 14 sept. 05:02 R-Car_Gen3_Series_Evaluation_Software_Package_for_Linux-20160906.tar.gz
-rw-r--r-- 1 XXX XXX    4619796 10 oct.  23:23 R-Car_Gen3_Series_Evaluation_Software_Package_for_Linux-20160906.zip
```

## Setting up the build environment:

Define the type of R-Car Starter Kit board as a variable:

* for machine **h3ulcb** (Starter Kit Premier/H3) :

    ```
export MACHINE=h3ulcb
    ```

* for machine **m3ulcb** (Starter Kit Pro/M3):

    ```
export MACHINE=m3ulcb
    ```


Now, init your build environment:

```
cd $AGL_TOP
source meta-agl/scripts/aglsetup.sh -m $MACHINE -b build agl-devel agl-demo agl-netboot agl-appfw-smack
```

**IMPORTANT NOTE**: Read the log to be sure you had no error during your setup. 
In case of missing graphics drivers, you could notice an error message as follow:

```
[snip]
--- fragment /home/working/workspace_agl_master/meta-agl/templates/machine/h3ulcb/50_setup.sh
/home/working/workspace_agl_master /home/working/workspace_agl_master/build_gen3
The graphics and multimedia acceleration packages for the R-Car Gen3 board can be download from :
  <http://www.renesas.com/secret/r_car_download/rcar_demoboard.jsp>

These 2 files from there should be store in your'/home/ronan/Téléchargements' directory.
  R-Car_Gen3_Series_Evaluation_Software_Package_for_Linux-20160906.zip
  R-Car_Gen3_Series_Evaluation_Software_Package_of_Linux_Drivers-20160906.zip
/home/working/workspace_agl_master/build_gen3
--- fragment /home/working/workspace_agl_master/meta-agl/templates/base/99_setup_EULAconf.sh
--- end of setup script
OK
Generating setup file: /home/working/workspace_agl_master/build_gen3/agl-init-build-env ... OK
------------ aglsetup.sh: Done
[snip]
```

If you encounter this issue, or any other unwanted behavior, you can fix the error mentioned and then clean up by removing the “$AGL_TOP/build” directory then re-launch the procedure again.

After this command, the working directory is changed to $AGL_TOP/build.

Users may want to check that the board is correctly selected in the environment:

```
grep -w -e "^MACHINE =" $AGL_TOP/build/conf/local.conf
  MACHINE = "h3ulcb"
or
  MACHINE = "m3ulcb"
```

Configure for Release or Development:  
* development images contain extra tools for developer convenience, in particular:
    * a debugger (gdb)
    * some tweaks, including a disabled root password
    * a SFTP server
    * the TCF Agent for easier application deployment and remote debugging
    * some extra system tools (usb, bluetooth ...)
    * ...  

We explicitely activate these debug facilities by specifying the “agl-devel agl-netboot” feature.

## Build your image:

The process to build an image is simple:

```
bitbake agl-demo-platform
```

When finished (it may take few hours), you should get the final result:

```
ls -l $AGL_TOP/build/tmp/deploy/images/$MACHINE
```

#### Note
In case of failure of the build it is safe to first check that the Linux distribution chosen for your host has been validated for version 2.1 of Yocto.

# Booting AGL Image on R-Car Starter Kit Gen3 boards using a microSD card

To boot the board using a micro-SD card, there are two operations that should be done prior to first initial boot:

* Create a SD-card with one ext4 partition,
* Set up the board to boot on the SD-card.

Then, for each build, the SD-card is merely rewritten and used to boot the configured board.

## Prepare the SD-card on the host

Plug the microSD card and get its associated device by either running *`dmesg | tail -15`* or *`lsblk`*, for example:

```
dmesg | tail -15

  [ 1971.462160] sd 6:0:0:0: [sdc] Mode Sense: 03 00 00 00
  [ 1971.462277] sd 6:0:0:0: [sdc] No Caching mode page found
  [ 1971.462278] sd 6:0:0:0: [sdc] Assuming drive cache: write through
  [ 1971.463870]  sdc: sdc1 sdc2
```

Here, the SD-card is attached to the device /dev/sdc.

```
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

**IMPORTANT NOTE**: This is a critical operation, each computer is different and removable devices can change from time to time: so you should repeat this operation each time you insert the microSD card to confirm the device name.

In the example above, we see:
* the first SATA drive as 'sda'.
* 'sdc' corresponds to the microSD card, and is also marked as removable device by *lsblk* which is a good confirmation.

### Partition and format the SD-card

* Create an EXT4 partition on the SD-card using fdisk and set the MBR.  
For example, if the microSD card is */dev/sdc*:

```
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

* Initialize the ext4 partition using “mke2fs”; for example, if the microSD card is associated with *sdc*:

```
sudo mke2fs -t ext4 /dev/sdc1

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

* Your desktop system probably offers a choice to mount the SD-card automatically in some directory.
* In the next sample code, we'll suppose that the SD-card mount directory is stored in the variable $SDCARD.
* For example, if the microSD card is associated with device *sdc*:

```
export SDCARD=/tmp/agl
mkdir -p $SDCARD
sudo mount /dev/sdc1 $SDCARD
```

Go to your build directory:

```
cd $AGL_TOP/build/tmp/deploy/images/$MACHINE
```

Make sure the filesystem is empty:

```
sudo rm -rf ${SDCARD:-bad_dir}/*
```

**IMPORTANT NOTE**: Verify that **tar** version is 1.28 or newer: this is required to create extended attributes correctly on the SD-card, and in particular SMACK labels used to enforce security. Check with the following command:

```
tar --version
tar (GNU tar) 1.28
[snip]
```

If your distribution is up to date on this dependency, you can use the host tool directly.  
Let's define a variable for the following steps:
```
TAR=$(which tar)
```
Otherwise, a native up-to-date version of tar is also generated while building AGL distribution:
```
TAR=$AGL_TOP/build/tmp/sysroots/x86_64-linux/usr/bin/tar-native/tar
$TAR --version
tar (GNU tar) 1.28
[snip]
```
Copy Automotive Grade Linux (AGL) files onto the mircoSD card by extracting the root file system archive:

```
sudo $TAR --extract --numeric-owner --preserve-permissions --preserve-order --totals \
           --xattrs-include='*' --directory=$SDCARD --file=agl-demo-platform-h3ulcb.tar.bz2
```

Copy Kernel Image and Device Tree Blob file into the **boot** directory:
* For machine h3ulcb:
```
sudo cp Image-r8a7795-h3ulcb.dtb $SDCARD/boot/
```

* For machine m3ulcb:
```
sudo cp Image-r8a7796-m3ulcb.dtb $SDCARD/boot/
```

Ensure the changes have been written to the disk:

```
sync
```

Unmount the microSD card:

```
sudo umount $SDCARD
```

## Booting the board

* Turn the board off using the power switch.  
* Insert the microSD-card.  
* Verify that you have plugged in, at least, the following:
    * External monitor on HDMI port
    * Input device (keyboard, mouse, touchscreen...) on USB port.

* Turn the board on using the power switch.  
After a few seconds, you'll see the AGL splash screen on the display and you'll be able to log in on the console terminal or in the graphic screen.  

# Serial Console Setup

## Install a serial client on your computer.  

This can be “screen”, “picocom”, “minicom”.  
The lighter of the 3 is “picocom” (it has less dependencies).  

## Plug a USB cable from your computer to the serial CP2102 USB port (micro USB-A).

With “dmesg” you can check the device created for the serial link. Usually, it's /dev/ttyUSB0 but the number may vary depending on other USB serial ports connected to the host. To get it, you must switch the board on.  
For example:

```
dmesg | tail
[2097783.287091] usb 2-1.5.3: new full-speed USB device number 24 using ehci-pci
[2097783.385857] usb 2-1.5.3: New USB device found, idVendor=0403, idProduct=6001
[2097783.385862] usb 2-1.5.3: New USB device strings: Mfr=1, Product=2, SerialNumber=3
[2097783.385864] usb 2-1.5.3: Product: FT232R USB UART
[2097783.385866] usb 2-1.5.3: Manufacturer: FTDI
[2097783.385867] usb 2-1.5.3: SerialNumber: AK04WWCE
[2097783.388288] ftdi_sio 2-1.5.3:1.0: FTDI USB Serial Device converter detected
[2097783.388330] usb 2-1.5.3: Detected FT232RL
[2097783.388658] usb 2-1.5.3: FTDI USB Serial Device converter now attached to ttyUSB0
```

The link is attached to the device /dev/ttyUSB0.  
It is time to launch your serial client.  
Example:

```
picocom -b 115200 /dev/ttyUSB0
```

or

```
minicom -b 115200 -D /dev/ttyUSB0
```

or

```
screen /dev/ttyUSB0 115200
```

## Power on the board to see a shell on the console

* For machine h3ulcb:  

```
NOTICE:  BL2: R-Car Gen3 Initial Program Loader(CA57) Rev.1.0.7
NOTICE:  BL2: PRR is R-Car H3 ES1.1
NOTICE:  BL2: LCM state is CM
NOTICE:  BL2: DDR1600(rev.0.15)
NOTICE:  BL2: DRAM Split is 4ch
NOTICE:  BL2: QoS is Gfx Oriented(rev.0.30)
NOTICE:  BL2: AVS setting succeeded. DVFS_SetVID=0x52
NOTICE:  BL2: Lossy Decomp areas
NOTICE:       Entry 0: DCMPAREACRAx:0x80000540 DCMPAREACRBx:0x570
NOTICE:       Entry 1: DCMPAREACRAx:0x40000000 DCMPAREACRBx:0x0
NOTICE:       Entry 2: DCMPAREACRAx:0x20000000 DCMPAREACRBx:0x0
NOTICE:  BL2: v1.1(release):41099f4
NOTICE:  BL2: Built : 19:20:52, Jun  9 2016
NOTICE:  BL2: Normal boot
NOTICE:  BL2: dst=0xe63150c8 src=0x8180000 len=36(0x24)
NOTICE:  BL2: dst=0x43f00000 src=0x8180400 len=3072(0xc00)
NOTICE:  BL2: dst=0x44000000 src=0x81c0000 len=65536(0x10000)
NOTICE:  BL2: dst=0x44100000 src=0x8200000 len=524288(0x80000)
NOTICE:  BL2: dst=0x49000000 src=0x8640000 len=1048576(0x100000)


U-Boot 2015.04 (Jun 09 2016 - 19:21:52)

CPU: Renesas Electronics R8A7795 rev 1.1
Board: H3ULCB
I2C:   ready
DRAM:  3.9 GiB
MMC:   sh-sdhi: 0, sh-sdhi: 1
In:    serial
Out:   serial
Err:   serial
Net:   Board Net Initialization Failed
No ethernet found.
Hit any key to stop autoboot:  0
=>
```

* For machine m3ulcb:

```
NOTICE:  BL2: R-Car Gen3 Initial Program Loader(CA57) Rev.1.0.8
NOTICE:  BL2: PRR is R-Car M3 ES1.0
NOTICE:  BL2: LCM state is CM
NOTICE:  BL2: DDR1600(rev.0.15)
NOTICE:  BL2: DRAM Split is 2ch
NOTICE:  BL2: QoS is default setting(rev.0.14)
NOTICE:  BL2: AVS setting succeeded. DVFS_SetVID=0x52
NOTICE:  BL2: Lossy Decomp areas
NOTICE:       Entry 0: DCMPAREACRAx:0x80000540 DCMPAREACRBx:0x570
NOTICE:       Entry 1: DCMPAREACRAx:0x40000000 DCMPAREACRBx:0x0
NOTICE:       Entry 2: DCMPAREACRAx:0x20000000 DCMPAREACRBx:0x0
NOTICE:  BL2: v1.1(release):41099f4
NOTICE:  BL2: Built : 09:24:53, Nov 24 2016
NOTICE:  BL2: Normal boot
NOTICE:  BL2: dst=0xe630f068 src=0x8180000 len=36(0x24)
NOTICE:  BL2: dst=0x43f00000 src=0x8180400 len=3072(0xc00)
NOTICE:  BL2: dst=0x44000000 src=0x81c0000 len=65536(0x10000)
NOTICE:  BL2: dst=0x44100000 src=0x8200000 len=524288(0x80000)
NOTICE:  BL2: dst=0x49000000 src=0x8640000 len=1048576(0x100000)


U-Boot 2015.04 (Nov 30 2016 - 18:25:18)

CPU: Renesas Electronics R8A7796 rev 1.0
Board: M3ULCB
I2C:   ready
DRAM:  1.9 GiB
MMC:   sh-sdhi: 0, sh-sdhi: 1
In:    serial
Out:   serial
Err:   serial
Net:   Board Net Initialization Failed
No ethernet found.
Hit any key to stop autoboot:  0
=>
```

## Configure U-boot parameters

Follow the steps below to configure the boot from microSD card and to set screen resolution:

* Turn the board on using the power switch.
* Hit any key to stop autoboot (warning you have only few seconds).
* Type **print** to check if you have correct parameters for booting your board:
    * For machine m3ulcb:

    ```
=> print
	baudrate=115200
	bootargs=console=ttySC0,115200 root=/dev/mmcblk1p1 rootwait rw rootfstype=ext4
	bootcmd=run load_ker; run load_dtb; booti 0x48080000 - 0x48000000
	bootdelay=3
	fdt_high=0xffffffffffffffff
	initrd_high=0xffffffffffffffff
	load_dtb=ext4load mmc 0:1 0x48000000 /boot/Image-r8a7795-h3ulcb.dtb
	load_ker=ext4load mmc 0:1 0x48080000 /boot/Image
	stderr=serial
	stdin=serial
	stdout=serial
	ver=U-Boot 2015.04 (Jun 09 2016 - 19:21:52)

	Environment size: 648/131068 bytes
    ```

    * For machine h3ulcb:
    
    ```
=> printenv
	baudrate=115200
	bootargs=console=ttySC0,115200 root=/dev/mmcblk1p1 rootwait rw rootfstype=ext4
	bootcmd=run load_ker; run load_dtb; booti 0x48080000 - 0x48000000
	bootdelay=3
	fdt_high=0xffffffffffffffff
	filesize=cdeb
	initrd_high=0xffffffffffffffff
	load_dtb=ext4load mmc 0:1 0x48000000 /boot/Image-r8a7796-m3ulcb.dtb
	load_ker=ext4load mmc 0:1 0x48080000 /boot/Image
	stderr=serial
	stdin=serial
	stdout=serial
	ver=U-Boot 2015.04 (Nov 30 2016 - 18:25:18)

	Environment size: 557/131068 bytes
    ```

    * If not, copy line by line:
    
    ```
setenv bootargs console=ttySC0,115200 root=/dev/mmcblk1p1 rootwait rw rootfstype=ext4
setenv bootcmd run load_ker\; run load_dtb\; booti 0x48080000 - 0x48000000
setenv load_ker ext4load mmc 0:1 0x48080000 /boot/Image
    ```
    
    * For machine h3ulcb:
    
    ```
setenv load_dtb ext4load mmc 0:1 0x48000000 /boot/Image-r8a7795-h3ulcb.dtb
    ```
    
    * For machine m3ulcb:
    
    ```
setenv load_dtb ext4load mmc 0:1 0x48000000 /boot/Image-r8a7796-m3ulcb.dtb
    ```
    
    * Finally save boot environment:
    
    ```
saveenv
    ```

* Now you can boot:

```
run bootcmd
```

## Console boot

After booting, you should see the wayland display on the external monitor and a login prompt on the console, such as:

* For machine h3ulcb:

```
Automotive Grade Linux 3.0.0+snapshot-20161201 h3ulcb ttySC0

h3ulcb login: root
```

* For machine m3ulcb:

```
Automotive Grade Linux 3.0.0+snapshot-20161201 m3ulcb ttySC0

m3ulcb login: root
```

Logging in on the console is easy:
* login is 'root'
* password is empty (not asked)

## Network access

If the board is connected to a local network using ethernet and if a DHCP server is able to distribute IP addresses, 
you can then determine the Gen3 board IP address and log in using ssh:

```
m3ulcb login: root
Last login: Tue Dec  6 09:55:15 UTC 2016 on tty2
root@m3ulcb:~# ip -4 a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default 
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
3: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    inet 10.0.0.27/24 brd 10.0.0.255 scope global eth0
       valid_lft forever preferred_lft forever
root@m3ulcb:~# 
```

Here, IP address is 10.0.0.27. Logging in using SSH is easy:

```
$ ssh root@10.0.0.27
Last login: Tue Dec  6 10:01:11 2016 from 10.0.0.13
root@m3ulcb:~# cat /etc/os-release 
ID="poky-agl"
NAME="Automotive Grade Linux"
VERSION="3.0.0+snapshot-20161202 (chinook)"
VERSION_ID="3.0.0-snapshot-20161202"
PRETTY_NAME="Automotive Grade Linux 3.0.0+snapshot-20161202 (chinook)"
```

# More Documentation

Detailed guides on how to build AGL for Renesas boards and using AGL SDK inside a ready-to-use Docker container:

* [AGL-Devkit-Build-your-1st-AGL-Application.pdf][Iot.bzh AGL-Devkit-Build-your-1st-AGL-Application]
Generic guide on how to build various application types (HTML5, native, Qt, QML, …) for AGL.
* [AGL-Devkit-HowTo_bake_a_service.pdf][Iot.bzh AGL_Phase2-Devkit-HowTo_bake_a_service]
Generic guide on how to add a new service in the BSP.
* [AGL-Kickstart-on-Renesas-Porter-Board.pdf][Iot.bzh AGL-Kickstart-on-Renesas-Porter-Board]
* [AGL-Devkit-Image-and-SDK-for-Porter.pdf][Iot.bzh AGL-Devkit-Image-and-SDK-for-Porter]
* [AGL Developer Website](http://docs.automotivelinux.org)

[R-car m3ulcb]: http://elinux.org/R-Car/Boards/M3SK
[R-car h3ulcb]: http://elinux.org/R-Car/Boards/H3SK
[R-car yocto]: http://elinux.org/R-Car/Boards/Yocto-Gen3
[rcar demoboard]: https://www.renesas.com/en-eu/solutions/automotive/rcar-demoboard.html
[Iot.bzh AGL-Kickstart-on-Renesas-Porter-Board]: http://docs.automotivelinux.org/docs/devguides/en/dev/reference/iotbzh2016/sdk/AGL-Kickstart-on-Renesas-Porter-board.pdf
[Iot.bzh AGL-Devkit-Image-and-SDK-for-Porter]: http://docs.automotivelinux.org/docs/devguides/en/dev/reference/iotbzh2016/sdk/AGL-Devkit-Image-and-SDK-for-porter.pdf
[Iot.bzh AGL-Devkit-Build-your-1st-AGL-Application]: http://docs.automotivelinux.org/docs/devguides/en/dev/reference/iotbzh2016/sdk/AGL-Devkit-Build-your-1st-AGL-Application.pdf
[Iot.bzh AGL_Phase2-Devkit-HowTo_bake_a_service]: http://docs.automotivelinux.org/docs/devguides/en/dev/reference/iotbzh2016/bsp/AGL_Phase2-Devkit-HowTo_bake_a_service.pdf
