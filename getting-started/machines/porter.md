# Building the AGL Demo Platform for Renesas Porter

* Download Renesas [graphics drivers with a "click through" license from Renesas website](https://www.renesas.com/en-eu/solutions/automotive/rcar-demoboard.html) in directory ~/Downloads (or $XDG_DOWNLOAD_DIR).

* To build AGL demo platform for Renesas Porter board use machine **porter** and feature **agl-demo**:

```
source meta-agl/scripts/aglsetup.sh -m porter agl-demo agl-netboot agl-appfw-smack
bitbake agl-demo-platform
```

# Booting AGL Demo Platform on Renesas Porter

## Deployment

### On the host

* Plug microSD card and get its associated device by either running *dmesg | tail -15* or *lsblk*, for example:

```
dmesg | tail -15
[ 1971.462160] sd 6:0:0:0: [sdc] Mode Sense: 03 00 00 00
[ 1971.462277] sd 6:0:0:0: [sdc] No Caching mode page found
[ 1971.462278] sd 6:0:0:0: [sdc] Assuming drive cache: write through
[ 1971.463870]  sdc: sdc1 sdc2
```

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
*Note: In the **examples** above, 'sdc' corresponds to the microSD card.*

* Create EXT3 partition on the SD-card using fdisk or another application. For **example**, if the microSD card is */dev/sdc*:

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
* Initialize the ext3 partition using “mke2fs”, for **example** if the microSD card is associated with *sdc*:

```
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

* Mount the microSD card partition, for example **example** if the microSD card is associated with *sdc*:

```
mkdir /tmp/agl
sudo mount /dev/sdc1 /tmp/agl/
```

*Note: Please replace /dev/sdc with the actual path for your microSD card.*

* Go to your build directory:

```
cd $BUILDDIR/tmp/deploy/images/porter
```

* Make sure the filesystem is empty:

```
sudo rm -rf /tmp/agl/*
```

* Verify that **tar** version is 1.28 or newer:

```
tar --version
tar (GNU tar) 1.28
Copyright (C) 2014 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Written by John Gilmore and Jay Fenlason.
```

* Copy Automotive Grade Linux (AGL) files onto the mircoSD card by extracting the root file system archive:

```
sudo tar --extract --numeric-owner --preserve-permissions --preserve-order --totals \
           --directory=/tmp/agl --file=agl-demo-platform-porter.tar.bz2
```

* Copy Kernel Image and Device Tree Blob file into the **boot** directory:

```
sudo cp uImage+dtb /tmp/agl/boot/
```

* Ensure the changes have been written to the disk:

```
sync
```

* Unmount the micrSD card:

```
sudo umount /tmp/agl
```

* Plug the microSD card in Renesas Porter board.

### To access the shell (serial)

* With the Porter board powered off, connect the 'Debug Serial 0' port on the board (for Porter mini-USB port close to on/off switch) with the host PC using the USB cable.
* Use **screen** to access the serial debug console (may needs to *apt-get install screen*):

```
sudo screen /dev/ttyUSB0 38400
```

*Note: Alternatively, start a terminal emulator, such as 'minicom' or 'picocom', on the host, connecting to the USB serial port (/dev/ttyUSB0) with 38400, 8n1 settings.*

* Power on the Porter board to see a shell on the console

### On the target board

It is assumed that the Renesas Porter board already has u-boot running as second stage boot loader.

### U-Boot configurations

Follow the steps below to configure boot from microSD card and to set screen resolution:

* Power up the board and, using your preferred terminal emulator, stop the board's autoboot and type **print** to check the environment:

```
print
```

* Verify that the ethaddr environment variable is set to the same MAC address value shown on the label on top of the RJ45 Ethernet connector. If not please set it using the following command:

```
setenv ethaddr <MAC address>
```

For example:

```
setenv ethaddr 2e:09:0a:00:75:b5
```

* Set the follow environment variables:

```
setenv bootargs_console 'console=ttySC6,38400 ignore_loglevel'
setenv bootargs_video 'vmalloc=384M video=HDMI-A-1:1920x1080-32@60'
setenv bootargs_root 'root=/dev/mmcblk0p1 rootdelay=3 rw rootfstype=ext3 rootwait'
setenv bootmmc '1:1'
setenv bootcmd_sd 'ext4load mmc ${bootmmc} 0x40007fc0 boot/uImage+dtb'
setenv bootcmd 'setenv bootargs ${bootargs_console} ${bootargs_video} ${bootargs_root}; run bootcmd_sd; bootm 0x40007fc0'
```
**WARNINGS:**

If no display shows up when booting, e.g. for a non-full HD screen, replace  **1920x1080** value in the **bootargs_video** variable with lower screen resolution such as **1024x768**. Unfortunately for the moment there are no universally supported setting.

Depending on your board (Porter rev B or rev C, Koelsch etc.), the SD card slots may differ. Try setting **bootmmc** to **0:1** or **2:1** depending on the slot and card format.

For Renesas Porter Rev 1.0 use screen resolution **1024x768** and set **bootmmc** to **2:1**.

* Save the environment variables:

```
saveenv
```

* Reboot:

```
reset
```
