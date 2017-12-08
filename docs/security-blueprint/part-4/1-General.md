# General configuration

## Mandatory Access Control

Kernel should controls access with labels and policy.

<!-- config -->

Domain               | Object | Recommendations
-------------------- | ------ | ------------------------------------------
Kernel-General-MAC-1 | SMACK  | Must implement a Mandatory Access Control.

<!-- endconfig -->

<!-- todo -->

Domain       | Improvement
------------ | ----------------
Kernel-MAC-1 | Add MAC config note.

<!-- endtodo -->

--------------------------------------------------------------------------------

## Disable kexec

This prevents someone who gets root from supplanting the kernel. This can be used as a way to bypass signed kernels.

<!-- config -->

Domain                 | `Config` name  | `Value`
---------------------- | -------------- | -------
Kernel-General-kexec-1 | `CONFIG_KEXEC` | `n`

<!-- endconfig -->

--------------------------------------------------------------------------------

## Disable kernel IP auto-configuration

It is preferable to have an IP configuration performed using a user-space tool as these tend to have more validation. We do not want the network interface coming up until the system has come up properly.

<!-- config -->

Domain                      | `Config` name   | `Value`
--------------------------- | --------------- | -------
Kernel-General-IPAutoConf-1 | `CONFIG_IP_PNP` | `n`

<!-- endconfig -->

--------------------------------------------------------------------------------

## Disable Sysctl syscall support

Enabling this will result in code being included that is hard to maintain and not well tested.

<!-- config -->

Domain                          | `Config` name           | `Value`
------------------------------- | ----------------------- | -------
Kernel-General-SysCtl_SysCall-1 | `CONFIG_SYSCTL_SYSCALL` | `n`

<!-- endconfig -->

--------------------------------------------------------------------------------

## Disable Legacy Linux Support

There are some Kernel Configs which are present only to support legacy binaries. See also "Consoles" part in order to disabling support for legacy binary formats. The `uselib` system call, in particular, has no valid use in any `libc6` or `uclibc` system in recent times. This configuration is supported in **Linux 3.15 and greater** and thus should only be disabled for such versions.

<!-- config -->

Domain                       | `Config` name   | `Value`
---------------------------- | --------------- | -------
Kernel-General-LegacyLinux-1 | `CONFIG_USELIB` | `n`

<!-- endconfig -->

--------------------------------------------------------------------------------

## Disable firmware auto-loading user mode helper

The firmware auto loading helper, which is a utility executed by the kernel on `hotplug` events requiring firmware, needs to be set `setuid`. As a result of this, the helper utility is an attractive target for attackers with control of physical ports on the device. Disabling this configuration that is supported in **Linux 3.9 and greater**.

<!-- config -->

Domain                      | `Config` name                  | `Value`
--------------------------- | ------------------------------ | -------
Kernel-General-FirmHelper-1 | `CONFIG_FW_LOADER_USER_HELPER` | `n`

<!-- endconfig -->

--------------------------------------------------------------------------------

## Enable Kernel Panic on OOPS

When fuzzing the kernel or attempting kernel exploits attackers are likely to trigger kernel OOPSes. Setting the behavior on OOPS to PANIC can impede their progress.

This configuration is supported in **Linux 3.5 and greater** and thus should only be enabled for such versions.

<!-- config -->

Domain                       | `Config` name          | `Value`
---------------------------- | ---------------------- | -------
Kernel-General-PanicOnOOPS-1 | `CONFIG_PANIC_ON_OOPS` | `y`

<!-- endconfig -->

--------------------------------------------------------------------------------

<!-- pagebreak -->

## Disable socket monitoring interface

These monitors can be used to inspect shared file descriptors on Unix Domain sockets or traffic on 'localhost' which is otherwise assumed to be confidential.

The `CONFIG_PACKET_DIAG` configuration is supported in **Linux 3.7 and greater** and thus should only be disabled for such versions.

The `CONFIG_UNIX_DIAG` configuration is supported in **Linux 3.3 and greater** and thus should only be disabled for such versions.

