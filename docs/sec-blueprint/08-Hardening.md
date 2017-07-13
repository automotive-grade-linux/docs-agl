---

title : System Hardening
date  : 2017-05-23
categories: security, hardening, automotive
tags: security, hardening, architecture, automotive, linux
layout: techdoc 
 
---

**Table of Content**

1. TOC
{:toc}

# Overview

## Scope

The information contained in this document is applicable to systems based
on Automotive Grade Linux.

## Limitations

* This document is based on knowledge and research gained from looking
  at security desktop and server versions of Linux as well as Android
  exploits and hardening.

* Some kernel configuration options can have an impact on performance.  
  This will be noted where applicable.­

## Document Structure

This document has been divided into three sections; REQUIREMENTS,
RECOMMENDATIONS, and VALIDATION. The REQUIREMENTS section details
explicit requirements that must be adhered to for the embedded
device.  
The RECOMMENDATIONS section details best practices, and some
recommended security settings for the embedded device.   
The third section, VALIDATION, provides reference scripts and test procedures that
can be used to verify adherence with the REQUIREMENTS detailed in the
first section of this guide.

## Hardening

The term *Hardening* refers to the tools, techniques and processes
required in order to reduce the attack surface on an embedded system,
such as an embedded control unit (ECU) or other managed device.  
The target for all hardening activities is to prevent the execution of
invalid binaries on the device, and to prevent copying of security
related data from the device.  
There are three main areas of focus for hardening an embedded device:

**Boot Hardening**: Steps/requirements to configure the boot sequence,
in order to restrict the device from executing anything other than the
approved software image.

**System Hardening**: Best practices associated with the configuration
of an embedded Linux based operating system. This section includes both
hardening of the kernel itself, as well as specific configurations and
patches used to protect against known vulnerabilities within the build
and configuration of the root filesystem.

**Application Hardening:** Best practices to apply to the build and
release of user space applications, in order to reduce the number of
attack surfaces used by potential attackers.

## Secure Boot Software Flow Steps

1. After power on, the processor will perform the verification
  of the Stage 1 boot image, the stage 2 boot image and the Secure
  loader image.

  a.  If any of the images fail the verification process the device
    will not boot.

1. Upon successful verification of all of the boot and loader images,
    the secure process will initiate the Stage 1 boot process.

1. The Stage 1 boot process will perform processor initialization, and
  then initiate the Stage 2 boot process.

1. The Stage 2 boot process will initiate the Secure Loader, which will
  process any customer specific customizations (e.g. front panel
  of ECU, USB based image updates, etc).

1. The Secure Loader will check to determine if there are any updates
  to be processed. If the update settings indicate that an upgrade
  should occur then the Secure Loader will will determine the correct
  action based on the nature of the upgrades:

    a.  If the Secure Loader determines that an upgrade was performed
        (or attempted), it will initiate the reboot process.

    b.  If no upgrades were processed: then the Secure Loader will pass
        control back to the Stage 2 boot process for further processing

1. The Stage 2 boot process will continue with the boot process, by
    performing a verification of the kernel image prior to the load of
    that image

    a.  If the kernel image verification fails, the Stage 2 boot loader
        will not boot

1. The Stage 2 boot loader will load the successfully verified kernel
  and boot the linux OS

1. The booted Linux OS will perform the normal Linux init sequence

1. The Linux init process will start the required applications and
  services as described in the init process and present on the rootfs.

## Requirements

  For the purposes of reference and explanation, we are providing guidance
  on how to configure an embedded device that runs with a linux 3. 10.17
  Linux kernel, and includes the use of U-Boot as the *Stage 2*
  These requirements must still be met by manufacturers that
  opt to build using an alternative version of the Linux kernel.

## Hardened Boot

### Boot image selection

The boot process shall be uninterruptable and shall irrevocably boot the
image as specified in the boot environment.

In U-Boot set the “**bootdelay**” environment variable and/or define
CONFIG\_BOOTDELAY to -2.

### Verifying Authenticity of booting image

It shall not be possible to boot from an unverified image.

The secure boot feature in U-Boot shall be enabled. The secure boot
feature is available from U-Boot 2013.07 version.

To enable the secure boot feature, enable the following features:

```bash
CONFIG_FIT: enables support for Flat Image Tree (FIT) uImage format.
CONFIG_FIT_SIGNATURE: enables signature verification of FIT images.
CONFIG_RSA: enables RSA algorithm used for FIT image verifitcation.
CONFIG_OF_CONTROL: enables Flattened Device Tree (FDT) configuration.
CONFIG_OF_SEPARATE: enables separate build of u-Boot from the device tree.
CONFIG_DEFAULT_DEVICE_TREE: specifies the default Device Tree used for the
run-time configuration of U-Boot.
```

