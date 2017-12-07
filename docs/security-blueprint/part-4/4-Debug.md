# Debug

No debuggers shall be present on the file system. This includes, but is not limited to, the GNU Debugger client/server (commonly known in their short form names such as the `gdb` and `gdbserver` executable binaries respectively), the `LLDB` next generation debugger or the `TCF` (Target Communications Framework) agnostic framework. Including these binaries as part of the file system will facilitate an attacker's ability to reverse engineer and debug (either locally or remotely) any process that is currently executing on the device.

## Kernel debug symbols

Debug symbols should always be removed from production kernels as they provide a lot of information to attackers.

<!-- config -->

Domain                 | `Config` name       | `Value`
---------------------- | ------------------- | -------
Kernel-Debug-Symbols-1 | `CONFIG_DEBUG_INFO` | `n`

<!-- endconfig -->

These kernel debug symbols are enabled by other config items in the kernel. Care should be taken to disable those also. If `CONFIG_DEBUG_INFO` cannot be disabled, then enabling `CONFIG_DEBUG_INFO_REDUCED` is second best.

--------------------------------------------------------------------------------

## Disable Kprobes

Kprobes enables you to dynamically break into any kernel routine and collect debugging and performance information non-disruptively. You can trap at almost any kernel code address, specifying a handler routine to be invoked when the breakpoint is hit.

<!-- config -->

Domain                 | `Config` name    | `Value`
---------------------- | ---------------- | -------
Kernel-Debug-Kprobes-1 | `CONFIG_KPROBES` | `n`

<!-- endconfig -->

--------------------------------------------------------------------------------

## Disable Tracing

FTrace enables the kernel to trace every kernel function. Providing kernel trace functionality would assist an attacker in discovering attack vectors.

<!-- config -->

Domain                 | `Config` name   | `Value`
---------------------- | --------------- | -------
Kernel-Debug-Tracing-1 | `CONFIG_FTRACE` | `n`

<!-- endconfig -->

--------------------------------------------------------------------------------

## Disable Profiling

Profiling and OProfile enables profiling the whole system, include the kernel, kernel modules, libraries, and applications. Providing profiling functionality would assist an attacker in discovering attack vectors.

<!-- config -->

Domain                   | `Config` name      | `Value`
------------------------ | ------------------ | -------
Kernel-Debug-Profiling-1 | `CONFIG_OPROFILE`  | `n`
Kernel-Debug-Profiling-2 | `CONFIG_PROFILING` | `n`

<!-- endconfig -->

--------------------------------------------------------------------------------

## Disable OOPS print on BUG()

The output from OOPS print can be helpful in Return Oriented Programming (ROP) when trying to determine the effectiveness of an exploit.

<!-- config -->

Domain                   | `Config` name             | `Value`
------------------------ | ------------------------- | -------
Kernel-Debug-OOPSOnBUG-1 | `CONFIG_DEBUG_BUGVERBOSE` | `n`

<!-- endconfig -->

--------------------------------------------------------------------------------

## Disable Kernel Debugging

There are development-only branches of code in the kernel enabled by the `DEBUG_KERNEL` conf. This should be disabled to compile-out these branches.

<!-- config -->

Domain             | `Config` name         | `Value`
------------------ | --------------------- | -------
Kernel-Debug-Dev-1 | `CONFIG_DEBUG_KERNEL` | `n`
Kernel-Debug-Dev-2 | `CONFIG_EMBEDDED`     | `n`

<!-- endconfig -->

In some kernel versions, disabling this requires also disabling `CONFIG_EMBEDDED`, and `CONFIG_EXPERT`. Disabling `CONFIG_EXPERT` makes it impossible to disable `COREDUMP`, `DEBUG_BUGVERBOSE`, `NAMESPACES`, `KALLSYMS` and `BUG`. In which case it is better to leave this enabled than enable the others.

--------------------------------------------------------------------------------

