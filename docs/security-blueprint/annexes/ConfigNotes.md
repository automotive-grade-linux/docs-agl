# Config notes
<!-- config -->

Domain               | Object     | Recommendations
-------------------- | ---------- | ----------------------------------
Hardware-Integrity-1 | Bootloader | Must control bootloader integrity.
Hardware-Integrity-2 | Board      | Must use a HSM.
Hardware-Integrity-3 | RTC        | Must not be alterable.

Domain                 | Object | Recommendations
---------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------
Hardware-Certificate-1 | System | Shall allow storing dedicated certificates.
Hardware-Certificate-2 | ECU    | The ECU must verify the certification authority hierarchy.
Hardware-Certificate-3 | System | Allow the modification of certificates only if the source can be authenticated by a certificate already stored or in the higher levels of the chain of trust.

Domain            | Object     | Recommendations
----------------- | ---------- | ------------------------------------------------------------------------------------
Hardware-Memory-1 | ECU        | The ECU shall never expose the unencrypted key in RAM when using cryptographic keys.
Hardware-Memory-2 | Bootloader | Internal NVM only
Hardware-Module-3 | -          | HSM must be used to secure keys.

Domain                 | _Variable_ / `Config` name | `Value`
---------------------- | -------------------------- | -------
Boot-Image-Selection-1 | `CONFIG_BOOTDELAY`         | `-2`
Boot-Image-Selection-2 | _bootdelay_                | `-2`

Domain                    | `Config` name                | _State_
------------------------- | ---------------------------- | --------
Boot-Image-Authenticity-1 | `CONFIG_FIT`                 | _Enable_
Boot-Image-Authenticity-2 | `CONFIG_FIT_SIGNATURE`       | _Enable_
Boot-Image-Authenticity-3 | `CONFIG_RSA`                 | _Enable_
Boot-Image-Authenticity-4 | `CONFIG_OF_CONTROL`          | _Enable_
Boot-Image-Authenticity-5 | `CONFIG_OF_SEPARATE`         | _Enable_
Boot-Image-Authenticity-6 | `CONFIG_DEFAULT_DEVICE_TREE` | _Enable_

Domain               | Communication modes       | _State_
-------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------
Boot-Communication-1 | `USB`                     | _Disabled_ and _Compiled-out_ if not required.
Boot-Communication-2 | `USB`                     | Else, Kernel should be configured to only enable the minimum required USB devices and filesystems should be treated with special care.
Boot-Communication-3 | `Ethernet`                | _Disabled_
Boot-Communication-4 | U-boot and sboot `DOCSIS` | _Disabled_
Boot-Communication-5 | `Serial ports`            | _Disabled_

Domain                   | `Config` name           | _State_
------------------------ | ----------------------- | -------------
Boot-Communication-USB-1 | `CONFIG_CMD_USB`        | _Not defined_
Boot-Communication-USB-2 | `CONFIG_USB_UHCI`       | _Not defined_
Boot-Communication-USB-3 | `CONFIG_USB_KEYBOARD`   | _Not defined_
Boot-Communication-USB-4 | `CONFIG_USB_STORAGE`    | _Not defined_
Boot-Communication-USB-5 | `CONFIG_USB_HOST_ETHER` | _Not defined_

Domain               | Communication modes  | _State_
-------------------- | -------------------- | ---------------------------------------------------------------------------------------------
Boot-Communication-1 | `Network interfaces` | Preferably _no network interface is allowed_, otherwise, restrict the services to those used.

Domain               | Object                            | Recommendations
-------------------- | --------------------------------- | -------------------------------------------------------------
Boot-Communication-1 | `Services`, `ports` and `devices` | Restrict the `services`, `ports` and `devices` to those used.

Domain                     | `Command` name | _State_
-------------------------- | -------------- | ---------
Boot-Communication-Flash-1 | `do_nand`      | _Disable_

Domain                 | `Config` name                           | `Value`
---------------------- | --------------------------------------- | ---------
Boot-Consoles-Serial-1 | `CONFIG_SILENT_CONSOLE`                 | `Disable`
Boot-Consoles-Serial-2 | `CONFIG_SYS_DEVICE_NULLDEV`             | `Disable`
Boot-Consoles-Serial-3 | `CONFIG_SILENT_CONSOLE_UPDATE_ON_RELOC` | `Disable`