Generate the U-Boot image with public keys to validate and load the
image. It shall use RSA2048 and SHA256 for authentication.

### Disable USB support

To disable USB support in U-Boot, following configs shall not be
defined:

```bash
CONFIG_CMD_USB: enables basic USB support and the usb command
CONFIG_USB_UHCI: defines the lowlevel part.
CONFIG_USB_KEYBOARD: enables the USB Keyboard
CONFIG_USB_STORAGE: enables the USB storage devices
CONFIG_USB_HOST_ETHER: enables USB ethernet adapter support
```

### Console / Remote Access

Serial console output shall be disabled. To disable console output in
U-Boot, set the following macros:

```bash
CONFIG_SILENT_CONSOLE
CONFIG_SYS_DEVICE_NULLDEV
CONFIG_SILENT_CONSOLE_UPDATE_ON_RELOC
```

and set “***silent”*** environment variable.

For the Secure loader, disable the traces by undefining the below macro

```bash
INC_DEBUG_PRINT
```

For sboot proper configuration needs to be done to disable the serial
console.

### Field upgrades

Field upgrades can be achieved securely by using a Secure Loader.
This loader will authenticate an incoming image (USB,Serial, Network)
prior to writing it to the flash memory on the device. It should not be
possible to write to flash from bootloader (U-Boot). Note that because
 USB support is to be disabled within the sboot/U-Boot code, the board
specific implementation of the Secure Loader will have to manage the
entire USB initialization, enumeration, and read/write access to the
mass storage device.

### Disable USB, Serial, Docsis support

Disable USB support in sboot. In addition, disable unnecessary communication
modes like Ethernet, Serial ports, DOCSIS in U-Boot and sboot that are
not necessary.

### Immutable Environment variables

In U-Boot, ensure Kernel command line, boot commands, boot delay and
other environment variables are immutable. This will prevent
side-loading of alternate images, by restricting the boot selection to
only the image in FLASH.

The environment variables shall be part of text region in U-Boot as
default environment variable and not in non-volatile memory.

Remove configuration options related to non-volatile memory such as:

```bash
#define CONFIG_ENV_IS_IN_MMC
#define CONFIG_ENV_IS_IN_EEPROM
#define CONFIG_ENV_IS_IN_FLASH
#define CONFIG_ENV_IS_IN_DATAFLASH
#define CONFIG_ENV_IS_IN_MMC
#define CONFIG_ENV_IS_IN_FAT
#define CONFIG_ENV_IS_IN_NAND
#define CONFIG_ENV_IS_IN_NVRAM
#define CONFIG_ENV_IS_IN_ONENAND
#define CONFIG_ENV_IS_IN_SPI_FLASH
#define CONFIG_ENV_IS_IN_REMOTE
#define CONFIG_ENV_IS_IN_UBI
```

and include the following definition:

```bash
#define** CONFIG_ENV_IS_NOWHERE
```

## Kernel Hardening

  The following sub-sections contain information on various kernel
  configuration options to enhance the security measures in the kernel
  and also for applications compiled to take advantage of these security
  features.  
  Additionally, there are also configuration options that
  close known vulnerable configuration options.  
  Here’s a high level summary of various kernel configurations that 
  shall be required for deployment.

### Disable the serial console

  The serial console should be disabled to prevent an attacker from
  accessing this powerful interface.

```bash
  CONFIG_SERIAL_8250=n
  CONFIG_SERIAL_8250_CONSOLE=n
  CONFIG_SERIAL_CORE=n
  CONFIG_SERIAL_CORE_CONSOLE=n
```

### Restrict access to kernel memory through device file

  The /dev/kmem file in Linux systems is directly mapped to kernel
  virtual memory.  
  This can be disastrous if an attacker gains root
  access, as the attacker would have direct access to kernel virtual
  memory.

  To disable the /dev/kmem file, which is very infrequently used by
  applications, the following kernel option should be set in the
  compile-time kernel configuration:

```bash
  CONFIG_DEVKMEM=n
```

  In case applications in userspace need /dev/kmem support, it should be
  available only for authenticated applications.

### Bake-in the kernel command-line

  The kernel command-line is used to control many aspects of the booting
  kernel, and is prone to tampering as they are passed in RAM with
  little to no reverse validation on these parameters.  
  To prevent this type of attack, the kernel shall be configured to ignore command line
  arguments, and use pre-configured (compile time) options instead.

  Set the kernel command line in the CONFIG\_CMDLINE KConfig item and
  then pass no arguments from the bootloader.

```bash
  CONFIG_CMDLINE_BOOL=y
  CONFIG_CMDLINE=”insert kernel command line here”
  CONFIG_CMDLINE_OVERRIDE=y
```

  It is recommended that any per-device settings (eg. MAC addresses,
  serial numbers, etc.) be stored and accessed from read-only memory (or
  files), and that any such parameters be verified (signature checking)
  prior to their use.