<!-- pagebreak -->

## Disable the kernel debug filesystem

The kernel debug filesystem presents a lot of useful information and means of manipulation of the kernel to an attacker.

<!-- config -->

Domain                    | `Config` name     | `Value`
------------------------- | ----------------- | -------
Kernel-Debug-FileSystem-1 | `CONFIG_DEBUG_FS` | `n`

<!-- endconfig -->

--------------------------------------------------------------------------------

## Disable BUG() support

The kernel will display backtrace and register information for BUGs and WARNs in kernel space, making it easier for attackers to develop exploits.

<!-- config -->

Domain             | `Config` name | `Value`
------------------ | ------------- | -------
Kernel-Debug-BUG-1 | `CONFIG_BUG`  | `n`

<!-- endconfig -->

--------------------------------------------------------------------------------

## Disable core dumps

Core dumps provide a lot of debug information for hackers. So disabling core dumps are recommended in production builds.

This configuration is supported in **Linux 3.7 and greater** and thus should only be disabled for such versions.

<!-- config -->

Domain                   | `Config` name     | `Value`
------------------------ | ----------------- | -------
Kernel-Debug-CoreDumps-1 | `CONFIG_COREDUMP` | `n`

<!-- endconfig -->

--------------------------------------------------------------------------------

<!-- pagebreak -->

## Kernel Address Display Restriction

When attackers try to develop "run anywhere" exploits for kernel vulnerabilities, they frequently need to know the location of internal kernel structures. By treating kernel addresses as sensitive information, those locations are not visible to regular local users.

**/proc/sys/kernel/kptr_restrict is set to "1"** to block the reporting of known kernel address leaks.

<!-- config -->

Domain                       | `File` name                      | `Value`
---------------------------- | -------------------------------- | -------
Kernel-Debug-AdressDisplay-1 | `/proc/sys/kernel/kptr_restrict` | `1`

<!-- endconfig -->

Additionally, various files and directories should be readable only by the root user: `/boot/vmlinuz*`, `/boot/System.map*`, `/sys/kernel/debug/`, `/proc/slabinfo`

<!-- config -->

Domain                       | `File` or `Directorie` name | _State_
---------------------------- | --------------------------- | -----------------------------
Kernel-Debug-AdressDisplay-1 | `/boot/vmlinuz*`            | _Readable Only for root user_
Kernel-Debug-AdressDisplay-2 | `/boot/System.map*`         | _Readable Only for root user_
Kernel-Debug-AdressDisplay-3 | `/sys/kernel/debug/`        | _Readable Only for root user_
Kernel-Debug-AdressDisplay-4 | `/proc/slabinfo`            | _Readable Only for root user_

<!-- endconfig -->

--------------------------------------------------------------------------------

## DMESG Restrictions

When attackers try to develop "run anywhere" exploits for vulnerabilities, they frequently will use `dmesg` output. By treating `dmesg` output as sensitive information, this output is not available to the attacker.

**/proc/sys/kernel/dmesg_restrict can be set to "1"** to treat dmesg output as sensitive.

<!-- config -->

Domain               | `File` name                       | `Value`
-------------------- | --------------------------------- | -------
Kernel-Debug-DMESG-1 | `/proc/sys/kernel/dmesg_restrict` | `1`

<!-- endconfig -->

Enable the below compiler and linker options when building user-space applications to avoid stack smashing, buffer overflow attacks.

--------------------------------------------------------------------------------

<!-- pagebreak -->

## Disable /proc/config.gz

It is extremely important to not expose the kernel configuration used on a production device to a potential attacker. With access to the kernel config, it could be possible for an attacker to build a custom kernel for the device that may disable critical security features.

<!-- config -->

Domain                | `Config` name     | `Value`
--------------------- | ----------------- | -------
Kernel-Debug-Config-1 | `CONFIG_IKCONFIG` | `n`

<!-- endconfig -->
