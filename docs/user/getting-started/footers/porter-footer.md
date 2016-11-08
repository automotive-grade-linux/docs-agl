## Weston

If Weston fails to start double check /etc/xdg/weston/weston.ini and verify that the output name and screen resolution matches the configured U-Boot environment, for example on Renesas Porter board rev 1.0 with screen resolution 1024x768:

```
[core]
shell=desktop-shell.so
backend=drm-backend.so

[shell]
locking=true
# Uncomment below to hide panel
#panel-location=none

[output]
#name=Virtual-1
name=HDMI-A-1
mode=1024x768
```