### Disable kernel debug symbols

  Debug symbols should always be removed from production kernels as they
  provide a lot of information to attackers.

```bash
  CONFIG_DEBUG_INFO=n
```

  These kernel debug symbols are enabled by other config items in the
  kernel.  
  Care should be taken to disable those also.  
  If CONFIG\_DEBUG\_INFO cannot be disabled then enabling
  CONFIG\_DEBUG\_INFO\_REDUCED is second best.

### Disable access to a kernel core dump

  This kernel configuration disables access to a kernel core dump from
  user space -- if enabled it gives attackers a useful view into kernel
  memory.

```bash
  CONFIG_PROC_KCORE=n
```

### Disable KGDB

  The Linux kernel supports KGDB over USB and console ports. These
  mechanisms are controlled by the kgdbdbgp and kgdboc kernel
  command-line parameters.  
  It is important to ensure that no shipping
  product contains a kernel with KGDB compiled-in.

```bash
  CONFIG_KGDB=n
```

### Disable Kprobes

  Kprobes enables you to dynamically break into any kernel routine and
  collect debugging and performance information non-disruptively.  
  You can trap at almost any kernel code address, specifying a handler
  routine to be invoked when the breakpoint is hit.

```bash
  CONFIG_KPROBES=n
```

### Disable Tracing

  FTrace enables the kernel to trace every kernel function.  
  Providing kernel trace functionality would assist an attacker in discovering attack vectors.

```bash
  CONFIG_FTRACE=n
```

### Disable Profiling

  Profiling and OProfile enables profiling the whole system, include the kernel,
  kernel modules, libraries, and applications.  
  Providing profiling functionality
  would assist an attacker in discovering attack vectors.

```bash
  CONFIG_OPROFILE=n
  CONFIG_PROFILING=n
```

### Disable magic sysrq support

  On a few architectures, you can access a powerful debugger interface
  from the keyboard.  
  The same powerful interface can be present on the serial console 
  – responding to serial break – of Linux on other architectures.  
  Disable to avoid potentially exposing this powerful backdoor.

```bash
  CONFIG_MAGIC_SYSRQ=n
```

### Disable OOPS print on BUG()

  The output from OOPS print can be helpful in Return Oriented
  Programming (ROP) when trying to determine the effectiveness of an
  exploit.

```bash
  CONFIG_DEBUG_BUGVERBOSE=n
```

### Disable kexec

  This prevents someone who gets root from supplanting the kernel.  
  This can be used as a way to bypass signed kernels.

```bash
  CONFIG_KEXEC=n
```

### Disable kernel IP autoconfiguration

  It is preferable to have IP configuration performed using a user-space
  tool as these tend to have more validation.  
  We do not want the network
  interface coming up until the system has come up properly.

```bash
  CONFIG_IP_PNP=n
```

### Disable /proc/config.gz

  It is extremely important to not expose the kernel configuration used
  on a production device to a potential attacker.  
  With access to the
  kernel config, it could be possible for an attacker to build a custom
  kernel for the device that may disable critical security features.

```bash
  CONFIG_IKCONFIG=n
```

### Disable swap

  If not disabled, attackers can enable swap at runtime, add pressure to
  the memory subsystem and then scour the pages written to swap for
  useful information.

```bash
  CONFIG_SWAP=n
```

### Disable NFS file system

  While often enabled in development, when left enabled in production
  builds this can be a very useful way for an attacker to get files onto
  and off of an STB.

```bash
  CONFIG_NFSD=n
  CONFIG_NFS_FS=n
```

### Disable support for binary formats other than ELF

  This will make possible to plug wrapper-driven binary formats into
  the kernel.  
  It enables support for binary formats other than ELF.  
  Providing the ability to use alternate interpreters would assist an attacker in
  discovering attack vectors

```bash
  CONFIG_BINFMT_MISC=n
```

### Disable “Load All Symbols”

  There is a /proc/kallsyms file which exposes the kernel memory space
  address of many kernel symbols (functions, variables, etc.).  
  This information is useful to attackers in identifying kernel
  versions/configurations and in preparing payloads for exploits of
  kernel space.

  Both KALLSYMS\_ALL and KALLSYMS shall be disabled;

```bash
  CONFIG_KALLSYMS=n
  CONFIG_KALLSYMS_ALL=n
```

### Disable Kernel Debugging

  There are development-only branches of code in the kernel enabled by
  the DEBUG\_KERNEL conf.  
  This should be disabled to compile-out these branches.

```bash
  CONFIG_DEBUG_KERNEL=n
```

  In some kernel versions, disabling this requires also disabling
  CONFIG\_EMBEDDED, and CONFIG\_EXPERT Disabling CONFIG\_EXPERT makes it
  impossible to disable \_COREDUMP, DEBUG\_BUGVERBOSE, \_NAMESPACES,
  \_KALLSYMS and \_BUG.  
  In which case it is better to leave this enabled
  than enable the others.

