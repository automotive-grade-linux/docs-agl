# Troubleshooting

## Extended attributes MUST be copied

**IMPORTANT, The extended attribute set during image construction MUST be copied to the SD card.**

When using tar to create the SDcard, it is a common error to not copy the extended attributes. Find below instruction for using tar.

Verify that **tar** version is 1.28 or newer:

```bash
tar --version
tar (GNU tar) 1.28
[snip]
```

If it is not the case, a native up-to-date version of tar is also generated while building AGL distribution:

```bash
tmp/sysroots/x86_64-linux/usr/bin/tar-native/tar --version
tar (GNU tar) 1.28
[snip]
```

To copy Automotive Grade Linux (AGL) files AND EXTENDED ATRIBUTES onto the SDcard using tar the command is:

```bash
tar --extract --xz --numeric-owner --preserve-permissions --preserve-order --totals \
           --xattrs-include='*' --directory=DESTINATION_DIRECTORY --file=agl-demo-platform.....tar.xz
```

## meta-rust

Due to a known bug in the upstream of meta-rust the Yocto/OE recipe for rust-cross may fail while building RVI SOTA Client or another application written in the Rust programming language.  
Until the complete resolution of the issue the workaround is to disable all use of the CXX11 ABI by applying the following lines to **conf/local.conf**:

```bash
LD_CXXFLAGS_append = " -D_GLIBCXX_USE_CXX11_ABI=0"
TARGET_CXXFLAGS_append = " -D_GLIBCXX_USE_CXX11_ABI=0"
CXXFLAGS_append = " -D_GLIBCXX_USE_CXX11_ABI=0"
  
BUILD_CXXFLAGS_remove_pn-gcc-runtime = "-D_GLIBCXX_USE_CXX11_ABI=0"
TARGET_CXXFLAGS_remove_pn-gcc-runtime = "-D_GLIBCXX_USE_CXX11_ABI=0" CXXFLAGS_remove_pn-gcc-runtime = "-D_GLIBCXX_USE_CXX11_ABI=0"
```

## Screen orientation for Splash and in Weston

Depending of your scren mounting the default orientation of the UI an/or splash screen might be incorrect.
To change the orientation of the splash screen patch

```bash
File: /etc/systemd/system/sysinit.target.wants/psplash-start.service
Line:  ExecStart=/usr/bin/psplash -n -a 90
```

To change the orientation of the UI in Weston patch

```bash
File: /etc/xdg/weston/weston.ini
Line: transform=90
```

## Disabling Homescreen in AGL 4.0.x DD release

**Problem**: new installed applications are not available on Homescreen and even if started manually through afm-util, the application starts but no surface appears.

**Answer**: this is due to IVI-Shell integration with Qt and Homescreen.

To disable IVI-Shell and revert to the "plain old" weston desktop, you can follow the 4 steps below:

* Modify */etc/xdg/weston/weston.ini* and comment the line mentioning IVI-shell. For example on Porter board:

```bash
           [core]
           backend=drm-backend.so
           #shell=ivi-shell.so
           ...
```

* modify */etc/afm/unit.env.d/qt-for-ivi-shell* and comment the line specifying QT Wayland backend:

```bash
           ...
           #Environment=QT_WAYLAND_SHELL_INTEGRATION=ivi-shell
           ...
```

(If you use vi, remove backup files by `rm /etc/afm/unit.env.d/*~`)

* disable Homescreen services:

```bash
           # systemctl --user mask HomeScreen.service
```

* Reboot your target and you should then be able to start apps on the standard weston screen using afm-util

## Adding media files to play with MediaPlayer
AGL include the default MediaPlayer sample app which can be used to play music. The `lightmediascanner.service` by default will search for media under the `/media` folder. So if you plug in any USB stick containing music, they would be recognized and showed in the playlist of the MediaPlayer app menu.

The current supported format is OGG. Please convert your files to ogg to play with MediaPlayer.

In case you want to store music in another place, modify the `/usr/lib/systemd/user/lightmediascanner.service` file and change the `--directory` parameter to the path of that folder.

If you don’t want to touch the ligthmediascanner service, you can also add a folder named "Music" under `/home/root` and put your music files there.

## Configuring the Audio hardware
AGL uses alsa as Audio configuration master. If the correct HW is not setup, the Audio system will fail to start what will also fails the demo Home Screen launch.
You need to configure Audio in 2 places
 - alsa
 - 4A HAL
 
 ### alsa
 The file /etc/asound.conf (at the beginning) tells which hardware will be used.
 For example on an Intel Minnow or UP board your need to enter the following configuration.
 ```
 pcm.Speakers {
    type dmix
    slave {pcm "hw:PCH,3"}
    ipc_key 1001          # ipc_key should be unique to each dmix
}
 ```
The correct value (here hw:PCH,3) can be obtained with the command:
```
aplay -l
**** List of PLAYBACK Hardware Devices ****
card 0: PCH [HDA Intel PCH], device 3: HDMI 0 [HDMI 0]
  Subdevices: 1/1
  Subdevice #0: subdevice #0
card 0: PCH [HDA Intel PCH], device 7: HDMI 1 [HDMI 1]
  Subdevices: 1/1
  Subdevice #0: subdevice #0
```
Using hw:PCH rather than hw:0 will avoid you many trouble.<br>
NOTE that the device number is not always 0. If you give no device number, alsa will assume device 0 (and the not the first available device), what can fail your configuration.<br>
As the default is hw:0 (card 0 device 0), it will always fail on a Minnow or UP board.

For info HW device for common configuration are:
- for USB Audio -> hw:AUDIO,0
- for Intel Analog output -> hw:PCH,0 (not available on Minnow, Joule, Up boards, ...)
- for Intel via -> HDMI hw:PCH,3
- for MOST Unicens -> hw:ep016ch,0

### 4A HAL configuration
AGL 4A needs to know which HAL shall be used. This is configured in the file:
```
/usr/agl-service-audio-4a/ahl-agl-service-audio-4a-config.json
```
At the beginning of that file you will find the slected HAL (note the there is no correct default value).
```
{
    "version": "0.2.0",
    "policy_module": "AudioPolicy_v1",
    "description": "High-level binding configuration file",
    "note": "Devices and routings are always listed in order of priority (for device selection rules)",
    "hal_list": ["intel-minnow"],
    "audio_roles": [
```
Here you see "intel-minnow" but common values are:
- Intel laptop -> intel-pc
- Intel via HDMI -> intel-minnow
- Renesas -> Rcar-M3
- USB Audio Speaker -> usb-audio
- MOSTS Unicens -> hal-most-unicens

More HAL can be found on Gerrit (search projects named as 4a-hal*)