<!-- config -->

Domain                     | `Config` name        | `Value`
-------------------------- | -------------------- | -------
Kernel-General-SocketMon-1 | `CONFIG_PACKET_DIAG` | `n`
Kernel-General-SocketMon-2 | `CONFIG_UNIX_DIAG`   | `n`

<!-- endconfig -->

--------------------------------------------------------------------------------

## Disable BPF JIT

The BPF JIT can be used to create kernel-payloads from firewall table rules.

This configuration for is supported in **Linux 3.16 and greater** and thus should only be disabled for such versions.

<!-- config -->

Domain                   | `Config` name    | `Value`
------------------------ | ---------------- | -------
Kernel-General-BPF_JIT-1 | `CONFIG_BPF_JIT` | `n`

<!-- endconfig -->

--------------------------------------------------------------------------------

## Enable Enforced Module Signing

The kernel should never allow an unprivileged user the ability to load specific kernel modules,
since that would provide a facility to unexpectedly extend the available attack surface.

To protect against even privileged users, systems may need to either disable
module loading entirely, or provide signed modules
(e.g. CONFIG_MODULE_SIG_FORCE, or dm-crypt with LoadPin), to keep from having
root load arbitrary kernel code via the module loader interface.

This configuration is supported in **Linux 3.7 and greater** and thus should only be enabled for such versions.

<!-- config -->

Domain                         | `Config` name             | `Value`
------------------------------ | ------------------------- | -------
Kernel-General-ModuleSigning-1 | `CONFIG_MODULE_SIG_FORCE` | `y`

<!-- endconfig -->

--------------------------------------------------------------------------------

<!-- pagebreak -->

## Disable all USB, PCMCIA (and other `hotplug` bus) drivers that aren't needed

To reduce the attack surface, the driver enumeration, probe, and operation happen in the kernel. The driver data is parsed by the kernel, so any logic bugs in these drivers can become kernel exploits.

<!-- config -->

Domain                   | Object              | _State_
------------------------ | ------------------- | ----------
Kernel-General-Drivers-1 | `USB`               | _Disabled_
Kernel-General-Drivers-2 | `PCMCIA`            | _Disabled_
Kernel-General-Drivers-3 | Other `hotplug` bus | _Disabled_

<!-- endconfig -->

--------------------------------------------------------------------------------

## Position Independent Executables

<!-- config -->

Domain                           | `compiler` and `linker` options | _State_
-------------------------------- | ------------------------------- | --------
Kernel-General-IndependentExec-1 | `-pie -fpic`                    | _Enable_

<!-- endconfig -->

Produce a position independent executable on targets which supports it.

--------------------------------------------------------------------------------

## Prevent Overwrite Attacks

`-z,relro` linking option helps during program load, several ELF memory sections need to be written by the linker, but can be turned read-only before turning over control to the program. This prevents some Global Offset Table GOT overwrite attacks, or in the dtors section of the ELF binary.

<!-- config -->

Domain                            | `compiler` and `linker` options | _State_
--------------------------------- | ------------------------------- | --------
Kernel-General-OverwriteAttacks-1 | `-z,relro`                      | _Enable_
Kernel-General-OverwriteAttacks-2 | `-z,now`                        | _Enable_

<!-- endconfig -->

During program load, all dynamic symbols are resolved, allowing for the complete GOT to be marked read-only (due to `-z relro` above). This prevents GOT overwrite attacks. For very large application, this can incur some performance loss during initial load while symbols are resolved, but this shouldn't be an issue for daemons.

--------------------------------------------------------------------------------

<!-- pagebreak -->

## Library linking

It is recommended that dynamic linking should generally not be allowed. This will avoid the user from replacing a library with malicious library. All libraries should be linked statically, but this is difficult to implement.

<!-- config -->

Domain                          | `compiler` and `linker` options | _State_
------------------------------- | ------------------------------- | --------
Kernel-General-LibraryLinking-1 | `-static`                       | _Enable_

<!-- endconfig -->