### Disable the kernel debug filesystem

  The kernel debug filesystem presents a lot of useful information and
  means of manipulation of the kernel to an attacker.

```bash
  CONFIG_DEBUG_FS=n
```

### Disable BUG() support

  The kernel will display backtrace and register information for BUGs
  and WARNs in kernel space, making it easier for attackers to develop
  exploits.

```bash
  CONFIG_BUG=n
```

### Disable Sysctl syscall support

  Enabling this will result in code being included that is hard to
  maintain and not well tested.

```bash
  CONFIG_SYSCTL_SYSCALL=n
```

### Kernel Modules

### Disable module unloading

  This stops an attacker unloading security focused kernel modules.  
  It will also prevent the attacker from removing evidence of any attempted
  kernel tampering that may have been initiated by loading of a kernel
  module.

```bash
  CONFIG_MODULE_UNLOAD=n
```

### Disable Forced Module Loading

  If enabled, then modules without version information or with
  mismatched version information may be forcibly loaded into the kernel.  
  Disabling this configuration forces the attackers to build modules
  with matched kernel sources and configuration in order to load them.

```bash
  CONFIG_MODULE_FORCE_LOAD=n
```

### System Services

#### Console & Remote Access

* The kernel console interfaces shall be disabled. Do not pass any statements
  of the following kind (e.g. console=ttyS0 console=tty0) on the kernel
  command line. All of the console=&lt;interface&gt; statements should be
  stripped and removed from the kernel command line.
* The telnet server shall be disabled.
* Do not start telnetd in init scripts.
* Remove telnetd from the root file system.
* Root login access via the console shall be disabled.
* Do not run shell or getty on /dev/ttySx or /dev/console from
  init scripts.
* Root login access through remote access such as SSH shall
  be disabled or completely removed

#### Disable *sudo* for other users

  Remove the /etc/sudoers file from the root file system
 
  Remove the sudo command from the root file system.

#### Mount /tmp file system as noexec

  A lot of malware can be stopped by not allowing files located in /tmp
  to execute.
 
  The /etc/fstab file should contain a line for the /tmp directory with
  the noexec mount option set as follows:
 
  tmpfs /tmp tmpfs noexec 0 0

#### User Account Management

All user accounts shall have strong, non-default passwords.  
A strong password is described to have all of the following attributes:

* At least one upper-case letter

* At least one numeric character

* At least one lower-case letter

* Password shall be eight or more characters in length

