## BIOS update

Both Joule and MinnowBoard-Max (not needed on Turbo) require a BIOS upgrade before running AGL on them.

**Do not loose any time trying without upgrading your BIOS first.**

For instructions on how to update the BIOS on those platforms, please refer to these documents:
* [MinnowBoard](https://firmware.intel.com/projects/minnowboard-max)
* [Intel Joule](https://software.intel.com/en-us/flashing-the-bios-on-joule)
* Intel MRB contact your technical support representative to get the non signed ABL firmware<br>
**Note** MRB users need to replace the mkefi-agl.sh script by mkabl-agl.sh

## Creating a bootable image

Multiple options are avaiable but `dd` and `tar` can very easily let you down due to the requirement to pass SMACK labels, create a proper UEFI configuration and a few other tricks.
The script [mkefi-agl.sh](https://gerrit.automotivelinux.org/gerrit/gitweb?p=AGL/meta-agl.git;a=blob_plain;f=scripts/mkefi-agl.sh;hb=HEAD) has been done to help you.
The option -h will print the help and the option -v will detail the operation and ease any debug.

## Installing your image on the internal eMMC

It can be interesting to install the AGL image directly on the internal eMMC rather than to boot from and SD or a USB removable device.
The easiest to do so, is to add the required tools in your removable boot device, boot AGL from the removable device and
then use the mkefi-agl.sh script to install the image image on the internal eMMC.
 * Add the tools to the AGL image.
 ** Add a file site.conf in your build/conf directory with the following content:
 ```
 INHERIT += "rm_work"
 IMAGE_INSTALL_append = " linux-firmware-iwlwifi-7265d"
 IMAGE_INSTALL_append = " parted e2fsprogs dosfstools"
 IMAGE_INSTALL_append = " linux-firmware-i915 linux-firmware-ibt linux-firmware-iwlwifi-8000c"
 add the iwlifi for your own device as needed
 ```
 * rebuild your image and install it on your removable device with mkefi-agl.sh.
 * add the AGL image file on your removable device in the home directory (for later installation)
 ```
 the AGL image file created by yocto (.wic.xz)
 located in build/tmp/deploy/images/intel-corei7-64/agl-demo-platform-intel-corei7-64.wic.xz
 ```
 * boot AGL from your removable device
 * connect to the AGL running image either via serial link or ssh
 * locate the eMMC device name
 * install image with mkefi-agl.sh
 ```
 cat /proc/partitions
 ```
 * install the AGL image on the eMMC with mkefi-agl.sh script
 * remove the USB or SD boot device
 * reboot
 
## Selecting the SD or USB to boot

When booting a MinnowBoard or a Joule you can change the default boot device by hitting F2 during initial UEFI boot.  
It's easier to achieve it in the right time with a USB keyboard than via serial link.  
During boot USB hubs are not supported, you need to connect the keyboard directly in the USB socket.  
It's also preferable to use F9 and to change the boot order once for all. 
Please note: You can only change the boot order when a valid device is inserted in the corresponding port (USB or SD).

The MinnowBoard, Joule, many laptops and NUCs will not accept to boot with some USB3 sticks. If you have some trouble to get your USB3 stick detected during boot, swap it for a USB2. In any case working with SD card is faster to flash and to boot. SD should be preferred.  
The Joule seems to refuse to boot with my SD-HC-I type cards while I had no problem with the MinnowBoard. If you work with a Joule, use regular SD-HC (mode 4 and 10 work fine).

## Serial debug Port

Serial debug port ID varies with the HW platform. By default AGL build Intel target as a MinnowBoard where serial is `/dev/ttyS0`, on Joule and MRB the serial debug is `/dev/ttyS2`.

You may have to change the configuration in your bootloader which is located in the EFI partition.

## Serial debug cable

On the MinnowBoard the serial cable is an FTDI serial cable. The wiring can be found [here](http://wiki.minnowboard.org/MinnowBoard_MAX_HW_Setup).  
On the Joule the serial connection is done via the micro USB cable which is not provided in the Developer kit. Details can be found [here](https://software.intel.com/en-us/node/667851).  
Interface speed is 115200 bps, 8 bits, no parity, no flow control

## Which port name is used to define the connected display(s)

Port naming may change with HW platforms and connected display. The simplest is to check following the first boot, in the systemd journal, which display names are listed.

```bash
journalctl |grep Output
```

**Note:** The Output information is only listed if a real Display is connected to the connector on the board.  
The file holding that configuration is `/etc/xdg/weston/weston.ini`.

Common Display names for Intel are:

* `HDMI-A-1`
* `HDMI-A-2`
* `LVDS-1`