Domain                 | `Environment variable` name | _State_
---------------------- | --------------------------- | -------------
Boot-Consoles-Serial-1 | `INC_DEBUG_PRINT`           | _Not defined_

Domain                     | `Config` name                | _State_
-------------------------- | ---------------------------- | ---------
Boot-Consoles-Variables-1  | `CONFIG_ENV_IS_IN_MMC`       | `#undef`
Boot-Consoles-Variables-2  | `CONFIG_ENV_IS_IN_EEPROM`    | `#undef`
Boot-Consoles-Variables-3  | `CONFIG_ENV_IS_IN_FLASH`     | `#undef`
Boot-Consoles-Variables-4  | `CONFIG_ENV_IS_IN_DATAFLASH` | `#undef`
Boot-Consoles-Variables-5  | `CONFIG_ENV_IS_IN_FAT`       | `#undef`
Boot-Consoles-Variables-6  | `CONFIG_ENV_IS_IN_NAND`      | `#undef`
Boot-Consoles-Variables-7  | `CONFIG_ENV_IS_IN_NVRAM`     | `#undef`
Boot-Consoles-Variables-8  | `CONFIG_ENV_IS_IN_ONENAND`   | `#undef`
Boot-Consoles-Variables-9  | `CONFIG_ENV_IS_IN_SPI_FLASH` | `#undef`
Boot-Consoles-Variables-10 | `CONFIG_ENV_IS_IN_REMOTE`    | `#undef`
Boot-Consoles-Variables-11 | `CONFIG_ENV_IS_IN_UBI`       | `#undef`
Boot-Consoles-Variables-12 | `CONFIG_ENV_IS_NOWHERE`      | `#define`

Domain                  | `Command` name | _State_
----------------------- | -------------- | ----------
Boot-Consoles-MemDump-1 | `md`           | _Disabled_
Boot-Consoles-MemDump-2 | `mm`           | _Disabled_
Boot-Consoles-MemDump-3 | `nm`           | _Disabled_
Boot-Consoles-MemDump-4 | `mw`           | _Disabled_
Boot-Consoles-MemDump-5 | `cp`           | _Disabled_
Boot-Consoles-MemDump-6 | `mwc`          | _Disabled_
Boot-Consoles-MemDump-7 | `mdc`          | _Disabled_
Boot-Consoles-MemDump-8 | `mtest`        | _Disabled_
Boot-Consoles-MemDump-9 | `loopw`        | _Disabled_

Domain               | Object | Recommendations
-------------------- | ------ | ------------------------------------------
Kernel-General-MAC-1 | SMACK  | Must implement a Mandatory Access Control.

Domain                 | `Config` name  | `Value`
---------------------- | -------------- | -------
Kernel-General-kexec-1 | `CONFIG_KEXEC` | `n`

Domain                      | `Config` name   | `Value`
--------------------------- | --------------- | -------
Kernel-General-IPAutoConf-1 | `CONFIG_IP_PNP` | `n`

Domain                          | `Config` name           | `Value`
------------------------------- | ----------------------- | -------
Kernel-General-SysCtl_SysCall-1 | `CONFIG_SYSCTL_SYSCALL` | `n`

Domain                       | `Config` name   | `Value`
---------------------------- | --------------- | -------
Kernel-General-LegacyLinux-1 | `CONFIG_USELIB` | `n`

Domain                      | `Config` name                  | `Value`
--------------------------- | ------------------------------ | -------
Kernel-General-FirmHelper-1 | `CONFIG_FW_LOADER_USER_HELPER` | `n`

Domain                       | `Config` name          | `Value`
---------------------------- | ---------------------- | -------
Kernel-General-PanicOnOOPS-1 | `CONFIG_PANIC_ON_OOPS` | `y`

Domain                     | `Config` name        | `Value`
-------------------------- | -------------------- | -------
Kernel-General-SocketMon-1 | `CONFIG_PACKET_DIAG` | `n`
Kernel-General-SocketMon-2 | `CONFIG_UNIX_DIAG`   | `n`

Domain                   | `Config` name    | `Value`
------------------------ | ---------------- | -------
Kernel-General-BPF_JIT-1 | `CONFIG_BPF_JIT` | `n`