* Shall not use a known, common pattern (e.g. Xxxxxxx\#
  or Xxxxxxx\#\#)

#### Remove known insecure services

  The following legacy services are inherently insecure and should be
  avoided:
 
* rlogind

* rshd

* rcmd

* rexecd

* rbootd

* rquotad

* rstatd

* rusersd

* rwalld

* rhosts

* rexd
 
  These services offer insufficient authentication, no encryption, and
  are not considered secure. They shall be removed along with their
  configuration files.

### The mtd-utils shall not be present on the file system

  The mtd-utils binary package (also known as the Memory Technology
  Device Utilities package) contains a collection of executable binaries
  that allow a user to perform operations on raw flash devices. Here’s a
  non-exhaustive sample of commonly used utilities that are part of the
  mtd-utils package:

* flash\_erase

* flash\_eraseall

* flashcp

* flash\_lock

* flash\_otp\_dump

* flash\_otp\_info

* flash\_unlock

* mkfs.jffs2

* mkfs.ubifs

* nanddump

* nandtest

* nandwrite

* ubiattach

* ubicrc32

* ubidetach

* ubiformat

* ubimkvol

* ubinfo

* ubinize

* ubirename

* ubirmvol

* ubirsvol

* ubiupdatevol

  The mtd-utils package as a whole (including all of its executable
  binaries) shall not be present on the file system. Including these
  binaries on the file system will facilitate an attacker’s ability to
  read, write or otherwise gather information about raw flash devices
  present on the system.

### Debuggers shall not be present on the file system

  No debuggers shall be present on the file system. This includes, but
  is not limited to, the GNU Debugger client/server (commonly known in
  their short form names such as the gdb and gdbserver executable
  binaries respectively), or the LLDB next generation debugger.
  Including these binaries as part of the file system will facilitate an
  attacker’s ability to reverse engineer and debug (either locally or
  remotely) any process that is currently executing on the device.

### Partition Mount Options 

  There are several security restrictions that can be set on a
  filesystem when it is mounted. Some common security options include,
  but are not limited to:
 
  nosuid - Do not allow set-user-identifier or set-group-identifier bits
  to take effect
 
  nodev - Do not interpret character or block special devices on the
  filesystem
 
  noexec - Do not allow execution of any binaries on the mounted
  filesystem
 
  ro - Mount filesystem as read-only
 
  The following flags shall be used for mounting common filesystems:

|  Partition                   | Notes                                                                                       |
|------------------------------|---------------------------------------------------------------------------------------------|
| /boot                        | Use nosuid and nodev and consider using noexec.                                             |
| /var & /tmp                  | In the /etc/fstab or vfstab file, add nosuid, nodev and noexec.                             |
| Non-Root local partitions    | If the filesystem type is ext2 or ext3 and the mount point is not '/', add the nodev option.|
| Removable storage partitions | Add nodev, nosuid, and noexec options.                                                      |
| Temporary storage partitions | Add nodev, nosuid, and noexec options.                                                      |
| /dev/shm                     | Add nodev, nosuid, and noexec options.                                                      |
| /dev                         | Add nosuid, noexec options.\                                                                |
|                              | Note: if CONFIG\_DEVTMPFS\_MOUNT is set then the kernel will mount /dev and will not apply  |
|                              | the nosuid, noexec options. Either disable CONFIG\_DEVTMPFS\_MOUNT or add a remount with    |
|                              | noexec and nosuid options to system startup.                                                |

## Recommendations

The following sections detail best practices that should be applied in
order to secure a device.  
Although they are not currently listed as hard
requirements, they may be upgraded to requirements status in the future.
In addition, specific operators may change some of these recommendations
into requirements based on their specific needs and objectives.

### Hardened Boot

The boot loader consists of the Primary boot loader residing in OTP
memory, sboot, U-Boot and Secure loader residing in external flash (NAND
or SPI/NOR flash memory). The CPU on power on or reset executes the
primary boot loader. The OTP primary boot loader makes the necessary
initial system configuration and then loads the secondary boot loader
sboot from external flash memory to ram memory. The sboot then loads the
U-Boot along with the Secure loader. U-Boot then verifies and loads the
Kernel/system image before passing control to it.

### Removal of memory dump commands

In U-Boot, following commands shall be disabled to avoid memory dumps

```bash
md : Memory Display command

mm : Memory modify command – auto incrementing address

nm : Memory modify command – constant address

mw : memory write

cp : memory copy

mwc : memory write cyclic

mdc : memory display cyclic

mtest : simple ram read/write test

loopw : infinite write loop on address range
```

Similarly memory dump support shall be disabled from sboot

### Disable flash access

In U-Boot following flash memory commands shall be disabled:

Nand: Support for nand flash access available through **do\_nand** has
to be disabled.

Similarly sboot should disable flash access support through command line
if any.

## Hardened System

### Network

#### Disable all Network Interfaces

  Preferably no network interface is allowed, but if required, then the
  enabled services should be restricted to only those described in the
  STB’s functional description.

### Remove or Disable Unnecessary Services, Ports, and Devices

  Services and utilities that do not have a defined purpose on a system
  should be removed. If removal is not possible, but the service or
  utility can be disabled, then it should be disabled. If a service or
  utility is necessary, available secure configuration best practices
  should be implemented.
 
  Telnet, FTP, and NFS have security weaknesses that are well known;
  however, customers may have requirements to use these services. If
  remote shell access and file transfer are required, then provide more
  secure options, such as SSH and SFTP/SCP.

### Restrict USB Ports

  Linux Kernel support for USB should be compiled-out if not required.
  If it is needed, the Linux Kernel should be configured to only enable
  the minimum required USB devices.
 
  User-initiated USB-filesystems should be treated with special care..
 
  Whether or not the filesystems are mounted in userspace(FUSE), restricted
  mount options should be observed.

## Kernel Hardening

  The following sub-sections contain information on various kernel
  configuration options that will require updating to a newer kernel
  version in order to enhance the security measures in the kernel and
  also for applications compiled to take advantage of these security
  features.  

  Additionally, there are also configuration options that close known
  vulnerable configuration options.  
  Here’s a high level summary of the
  various kernel configurations and which kernel version they pertain:

|  Kernel Configuration                 | Kernel Version |
|---------------------------------------|----------------|
|  CONFIG\_UNIX\_DIAG=n                 |3.3+            |
|  CROSS\_MEMORY\_ATTACH=n              |3.5+            |
|  CONFIG\_PANIC\_ON\_OOPS=y            |3.5+            |
|  CONFIG\_COREDUMP=n                   |3.7+            |
|  CONFIG\_MODULE\_SIG\_FORCE=y         |3.7+            |
|  CONFIG\_PACKET\_DIAG=n               |3.7+            |
|  CONFIG\_FW\_LOADER\_USER\_HELPER=n   |3.9+            |
|  CONFIG\_CC\_STACKPROTECTOR=y         |3.11+           |
|  CONFIG\_USELIB=n                     |3.15+           |
|  BPF\_JIT=n                           |3.16+           |
|  CONFIG\_DEVMEM=n                     |4.0+            |

### Build with Stack Protection

  Similar to the stack protector used for ELF programs in user-space,
  the kernel can protect its internal stacks as well.  
  This configuration is supported in Linux 3.11 and greater and
  thus should only be enabled for such versions.  
  This configuration also
  requires building the kernel with the gcc compiler 4.2 or greater.

```bash
  CONFIG_CC_STACKPROTECTOR=y
```

### Disable access to /dev/mem

  The /dev/mem file in Linux systems is directly mapped to physical
  memory.  
  This can be disastrous if an attacker gains root access, as
  the attacker would have direct access to physical memory through this
  convenient device file.  
  It may not always be possible to disable such
  file, as some applications might need such support.  
  In that case then
  this device file should be available only for authenticated
  applications.  
  This configuration is supported in Linux 4.0 and greater
  and thus should only be disabled for such versions.

```bash
  CONFIG_DEVMEM=n
```

### Disable cross-memory attach

  Disable the process\_vm\_\*v syscalls which allow one process to
  peek/poke the virtual memory of another.  
  This configuration is
  supported in Linux 3.5 and greater and thus should only be disabled
  for such versions.

```bash
  CROSS_MEMORY_ATTACH=n
```

### Disable core dumps

  Core dumps provide lot of debug information for hackers.  
  So disabling core dumps is recommended in production builds.  
  This configuration is
  supported in Linux 3.7 and greater and thus should only be disabled
  for such versions.

```bash
  CONFIG_COREDUMP=n
```

### Disable Legacy Linux Support

  There are some Kernel Configs which are present only to support legacy
  binaries.  
  See also section 2.2.2.18 for disabling support for legacy binary formats.  
  The uselib system call, in particular, has no valid use in any libc6 or uclibc system in recent times.  
  This configuration is supported in Linux 3.15 and greater and thus should only be
  disabled for such versions.

```bash
  CONFIG_USELIB=n
```

### Disable firmware auto-loading user mode helper

  The firmware auto loading helper, which is a utility executed by the
  kernel on hotplug events requiring firmware, needs to be set setuid.  
  As a result of this, the helper utility is an attractive target for
  attackers with control of physical ports on the device.  
  Disabling this configuration is supported in Linux 3.9 and greater.

```bash
  CONFIG_FW_LOADER_USER_HELPER=n
```

### Enable Kernel Panic on OOPS

  When fuzzing the kernel or attempting kernel exploits attackers are
  likely to trigger kernel OOPSes.  
  Setting the behavior on OOPS to PANIC can impede their progress.  
  This configuration is supported in Linux 3.5 and greater and thus should only be enabled for such versions.

```bash
  CONFIG_PANIC_ON_OOPS=y
```

### Disable socket monitoring interface

  These monitors can be used to inspect shared file descriptors on Unix
  Domain sockets or traffic on ‘localhost’ which is otherwise assumed to
  be confidential.  
  The **CONFIG\_PACKET\_DIAG** configuration is supported in Linux 3.7 and greater and thus should only be disabled
  for such versions.  
  The **CONFIG\_UNIX\_DIAG** configuration is
  supported in Linux 3.3 and greater and thus should only be disabled
  for such versions.

```bash
  CONFIG_PACKET_DIAG=n
  CONFIG_UNIX_DIAG=n
```

### Disable BPF JIT

  The BPF JIT can be used to create kernel-payloads from firewall table
  rules.  
  This configuration for is supported in
  Linux 3.16 and greater and thus should only be disabled for such
  versions.

```bash
  BPF_JIT=n
```

### Enable Enforced Module Signing

  This configuration is supported in Linux 3.7 and greater and thus
  should only be enabled for such versions.

```bash
  CONFIG_MODULE_SIG_FORCE=y
```

### Disable all USB, PCMCIA (and other hotplug bus) drivers that aren’t needed

  To reduce the attack surface, the driver enumeration, probe, and
  operation happen in the kernel.  
  The driver data is parsed by the kernel, so any logic bugs in these drivers can become kernel exploits.

### Disable all file systems not needed

  To reduce the attack surface, file system data is parsed by the kernel
  so any logic bugs in file system drivers can become kernel exploits.

### Kernel Address Display Restriction

  When attackers try to develop "run anywhere" exploits for kernel
  vulnerabilities, they frequently need to know the location of internal
  kernel structures.  
  By treating kernel addresses as sensitive information, those locations are not visible to regular local users.

  /proc/sys/kernel/kptr\_restrict is set to "1" to block the reporting
  of known kernel address leaks.

  Additionally, various files and directories should be readable only by
  the root user: /boot/vmlinuz\*, /boot/System.map\*,
  /sys/kernel/debug/, /proc/slabinfo

### DMESG Restrictions

  When attackers try to develop "run anywhere" exploits for
  vulnerabilties, they frequently will use dmesg output.  
  By treating dmesg output as sensitive information, this output is not available to
  the attacker.

  /proc/sys/kernel/dmesg\_restrict can be set to "1" to treat dmesg
  output as sensitive.

Enable the below compiler and linker options when building user-space
applications to avoid stack smashing, buffer overflow attacks.

### Stack Smashing Attacks

```c
**-fstack-protector-all**
```

Emit extra code to check for buffer overflows, such as stack smashing attacks

### Position Independent Executables

```c
**-pie –fpic**:
```

Produce a position independent executable on targets which supports it.

### Detect Buffer Overflows

```c
**-D\_FORTIFY\_SOURCE=2**:
```

Helps detect some buffer overflow errors.

### Prevent Overwrite Attacks

```c
**–z,relro**
```

  This linking option helps during program load, several ELF memory
  sections need to be written by the linker, but can be turned read-only
  before turning over control to the program. This prevents some Global
  Offset Table GOT overwrite attacks, or in the dtors section of the ELF
  binary.

```c
**-z,now**
```

During program load, all dynamic symbols are resolved, allowing for the
complete GOT to be marked read-only (due to -z relro above). This
prevents GOT overwrite attacks. For very large application, this can
incur some performance loss during initial load while symbols are
resolved, but this shouldn't be an issue for daemons.

### Library linking

```c
**–static**
```

It is recommended that dynamic linking should not be allowed. This will
avoid user from replacing a library with malicious library. All libraries
should be linked statically.

## Removal or Non-Inclusion of Utilities

Table below lists utilities that are typically present in an embedded
device, along with the normal path of each utility. The table has
information about whether a utility shall be included or excluded from
respective environment. The values “INCLUDE” here means to include the
utility in the environment and “EXCLUDE” means to exclude it from the
respective environment.

|  **Utility Name** |  **Location**                             |  **Debug Environment** |   **Production Environment** |
|-------------------|-------------------------------------------|------------------------|------------------------------|
|  Strace           |  /bin/trace                               |  INCLUDE               |  EXCLUDE                     |
|  Klogd            |  /sbin/klogd                              |  INCLUDE               |  EXCLUDE                     |
|  Syslogd(logger)  |  /bin/logger                              |  INCLUDE               |  EXCLUDE                     |
|  Gdbserver        |  /bin/gdbserver                           |  INCLUDE               |  EXCLUDE                     |
|  Dropbear         |  Remove “dropbear” from ‘/etc/init.d/rcs’ |  EXCLUDE               |  EXCLUDE                     |
|  SSH              |  NA                                       |  INCLUDE               |  EXCLUDE                     |
|  Editors (vi)     |  /bin/vi                                  |  INCLUDE               |  EXCLUDE                     |
|  Dmesg            |  /bin/dmesg                               |  INCLUDE               |  EXCLUDE                     |
|  UART             |  /proc/tty/driver/                        |  INCLUDE               |  EXCLUDE                     |
|  Hexdump          |  /bin/hexdump                             |  INCLUDE               |  EXCLUDE                     |
|  Dnsdomainname    |  /bin/dnsdomainname                       |  EXCLUDE               |  EXCLUDE                     |
|  Hostname         |  /bin/hostname                            |  INCLUDE               |  EXCLUDE                     |
|  Pmap             |  /bin/pmap                                |  INCLUDE               |  EXCLUDE                     |
|  su               |  /bin/su                                  |  INCLUDE               |  EXCLUDE                     |
|  Which            |  /bin/which                               |  INCLUDE               |  EXCLUDE                     |
|  Who and whoami   |  /bin/whoami                              |  INCLUDE               |  EXCLUDE                     |
|  ps               |  /bin/ps                                  |  INCLUDE               |  EXCLUDE                     |
|  lsmod            |  /sbin/lsmod                              |  INCLUDE               |  EXCLUDE                     |
|  install          |  /bin/install                             |  INCLUDE               |  EXCLUDE                     |
|  logger           |  /bin/logger                              |  INCLUDE               |  EXCLUDE                     |
|  ps               |  /bin/ps                                  |  INCLUDE               |  EXCLUDE                     |
|  rpm              |  /bin/rpm                                 |  INCLUDE               |  EXCLUDE                     |
|  Iostat           |  /bin/iostat                              |  INCLUDE               |  EXCLUDE                     |
|  find             |  /bin/find                                |  INCLUDE               |  EXCLUDE                     |
|  Chgrp            |  /bin/chgrp                               |  INCLUDE               |  EXCLUDE                     |
|  Chmod            |  /bin/chmod                               |  INCLUDE               |  EXCLUDE                     |
|  Chown            |  /bin/chown                               |  INCLUDE               |  EXCLUDE                     |
|  killall          |  /bin/killall                             |  INCLUDE               |  EXCLUDE                     |
|  top              |  /bin/top                                 |  INCLUDE               |  EXCLUDE                     |
|  stbhotplug       |  /sbin/stbhotplug                         |  INCLUDE               |  EXCLUDE                     |

Note: The following Unix/Linux utilities shall be permitted as they are
often used in the start-up scripts and for USB logging. If any of these
utilities are not required by the device then those should be removed.

  **sed, awk, cut, df, dmesg, echo, fdisk, grep, mkdir, mount (vfat),
  printf, tail, tee, test (directory), test (file)**

## Root Access 

The main applications, those that provide the principal functionality of
the embedded device, **should not execute** with root identity or any
capability.

If the main application are allowed to execute at any capability,
then the entire system is at the mercy of the said application’s good
behaviour. Problems arise when an application is compromised and able to
execute commands which could consistently and persistently compromise
the system by implanting rogue applications.

It is suggested that the middleware and the UI should run in a context
on a user with no capability and all persistent resources should be
maintained without any capability.

One way to ensure this is by implementing a server-client paradigm.
Services provided by the system’s drivers can be shared this way. The
other advantage of this approach is that multiple applications can share
the same resources at the same time.

Root access **should not be allowed** for the following utilities:

```bash
  login
  su
  ssh
  scp
  sftp
```

Root access **should not be allowed** for the console device. The
development environment should allow users to login with pre-created
user accounts.

Switching to elevated privileges shall be allowed in the development
environment via sudo.

## Network Hardening

### Disable IPv4 Forwarding

  The net.ipv4.ip\_forward sysctl setting controls if IP forwarding is
  allowed or not on the System. Unless the system is used as a router or
  gateway, IPv4 forwarding should be disabled.

### Disable IP Source Routing

  Disable IP source routing on all interfaces through the
  net.ipv4.conf.\*.accept\_source\_route = 0 setting.
 
  IP source routing would allow a remote user (the sender) to specify
  the route that the packet should take, rather than use the (default)
  routing tables used by the routers between the sender and the
  destination. This could be used to spoof IP addresses and still get
  the replies (rather than sending the replies to the real owner of the
  IP address).

### Disable ICMP 

  Use of ICMP, especially ping, shall be avoided. This is a common way
  of gaining access to a system.

#### Disable ICMP Redirects

  Set net.ipv4.conf.\*.accept\_redirects=0 to disable ICMP redirect
  support on the interfaces.
 
  ICMP redirect messages are used by routers to inform hosts to use a
  different gateway than the one used. These packets should only be sent
  by the gateway of the system. In managed and embedded devices the
  gateway is controlled and any changes should be controlled.
 
  Allowing ICMP redirect messages would allow for "remote" updating of
  the routing table, which could allow an attacker to get all packets
  sent to the outside first rather than the packets immediately going to
  the real gateway.

#### Ignore ICMP Echo Broadcasts

  When net.ipv4.icmp\_echo\_ignore\_broadcasts=1 is set, then your
  system will not reply to broadcast “ping” requests.

#### Ignore ICMP Bogus Error Responses

  When an invalid response is given to broadcast frames (which occurs
  sometimes in erroneous routers), the Linux kernel will by default log
  this event. These can be disabled by setting
  throughnet.ipv4.icmp\_ignore\_bogus\_error\_responses to 1.

### Ignore all broadcast message

  All the IP packets that come on the address “255.255.255.255” shall be
  ignored. This can be done through the iptables rules.

### Disable IPV6 

  If there are no plans of using IPV6, it is a good practice to disable
  this support as it will reduce the size of the kernel TCP/IP stack.

### Enable TCP SYN Cookie Protection

  One way of denial of service (DoS) attack against a service would be
  to flood the server with SYNrequests (the TCP packet that starts a
  handshake for a connection). Such a flood can lead to a service
  disruption as the connection state handling will consume significant
  resources.
 
  By enabling net.ipv4.tcp\_syncookies, the Linux kernel will change its
  handshake behavior when its SYN backlog queue overflows: it replies to
  SYN requests with the appropriate SYN+ACK reply, but it does not store
  the connection in its backlog queue.

## Validation

### Hardened System

#### Image Security Analysis Framework (ISAFW)

**meta-security-isafw** is an OE layer that allows enabling the Image
Security Analysis Framework (isafw) for your image builds.

The primary purpose of isafw is to provide an extensible
framework for analysing different security aspects of images
during the build process.

The isafw project itself can be found at
    <https://github.com/01org/isafw>

This layer can be added to your builds to produce an analysis report,
including a kernel config analysis.

#### Usage

In order to enable the isafw during the image build, please add
the following line to your build/conf/local.conf file:

```python
INHERIT += "isafw"
```
