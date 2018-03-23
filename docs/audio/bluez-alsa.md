# bluez-alsa

## Introduction

Bluetooth Audio ALSA Backend allow bluetooth audio without PulseAudio.

This project is a rebirth of a direct integration between Bluez and ALSA. Since Bluez >= 5, the build-in integration has been removed in favor of 3rd party audio applications. From now on, Bluez acts as a middleware between an audio application, which implements Bluetooth audio profile, and a Bluetooth audio device.

github source : [bluez-alsa](https://github.com/Arkq/bluez-alsa)

## Add bluez-alsa to an AGL image

You can add bluez-alsa to your image

```yocto
IMAGE_INSTALL_append = "bluez-alsa"
```

## Check bluez-alsa status

You can check the bluez-alsa status by running:

```bash
systemctl status bluez-alsa.service
```

## Stop pulseaudio

You must disable pulseaudio if you want to use bluez-alsa

```bash
systemctl --user stop pulseaudio
```

or disable pulseaudio bluetooth support

```bash
vi /etc/pulse/default.pa
#.ifexists module-bluetooth-policy.so
#load-module module-bluetooth-policy
#.endif

#.ifexists module-bluetooth-discover.so
#load-module module-bluetooth-discover
#.endif
```

## Connect your Bluetooth device

You need to connect a bluetooth device

```bash
$ bluetoothctl
[bluetooth]# pair ${BT_ADDR}
[bluetooth]# connect ${BT_ADDR}
[bluetooth]# info ${BT_ADDR}
```

Here somes documentation links:

* [Bluetooth headset from archlinux](https://wiki.archlinux.org/index.php/Bluetooth_headset)
* [Bluetooth Headset from gentoo](https://wiki.gentoo.org/wiki/Bluetooth_Headset)
* [Bluez A2DP AudioSink for ALSA](http://www.lightofdawn.org/blog/?viewDetailed=00032)
* [Bluez A2DP](http://www.lightofdawn.org/wiki/wiki.cgi/BluezA2DP)

## Test bluez-alsa speacker

```bash
wget http://www.kozco.com/tech/piano2.wav

aplay -D bluealsa:HCI=hci0,DEV=${BT_ADDR},PROFILE=a2dp ./piano2.wav
```

## Add bluez-alsa pcm config to alsa

```bash
vi /etc/asound.conf
# Bluetooth headset
pcm.btheadset {
        type plug
        slave.pcm {
                type bluealsa
                device "${BT_ADDR}"
                profile "a2dp"
        }
        hint {
                show on
                description "Bluetooth Audio ALSA Backend"
        }
}
```

Doc [asoundrc](https://alsa.opensrc.org/Asoundrc)

Test bluez-alsa pcm

```bash
aplay -D btheadset ./piano2.wav
```

## Test gstreamer player

```bash
gst-launch-1.0 uridecodebin uri=file:///mnt/Holy-Mountain.mp3  ! alsasink device=btheadset
```

## Test bluez-alsa phone

After connected your phone with bluez:

```bash
bluealsa-aplay ${BT_ADDR}
```