Domain                         | `Config` name             | `Value`
------------------------------ | ------------------------- | -------
Kernel-General-ModuleSigning-1 | `CONFIG_MODULE_SIG_FORCE` | `y`

Domain                   | Object              | _State_
------------------------ | ------------------- | ----------
Kernel-General-Drivers-1 | `USB`               | _Disabled_
Kernel-General-Drivers-2 | `PCMCIA`            | _Disabled_
Kernel-General-Drivers-3 | Other `hotplug` bus | _Disabled_

Domain                           | `compiler` and `linker` options | _State_
-------------------------------- | ------------------------------- | --------
Kernel-General-IndependentExec-1 | `-pie -fpic`                    | _Enable_

Domain                            | `compiler` and `linker` options | _State_
--------------------------------- | ------------------------------- | --------
Kernel-General-OverwriteAttacks-1 | `-z,relro`                      | _Enable_
Kernel-General-OverwriteAttacks-2 | `-z,now`                        | _Enable_

Domain                          | `compiler` and `linker` options | _State_
------------------------------- | ------------------------------- | --------
Kernel-General-LibraryLinking-1 | `-static`                       | _Enable_

Domain                         | `Config` name    | `Value`
------------------------------ | ---------------- | -------
Kernel-Memory-RestrictAccess-1 | `CONFIG_DEVKMEM` | `n`

Domain                   | `Config` name       | `Value`
------------------------ | ------------------- | -------
Kernel-Memory-CoreDump-1 | `CONFIG_PROC_KCORE` | `n`

Domain               | `Config` name | `Value`
-------------------- | ------------- | -------
Kernel-Memory-Swap-1 | `CONFIG_SWAP` | `n`

Domain                         | `Config` name         | `Value`
------------------------------ | --------------------- | -------
Kernel-Memory-LoadAllSymbols-1 | `CONFIG_KALLSYMS`     | `n`
Kernel-Memory-LoadAllSymbols-2 | `CONFIG_KALLSYMS_ALL` | `n`

Domain                | `Config` name              | `Value`
--------------------- | -------------------------- | -------
Kernel-Memory-Stack-1 | `CONFIG_CC_STACKPROTECTOR` | `y`

Domain                 | `Config` name   | `Value`
---------------------- | --------------- | -------
Kernel-Memory-Access-1 | `CONFIG_DEVMEM` | `n`

Domain                         | `Config` name         | `Value`
------------------------------ | --------------------- | -------
Kernel-Memory-CrossMemAttach-1 | `CROSS_MEMORY_ATTACH` | `n`

Domain                        | `compiler` and `linker` options | _State_
----------------------------- | ------------------------------- | --------
Kernel-Memory-StackSmashing-1 | `-fstack-protector-all`         | _Enable_

Domain                          | `compiler` and `linker` options | `Value`
------------------------------- | ------------------------------- | -------
Kernel-Memory-BufferOverflows-1 | `-D_FORTIFY_SOURCE`             | `2`

Domain                   | `Config` name                | `Value`
------------------------ | ---------------------------- | -------
Kernel-Consoles-Serial-1 | `CONFIG_SERIAL_8250`         | `n`
Kernel-Consoles-Serial-2 | `CONFIG_SERIAL_8250_CONSOLE` | `n`
Kernel-Consoles-Serial-3 | `CONFIG_SERIAL_CORE`         | `n`
Kernel-Consoles-Serial-4 | `CONFIG_SERIAL_CORE_CONSOLE` | `n`

Domain                        | `Config` name             | `Value`
----------------------------- | ------------------------- | -----------------------------------
Kernel-Consoles-CommandLine-1 | `CONFIG_CMDLINE_BOOL`     | `y`
Kernel-Consoles-CommandLine-2 | `CONFIG_CMDLINE`          | `"insert kernel command line here"`
Kernel-Consoles-CommandLine-3 | `CONFIG_CMDLINE_OVERRIDE` | `y`

Domain                 | `Config` name | `Value`
---------------------- | ------------- | -------
Kernel-Consoles-KDBG-1 | `CONFIG_KGDB` | `n`

Domain                  | `Config` name        | `Value`
----------------------- | -------------------- | -------
Kernel-Consoles-SysRQ-1 | `CONFIG_MAGIC_SYSRQ` | `n`

