## BIOS update

Both the Joule and the Minnowboard require a BIOS upgrade. **Don t loose time trying without.**  
<https://firmware.intel.com/projects/minnowboard-max>  
<https://software.intel.com/en-us/flashing-the-bios-on-joule>

## Creating a bootable image

Multiple options are avaiable but dd and tar can very easily let you down due to the requirement to pass SMACK labels, create a proper UEFI configuration and a few other tricks.  
The script [mkefi-agl.sh](https://gerrit.automotivelinux.org/gerrit/gitweb?p=AGL/meta-agl.git;a=blob_plain;f=scripts/mkefi-agl.sh;hb=HEAD) has been done to help you.
The option -h will print the help and the option -v will detailled the operation and ease any debug.  

## Selecting the SD or USB to boot

When booting a Minnowboard or a Joule you can change the default boot device by hitting F2 during initial UEFI boot.  
It's easier to acheive it in the right time with a USB keyboard than via serial link.  
During boot USB hub are not supported, you need to connect the keyboard directly in the USB socket.  
It's also preferable to use F9 and to change the boot order once for all.  
Please note: You can only change the boot order, when a valid device is inserted in the corresponding port (USB or SD).

The Minnow, Joule, many laptops and NUCs will not accept to boot with some USB3 stick. If you have some trouble to get your USB3 stick detected during boot, swap it for a USB2. In anycase working with SD card is faster to flash and to boot. SD should be prefered.  
The Joule seems to refuse to boot with my SD-HC-I type cards while I had no problem with the Minnow. If you work with a Joule, use regular SD-HC (mode 4 and 10 work fine)

## Serial debug Port

Serial debug port ID varies with the HW platform :  
By default AGL build Intel target as a Minnowboard where serial is /dev/ttyS0  
On Joule and MRB the serial debug is /dev/ttyS2  

You may have to change the configuration in your boot loader which is located in the EFI partition.

## Serial debug cable

On the Minnowboard the serial cable is a FTDI serial cable. The wiring can be found [here](http://wiki.minnowboard.org/MinnowBoard_MAX_HW_Setup).  
On the Joule the serial connection is done via the micro USB cable which is not provided in the Developer kit. Details can be found [here](https://software.intel.com/en-us/node/667851).  
Interface speed is 115200 bps, 8 bits, no parity, no flow control

## Which port name is used to define the connected display(s)

Port naming may change with HW platforms and connected display. The simplest is to check following the fist boot, in the systemd journal which display names are listed.

```bash
journalctl |grep Output
```

**Note:** The Output information is only listed if a real Display is connected to the connector on the board.  
The file holding that configuration is /etc/xdg/weston/weston.ini  
Common Display name for Intel are

* HDMI-A-1
* HDMI-A-2
* LVDS-1
