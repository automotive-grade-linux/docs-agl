# Commercial Licensed Packages

Append to following lines to **conf/local.conf** to include libomxil under a commercial license to your build:

```
# For libomxil
LICENSE_FLAGS_WHITELIST = "commercial"

IMAGE_INSTALL_append = " libomxil"
```

# Raspberry Pi Touchscreen with Rotation

If you have Raspberry Pi official 7" touchscreen connected, you can rotate it with these lines in /etc/xdg/weston/weston.ini

```
root@raspberrypi3:/etc/xdg/weston# cat weston.ini
[core]
backend=drm-backend.so
shell=desktop-shell.so

[shell]
locking=true
# Uncomment below to hide panel
#panel-location=none

[launcher]
icon=/usr/share/weston/terminal.png
path=/usr/bin/weston-terminal

[launcher]
icon=/usr/share/weston/icon_flower.png
path=/usr/bin/weston-flower

[output]
name=DSI-1
transform=270
```

# Debugging

It is possible to debug AGL images on Raspberry Pi using 3.3V USB to serial cable, such as [Olimex USB-Serial-Cable-F](https://www.olimex.com/Products/Components/Cables/USB-Serial-Cable/USB-Serial-Cable-F/), connected to the UART of the board. Follow the instructions below to connect a cable to the board (do it on your own risk, no warranty is provided):

* Connect the BLUE wire if you are using Olimex USB-Serial-Cable-F to pin 6 of Raspberry Pi,
* Connect the RX line of the cable (GREEN wire if you are using Olimex USB-Serial-Cable-F) to pin 8 (TX line) of Raspberry Pi,
* Connect the TX line of the cable (RED wire if you are using Olimex USB-Serial-Cable-F) to pin 10 (RX line) of Raspberry Pi.

![Olimex USB-Serial-Cable-F attached to Raspberry PI 2 for debugging through the serial console](../images/RaspberryPi2-ModelB-debug-serial-cable.jpg)

* Plug the USB connector of the cable to your computer and use your favorite tool for serial communication, for example on Ubuntu and other Linux distributions you may use screen:

```
sudo screen /dev/ttyUSB0 115200
```

Pay attention that the colours of the cable may vary depending on the vendor. If you have USB console cable from Adafruit please have a look [here](https://learn.adafruit.com/adafruits-raspberry-pi-lesson-5-using-a-console-cable/connect-the-lead).