Domain                         | `Config` name        | `Value`
------------------------------ | -------------------- | -------
Kernel-Consoles-BinaryFormat-1 | `CONFIG_BINFMT_MISC` | `n`

Domain                 | `Config` name       | `Value`
---------------------- | ------------------- | -------
Kernel-Debug-Symbols-1 | `CONFIG_DEBUG_INFO` | `n`

Domain                 | `Config` name    | `Value`
---------------------- | ---------------- | -------
Kernel-Debug-Kprobes-1 | `CONFIG_KPROBES` | `n`

Domain                 | `Config` name   | `Value`
---------------------- | --------------- | -------
Kernel-Debug-Tracing-1 | `CONFIG_FTRACE` | `n`

Domain                   | `Config` name      | `Value`
------------------------ | ------------------ | -------
Kernel-Debug-Profiling-1 | `CONFIG_OPROFILE`  | `n`
Kernel-Debug-Profiling-2 | `CONFIG_PROFILING` | `n`

Domain                   | `Config` name             | `Value`
------------------------ | ------------------------- | -------
Kernel-Debug-OOPSOnBUG-1 | `CONFIG_DEBUG_BUGVERBOSE` | `n`

Domain             | `Config` name         | `Value`
------------------ | --------------------- | -------
Kernel-Debug-Dev-1 | `CONFIG_DEBUG_KERNEL` | `n`
Kernel-Debug-Dev-2 | `CONFIG_EMBEDDED`     | `n`

Domain                    | `Config` name     | `Value`
------------------------- | ----------------- | -------
Kernel-Debug-FileSystem-1 | `CONFIG_DEBUG_FS` | `n`

Domain             | `Config` name | `Value`
------------------ | ------------- | -------
Kernel-Debug-BUG-1 | `CONFIG_BUG`  | `n`

Domain                   | `Config` name     | `Value`
------------------------ | ----------------- | -------
Kernel-Debug-CoreDumps-1 | `CONFIG_COREDUMP` | `n`

Domain                       | `File` name                      | `Value`
---------------------------- | -------------------------------- | -------
Kernel-Debug-AdressDisplay-1 | `/proc/sys/kernel/kptr_restrict` | `1`

Domain                       | `File` or `Directorie` name | _State_
---------------------------- | --------------------------- | -----------------------------
Kernel-Debug-AdressDisplay-1 | `/boot/vmlinuz*`            | _Readable Only for root user_
Kernel-Debug-AdressDisplay-2 | `/boot/System.map*`         | _Readable Only for root user_
Kernel-Debug-AdressDisplay-3 | `/sys/kernel/debug/`        | _Readable Only for root user_
Kernel-Debug-AdressDisplay-4 | `/proc/slabinfo`            | _Readable Only for root user_

Domain               | `File` name                       | `Value`
-------------------- | --------------------------------- | -------
Kernel-Debug-DMESG-1 | `/proc/sys/kernel/dmesg_restrict` | `1`

Domain                | `Config` name     | `Value`
--------------------- | ----------------- | -------
Kernel-Debug-Config-1 | `CONFIG_IKCONFIG` | `n`

Domain                   | `Config` name   | `Value`
------------------------ | --------------- | -------
Kernel-FileSystems-NFS-1 | `CONFIG_NFSD`   | `n`
Kernel-FileSystems-NFS-2 | `CONFIG_NFS_FS` | `n`

Domain                     | `Partition`         | `Value`
-------------------------- | ------------------- | -----------------------------------------------------------------
Kernel-FileSystems-Mount-1 | `/boot`             | `nosuid`, `nodev` and `noexec`.
Kernel-FileSystems-Mount-2 | `/var` & `/tmp`     | In `/etc/fstab` or `vfstab`, add `nosuid`, `nodev` and `noexec`.
Kernel-FileSystems-Mount-3 | _Non-root local_    | If type is `ext2` or `ext3` and mount point not '/', add `nodev`.
Kernel-FileSystems-Mount-4 | _Removable storage_ | Add `nosuid`, `nodev` and `noexec`.
Kernel-FileSystems-Mount-5 | _Temporary storage_ | Add `nosuid`, `nodev` and `noexec`.
Kernel-FileSystems-Mount-6 | `/dev/shm`          | Add `nosuid`, `nodev` and `noexec`.
Kernel-FileSystems-Mount-7 | `/dev`              | Add `nosuid` and `noexec`.

