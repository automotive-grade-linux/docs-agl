Overview
========

Scope
-----

The information contained in this document is applicable to systems based
on Automotive Grade Linux.

Limitations
-----------

-   This document is based on knowledge and research gained from looking
    at security desktop and server versions of Linux as well as Android
    exploits and hardening.

-   Some kernel configuration options can have an impact on performance.  
    This will be noted where applicable.­

Document Structure
------------------

This document has been divided into three sections; REQUIREMENTS,
RECOMMENDATIONS, and VALIDATION. The REQUIREMENTS section details
explicit requirements that must be adhered to for the embedded
device.  
The RECOMMENDATIONS section details best practices, and some
recommended security settings for the embedded device.   
The third section, VALIDATION, provides reference scripts and test procedures that
can be used to verify adherence with the REQUIREMENTS detailed in the
first section of this guide.

Hardening
---------

The term *Hardening* refers to the tools, techniques and processes
required in order to reduce the attack surface on an embedded system,
such as an embedded control unit (ECU) or other managed device.  
The target for all hardening activities is to prevent the execution of
invalid binaries on the device, and to prevent copying of security
related data from the device.  
There are three main areas of focus for hardening an embedded device:


Requirements
============

  For the purposes of reference and explanation, we are providing guidance
  on how to configure an embedded device that runs with a linux 3. 10.17
  Linux kernel.  
  These requirements must still be met by manufacturers that
  opt to build using an alternative version of the Linux kernel.

Kernel Hardening
----------------

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

```
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
  CONFIG_CMDLINE=”&lt;*insert kernel command line here*&gt;”
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
  Programming (ROP) when trying to determine the effectives of an
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

### Disable namespace support

  Do not allow namespace support to prevent duplicates of dev nodes,
  pids and mount points.  
  This may be used in virtualization and container solutions like LXC, so in some cases it cannot be disabled.

```bash
  CONFIG_NAMESPACES=n
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

Recommendations
===============

The following sections detail best practices that should be applied in
order to secure a device.  
Although they are not currently listed as hard
requirements, they may be upgraded to requirements status in the future.



Kernel Hardening
----------------

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
|  CONFIG\_CHECKPOINT\_RESTORE=n        |3.3+            |
|  CONFIG\_UNIX\_DIAG=n                 |3.3+            |
|  CROSS\_MEMORY\_ATTACH=n              |3.5+            |
|  CONFIG\_PANIC\_ON\_OOPS=y            |3.5+            |
|  CONFIG\_COREDUMP=n                   |3.7+            |
|  CONFIG\_MODULE\_SIG\_FORCE=y         |3.7+            |
|  CONFIG\_PACKET\_DIAG=n               |3.7+            |
|  CONFIG\_FW\_LOADER\_USER\_HELPER=n   |3.9+            |
|  CONFIG\_CC\_STACKPROTECTOR=y         |3.11+ (MIPS)    |
|  CONFIG\_USELIB=n                     |3.15+           |
|  BPF\_JIT=n                           |3.16+ (MIPS)    |
|  CONFIG\_DEVMEM=n                     |4.0+            |

### Build with Stack Protection

  Similar to the stack protector used for ELF programs in user-space,
  the kernel can protect its internal stacks as well.  
  This configuration for the MIPS architecture is supported in Linux 3.11 and greater and
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
  This configuration for the MIPS architecture is supported in
  Linux 3.16 and greater and thus should only be disabled for such
  versions.

```bash
  BPF_JIT=n
```

### Disable checkpoint/restore

  The checkpoint/restore service can take a process, freeze it and
  migrate it.  
  This results in providing more info than a core dump.  
  This configuration is supported in Linux 3.3 and greater and thus should
  only be disabled for such versions.

```bash
  CONFIG_CHECKPOINT_RESTORE=n
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

  To reduce the attack surface; file system data is parsed by the kernel
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

### SELinux

  If SELinux is in use on the embedded system, the following kernel
  options should be enabled to prevent SELlinux from being disabled at
  either runtime or boot time.

```bash
  CONFIG_SECURITY_SELINUX_DEVELOP=n
  CONFIG_SECURITY_SELINUX_DISABLE=n
  CONFIG_SECURITY_SELINUX_BOOTPARAM=n
```


Validation
==========

Image Security Analysis Framework (ISAFW)
-----------------------------------------
**meta-security-isafw** is an OE layer that allows enabling the Image
Security Analysis Framework (isafw) for your image builds.

The primary purpose of isafw is to provide an extensible
framework for analysing different security aspects of images
during the build process.

The isafw project itself can be found at
    https://github.com/01org/isafw

This layer can be added to your builds to produce an analysis report,
including a kernel config analysis.

### Usage

In order to enable the isafw during the image build, please add
the following line to your build/conf/local.conf file:

```python
INHERIT += "isafw"
```
