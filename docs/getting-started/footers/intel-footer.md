## BIOS update
Both the Joule and the Minnowboard require a BIOS upgrade. **Don t loose time trying without.**<br>
https://firmware.intel.com/projects/minnowboard-max<br>
https://software.intel.com/en-us/flashing-the-bios-on-joule

## Creating a bootable image
Multiple options are avaiable but dd and tar can very easily let you down due to the requirement to pass SMACK labels, create a proper UEFI configuration and a few other tricks.<br>
The script [mkefi-agl.sh](https://github.com/dominig/mkefi-agl.sh) has been done to help you.<br>
The option -h will print the help and the option -v will detailled the operation and ease any debug.<br>


## Serial debug Port

Serial debug port ID varies with the HW platform :<br>
By default AGL build Intel target as a Minnowboard where serial is /dev/ttyS0 <br>
On Joule and MRB the serial debug is /dev/ttyS2 <br>

You may have to change the configuration in your boot loader which is located in the EFI partition.

## Serial debug cable

On the Minnowboard the serial cable is a FTDI serial cable. The wiring can be found [here](http://wiki.minnowboard.org/MinnowBoard_MAX_HW_Setup).<br>
On the Joule the serial connection is done via the micro USB cable which is not provided in the Developer kit. Details can be found [here](https://software.intel.com/en-us/node/667851).<br>
Interface speed is 115200 bps, 8 bits, no parity, no flow control

## Which port name is used to define the connected display(s)

Port naming may change with HW platforms and connected display. The simplest is to check following the fist boot, in the systemd journal which display names are listed.<br>
```
journalctl |grep Output
```
**Note:** The Output information is only listed if a real Display is connected to the connector on the board.<br>
The file holding that configuration is /etc/xdg/weston/weston.ini<br>
Common Display name for Intel are
* HDMI-A-1
* HDMI-A-2
* LVDS-1
