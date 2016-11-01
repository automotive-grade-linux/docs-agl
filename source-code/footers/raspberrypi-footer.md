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
