# Serial

## Disable serial console

The serial console should be disabled to prevent an attacker from accessing this powerful interface.

<!-- config -->

Domain                   | `Config` name                | `Value`
------------------------ | ---------------------------- | -------
Kernel-Consoles-Serial-1 | `CONFIG_SERIAL_8250`         | `n`
Kernel-Consoles-Serial-2 | `CONFIG_SERIAL_8250_CONSOLE` | `n`
Kernel-Consoles-Serial-3 | `CONFIG_SERIAL_CORE`         | `n`
Kernel-Consoles-Serial-4 | `CONFIG_SERIAL_CORE_CONSOLE` | `n`

<!-- endconfig -->

--------------------------------------------------------------------------------

## Bake-in the kernel command-line

The kernel command-line is used to control many aspects of the booting kernel, and is prone to tampering as they are passed in RAM with little to no reverse validation on these parameters. To prevent this type of attack, the kernel shall be configured to ignore commands line arguments, and use pre-configured (compile time) options instead.

Set the kernel command line in the `CONFIG_CMDLINE KConfig` item and then pass no arguments from the bootloader.

<!-- config -->

Domain                        | `Config` name             | `Value`
----------------------------- | ------------------------- | -----------------------------------
Kernel-Consoles-CommandLine-1 | `CONFIG_CMDLINE_BOOL`     | `y`
Kernel-Consoles-CommandLine-2 | `CONFIG_CMDLINE`          | `"insert kernel command line here"`
Kernel-Consoles-CommandLine-3 | `CONFIG_CMDLINE_OVERRIDE` | `y`

<!-- endconfig -->

It is recommended that any per-device settings (e.g: MAC addresses, serial numbers, etc.) be stored and accessed from read-only memory (or files), and that any such parameters be verified (signature checking) prior to their use.

--------------------------------------------------------------------------------

## Disable KGDB

The Linux kernel supports KGDB over USB and console ports. These mechanisms are controlled by the `kgdbdbgp` and `kgdboc` kernel command-line parameters. It is important to ensure that no shipping product contains a kernel with KGDB compiled-in.

<!-- config -->

Domain                 | `Config` name | `Value`
---------------------- | ------------- | -------
Kernel-Consoles-KDBG-1 | `CONFIG_KGDB` | `n`

<!-- endconfig -->

--------------------------------------------------------------------------------

## Disable magic sysrq support

On a few architectures, you can access a powerful debugger interface from the keyboard. The same powerful interface can be present on the serial console (responding to serial break) of Linux on other architectures. Disable to avoid potentially exposing this powerful backdoor.

<!-- config -->

Domain                  | `Config` name        | `Value`
----------------------- | -------------------- | -------
Kernel-Consoles-SysRQ-1 | `CONFIG_MAGIC_SYSRQ` | `n`

<!-- endconfig -->

--------------------------------------------------------------------------------

## Disable support for binary formats other than ELF

This will make possible to plug wrapper-driven binary formats into the kernel. It enables support for binary formats other than ELF. Providing the ability to use alternate interpreters would assist an attacker in discovering attack vectors.

<!-- config -->

Domain                         | `Config` name        | `Value`
------------------------------ | -------------------- | -------
Kernel-Consoles-BinaryFormat-1 | `CONFIG_BINFMT_MISC` | `n`

<!-- endconfig -->