Domain                     | `Config` name           | _State_ or `Value`
-------------------------- | ----------------------- | -----------------------------------------------------------------------
Kernel-FileSystems-Mount-1 | `CONFIG_DEVTMPFS_MOUNT` | _Disabled_ or add remount with `noexec` and `nosuid` to system startup.

Domain             | `Label` name | Recommendations
------------------ | ------------ | -----------------------------------------------------------
Kernel-MAC-Floor-1 | `^`          | Only for privileged system services.
Kernel-MAC-Floor-2 | `*`          | Used for device files or `/tmp` Access restriction via DAC.

Domain              | `Label` name     | Recommendations
------------------- | ---------------- | -------------------------------------------------------------------------------------------------------------
Kernel-MAC-System-1 | `System`         | Process should write only to file with transmute attribute.
Kernel-MAC-System-2 | `System::run`    | Files are created with the directory label from user and system domain (transmute) Lock is implicit with `w`.
Kernel-MAC-System-3 | `System::Shared` | Files are created with the directory label from system domain (transmute) User domain has locked privilege.
Kernel-MAC-System-4 | `System::Log`    | Some limitation may impose to add `w` to enable append.
Kernel-MAC-System-5 | `System::Sub`    | Isolation of risky Subsystem.

Domain              | `Label` name        | Recommendations
------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------
Kernel-MAC-System-1 | `User::Pkg::$AppID` | Only one Label is allowed per App. A data directory is created by the AppFw in `rwx` mode.
Kernel-MAC-System-2 | `User::Home`        | AppFw needs to create a directory in `/home/$USER/App-Shared` at first launch if not present with label app-data access is `User::App-Shared` without transmute.
Kernel-MAC-System-3 | `User::App-Shared`  | Shared space between all App running for a given user.

Domain             | Object         | Recommendations
------------------ | -------------- | ------------------------------------
Platform-SystemD-1 | Security model | Use Namespaces for containerization.
Platform-SystemD-2 | Security model | Use CGroups to organise processes.

