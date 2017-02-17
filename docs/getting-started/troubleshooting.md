# Troubleshooting

## Extended attributes MUST be copied

***IMPORTANT, The extended attribute set during image construction MUST be copied to the SD card.***

When using tar to create the SDcard, it is a common error to not copy the extended attributes. Find below instruction for using tar.

Verify that **tar** version is 1.28 or newer:

```
tar --version
tar (GNU tar) 1.28
[snip]
```

If it is not the case, a native up-to-date version of tar is also generated while building AGL distribution:
```
tmp/sysroots/x86_64-linux/usr/bin/tar-native/tar --version
tar (GNU tar) 1.28
[snip]
```

To copy Automotive Grade Linux (AGL) files AND EXTENDED ATRIBUTES onto the SDcard using tar the command is:

```
tar --extract --numeric-owner --preserve-permissions --preserve-order --totals \
           --xattrs-include='*' --directory=DESTINATION_DIRECTORY --file=agl-demo-platform.....tar.bz2
```

## meta-rust
Due to a known bug in the upstream of meta-rust the Yocto/OE recipe for rust-cross may fail while building RVI SOTA Client or another application written in the Rust programming language.  
Until the complete resolution of the issue the workaround is to disable all use of the CXX11 ABI by applying the following lines to **conf/local.conf**:

```
LD_CXXFLAGS_append = " -D_GLIBCXX_USE_CXX11_ABI=0"
TARGET_CXXFLAGS_append = " -D_GLIBCXX_USE_CXX11_ABI=0"
CXXFLAGS_append = " -D_GLIBCXX_USE_CXX11_ABI=0"
  
BUILD_CXXFLAGS_remove_pn-gcc-runtime = "-D_GLIBCXX_USE_CXX11_ABI=0"
TARGET_CXXFLAGS_remove_pn-gcc-runtime = "-D_GLIBCXX_USE_CXX11_ABI=0" CXXFLAGS_remove_pn-gcc-runtime = "-D_GLIBCXX_USE_CXX11_ABI=0"
```

## Disabling Homescreen in AGL 3.0.x CC release

**Problem**: new installed applications are not available on Homescreen and even if started manually through afm-util, the application starts but no surface appears.

**Answer**: this is due to IVI-Shell integration with Qt and Homescreen.

To disable IVI-Shell and revert to the "plain old" weston desktop, you can follow the 4 steps below:

1. modify */etc/xdg/weston/weston.ini* and comment the line mentioning IVI-shell. For example on Porter board:

           [core]
           backend=drm-backend.so
           #shell=ivi-shell.so
           ...
2. modify */usr/lib/systemd/user/afm-user-daemon.service* and comment the line specifying QT Wayland backend:

           ...
           #Environment=QT_WAYLAND_SHELL_INTEGRATION=ivi-shell
           ...
3. disable Homescreen services:

           # systemctl disable HomeScreenAppFrameworkBinderAGL.service
           # systemctl disable HomeScreen.service
           # systemctl disable InputEventManager.service
           # systemctl disable WindowManager.service
4. Reboot your target and you should then be able to start apps on the standard weston screen using afm-util

