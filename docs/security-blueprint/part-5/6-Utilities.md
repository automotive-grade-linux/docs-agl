# Utilities

- **busybox**: Software that provides several stripped-down Unix tools in a
  single executable file. Of course, it will be necessary to use a "production"
  version of **busybox** in order to avoid all the tools useful only in
  development mode.

<!-- section-config -->

Domain               | `Tool` name | _State_
-------------------- | ----------- | ----------------------------------------------------------------------
Platform-Utilities-1 | `busybox`   | _Used_ to provide a number of tools. Do not compile development tools.

<!-- end-section-config -->

## Functionalities to exclude in production mode

In production mode, a number of tools must be disabled to prevent an attacker
from finding logs for example. This is useful to limit the visible surface and
thus complicate the fault finding process. The tools used only in development
mode are marked by an '**agl-devel**' feature. When building in production mode,
these tools will not be compiled.

<!-- section-config -->

Domain                | `Utility` name and normal `path`                     | _State_
--------------------- | ---------------------------------------------------- | ----------
Platform-Utilities-1  | `chgrp` in `/bin/chgrp`                              | _Disabled_
Platform-Utilities-2  | `chmod` in `/bin/chmod`                              | _Disabled_
Platform-Utilities-3  | `chown` in `/bin/chown`                              | _Disabled_
Platform-Utilities-4  | `dmesg` in `/bin/dmesg`                              | _Disabled_
Platform-Utilities-5  | `Dnsdomainname` in `/bin/dnsdomainname`              | _Disabled_
Platform-Utilities-6  | `dropbear`, Remove "dropbear" from `/etc/init.d/rcs` | _Disabled_
Platform-Utilities-7  | `Editors` in (vi) `/bin/vi`                          | _Disabled_
Platform-Utilities-8  | `find` in `/bin/find`                                | _Disabled_
Platform-Utilities-9  | `gdbserver` in `/bin/gdbserver`                      | _Disabled_
Platform-Utilities-10 | `hexdump` in `/bin/hexdump`                          | _Disabled_
Platform-Utilities-11 | `hostname` in `/bin/hostname`                        | _Disabled_
Platform-Utilities-12 | `install` in `/bin/install`                          | _Disabled_
Platform-Utilities-13 | `iostat` in `/bin/iostat`                            | _Disabled_
Platform-Utilities-14 | `killall` in `/bin/killall`                          | _Disabled_
Platform-Utilities-15 | `klogd` in `/sbin/klogd`                             | _Disabled_
Platform-Utilities-16 | `logger` in `/bin/logger`                            | _Disabled_
Platform-Utilities-17 | `lsmod` in `/sbin/lsmod`                             | _Disabled_
Platform-Utilities-18 | `pmap` in `/bin/pmap`                                | _Disabled_
Platform-Utilities-19 | `ps` in `/bin/ps`                                    | _Disabled_
Platform-Utilities-20 | `ps` in `/bin/ps`                                    | _Disabled_
Platform-Utilities-21 | `rpm` in `/bin/rpm`                                  | _Disabled_
Platform-Utilities-22 | `SSH`                                                | _Disabled_
Platform-Utilities-23 | `stbhotplug` in `/sbin/stbhotplug`                   | _Disabled_
Platform-Utilities-24 | `strace` in `/bin/trace`                             | _Disabled_
Platform-Utilities-25 | `su` in `/bin/su`                                    | _Disabled_
Platform-Utilities-26 | `syslogd` in (logger) `/bin/logger`                  | _Disabled_
Platform-Utilities-27 | `top` in `/bin/top`                                  | _Disabled_
Platform-Utilities-28 | `UART` in `/proc/tty/driver/`                        | _Disabled_
Platform-Utilities-29 | `which` in `/bin/which`                              | _Disabled_
Platform-Utilities-30 | `who` and `whoami` in `/bin/whoami`                  | _Disabled_
Platform-Utilities-31 | `awk` (busybox)                                      | _Enabled_
Platform-Utilities-32 | `cut` (busybox)                                      | _Enabled_
Platform-Utilities-33 | `df` (busybox)                                       | _Enabled_
Platform-Utilities-34 | `echo` (busybox)                                     | _Enabled_
Platform-Utilities-35 | `fdisk` (busybox)                                    | _Enabled_
Platform-Utilities-36 | `grep` (busybox)                                     | _Enabled_
Platform-Utilities-37 | `mkdir` (busybox)                                    | _Enabled_
Platform-Utilities-38 | `mount` (vfat) (busybox)                             | _Enabled_
Platform-Utilities-39 | `printf` (busybox)                                   | _Enabled_
Platform-Utilities-40 | `sed` in `/bin/sed` (busybox)                        | _Enabled_
Platform-Utilities-41 | `tail` (busybox)                                     | _Enabled_
Platform-Utilities-42 | `tee` (busybox)                                      | _Enabled_
Platform-Utilities-43 | `test` (busybox)                                     | _Enabled_

<!-- end-section-config --> <!-- section-note -->

The _Enabled_ Unix/Linux utilities above shall be permitted as they are often
used in the start-up scripts and for USB logging. If any of these utilities are
not required by the device then those should be removed.

<!-- end-section-note -->