Domain          | Object         | Recommendations
--------------- | -------------- | ------------------------------------
Platform-DBus-1 | Security model | Use D-Bus as IPC.
Platform-DBus-2 | Security model | Apply D-BUS security patches: [D-Bus CVE](https://www.cvedetails.com/vulnerability-list/vendor_id-13442/D-bus-Project.html)

Domain               | `Tool` name | _State_
-------------------- | ----------- | -------
Platform-Utilities-1 | `connman`   | _Used_ as a connection manager.
Platform-Utilities-2 | `bluez`     | _Used_ as a Bluetooth manager.
Platform-Utilities-3 | `gstreamer` | _Used_ to manage multimedia file format.
Platform-Utilities-4 | `alsa`      | _Used_ to provides an API for sound card device drivers.

Domain                 | Object         | Recommendations
---------------------- | -------------- | --------------------------------
Platform-AGLFw-AppFw-1 | Security model | Use the AppFw as Security model.

Domain                  | Object      | Recommendations
----------------------- | ----------- | -------------------------------------
Platform-AGLFw-Cynara-1 | Permissions | Use Cynara as policy-checker service.

Domain               | `Tool` name | _State_
-------------------- | ----------- | ----------------------------------------------------------------------
Platform-Utilities-1 | `busybox`   | _Used_ to provide a number of tools. Do not compile development tools.

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

Domain                | Object           | Recommendations
--------------------- | ---------------- | -----------------------------------------------------
Platform-Users-root-1 | Main application | Should not execute as root.
Platform-Users-root-2 | UI               | Should run in a context on a user with no capability.

Domain                | `Utility` name | _State_
--------------------- | -------------- | -------------
Platform-Users-root-3 | `login`        | _Not allowed_
Platform-Users-root-4 | `su`           | _Not allowed_
Platform-Users-root-5 | `ssh`          | _Not allowed_
Platform-Users-root-6 | `scp`          | _Not allowed_
Platform-Users-root-7 | `sftp`         | _Not allowed_

Domain                     | Object    | Recommendations
-------------------------- | --------- | -----------------------------------------------------------------------
Application-Installation-1 | AppFw     | Provide offline-mode in order to install app with the base image.
Application-Installation-2 | Integrity | Allow the installation of applications only if their integrity is good.

Domain                             | Tech name | Recommendations
---------------------------------- | --------- | --------------------------------------------------------------------------
Connectivity-BusAndConnector-Bus-1 | CAN       | Implement hardware solution in order to prohibit sending unwanted signals.

Domain                                    | Tech name | Recommendations
----------------------------------------- | --------- | ----------------------------------------------------------------------
Connectivity-BusAndConnector-Connectors-1 | USB       | Must be disabled. If not, only enable the minimum require USB devices.
Connectivity-BusAndConnector-Connectors-2 | USB       | Confidential data exchanged with the ECU over USB must be secure.
Connectivity-BusAndConnector-Connectors-3 | USB       | USB Boot on a ECU must be disable.
Connectivity-BusAndConnector-Connectors-4 | OBD-II    | Must be disabled outside garages.

Domain                  | Object | Recommendations
----------------------- | ------ | ------------------------------------------------------------------
Connectivity-Wireless-1 | Update | Always follow the latest updates of remote communication channels.

Domain                       | Tech name or object | Recommendations
---------------------------- | ------------------- | -------------------------------------------------------------------------
Connectivity-Wireless-Wifi-1 | WEP, PSK, TKIP      | Disabled
Connectivity-Wireless-Wifi-2 | WPA2 and AES-CCMP   | Used
Connectivity-Wireless-Wifi-3 | WPA2                | Should protect data sniffing.
Connectivity-Wireless-Wifi-4 | PSK                 | Changing regularly the password.
Connectivity-Wireless-Wifi-5 | Device              | Upgraded easily in software or firmware to have the last security update.

Domain                            | Tech name     | Recommendations
--------------------------------- | ------------- | ------------------------------------------------------------
Connectivity-Wireless-Bluetooth-1 | BLE           | Use with caution.
Connectivity-Wireless-Bluetooth-2 | Bluetooth     | Monitoring
Connectivity-Wireless-Bluetooth-3 | SSP           | Avoid using the "Just Works" association model.
Connectivity-Wireless-Bluetooth-4 | Visibility    | Configured by default as undiscoverable. Except when needed.
Connectivity-Wireless-Bluetooth-5 | Anti-scanning | Used, inter alia, to slow down brute force attacks.

Domain                           | Tech name | Recommendations
-------------------------------- | --------- | --------------------------
Connectivity-Wireless-Cellular-1 | GPRS/EDGE | Avoid
Connectivity-Wireless-Cellular-2 | UMTS/HSPA | Protected against Jamming.

Domain                        | Tech name | Recommendations
----------------------------- | --------- | --------------------------------------------
Connectivity-Wireless-Radio-1 | RDS       | Only audio output and meta concerning radio.

Domain                      | Tech name | Recommendations
--------------------------- | --------- | ------------------------------------------------------
Connectivity-Wireless-NFC-1 | NFC       | Protected against relay and replay attacks.
Connectivity-Wireless-NFC-2 | Device    | Disable unneeded and unapproved services and profiles.

Domain                       | Object         | Recommendations
---------------------------- | -------------- | --------------------------------------
Application-Cloud-Download-1 | authentication | Must implement authentication process.
Application-Cloud-Download-2 | Authorization  | Must implement Authorization process.

Domain                             | Object        | Recommendations
---------------------------------- | ------------- | ----------------------------------------------------------
Application-Cloud-Infrastructure-1 | Packet        | Should implement a DPI.
Application-Cloud-Infrastructure-2 | DoS           | Must implement a DoS protection.
Application-Cloud-Infrastructure-3 | Test          | Should implement scanning tools like SATS and DAST.
Application-Cloud-Infrastructure-4 | Log           | Should implement security tools (IDS and IPS).
Application-Cloud-Infrastructure-5 | App integrity | Applications must be signed by the code signing authority.

Domain                        | Object                                    | Recommendations
----------------------------- | ----------------------------------------- | ---------------------------------
Application-Cloud-Transport-1 | Integrity, confidentiality and legitimacy | Should implement IPSec standards.

Domain        | Object                                    | Recommendations
------------- | ----------------------------------------- | ---------------
Update-FOTA-1 | Integrity, confidentiality and legitimacy | Must be secure.

<!-- endconfig -->
