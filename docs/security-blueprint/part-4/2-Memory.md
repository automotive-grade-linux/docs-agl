# Memory

## Restrict access to kernel memory

The /dev/kmem file in Linux systems is directly mapped to kernel virtual memory. This can be disastrous if an attacker gains root access, as the attacker would have direct access to kernel virtual memory.

To disable the /dev/kmem file, which is very infrequently used by applications, the following kernel option should be set in the compile-time kernel configuration:

<!-- section-config -->

Domain                         | `Config` name    | `Value`
------------------------------ | ---------------- | -------
Kernel-Memory-RestrictAccess-1 | `CONFIG_DEVKMEM` | `n`

<!-- end-section-config -->

In case applications in userspace need /dev/kmem support, it should be available only for authenticated applications.

--------------------------------------------------------------------------------

## Disable access to a kernel core dump

This kernel configuration disables access to a kernel core dump from user space. If enabled, it gives attackers a useful view into kernel memory.

<!-- section-config -->

Domain                   | `Config` name       | `Value`
------------------------ | ------------------- | -------
Kernel-Memory-CoreDump-1 | `CONFIG_PROC_KCORE` | `n`

<!-- end-section-config -->

--------------------------------------------------------------------------------

## Disable swap

If not disabled, attackers can enable swap at runtime, add pressure to the memory subsystem and then scour the pages written to swap for useful information.

<!-- section-config -->

Domain               | `Config` name | `Value`
-------------------- | ------------- | -------
Kernel-Memory-Swap-1 | `CONFIG_SWAP` | `n`

<!-- end-section-config -->

--------------------------------------------------------------------------------

<!-- pagebreak -->

## Disable "Load All Symbols"

There is a /proc/kallsyms file which exposes the kernel memory space address of many kernel symbols (functions, variables, etc...). This information is useful to attackers in identifying kernel versions/configurations and in preparing payloads for the exploits of kernel space.

Both `KALLSYMS_ALL` and `KALLSYMS` shall be disabled;

<!-- section-config -->

Domain                         | `Config` name         | `Value`
------------------------------ | --------------------- | -------
Kernel-Memory-LoadAllSymbols-1 | `CONFIG_KALLSYMS`     | `n`
Kernel-Memory-LoadAllSymbols-2 | `CONFIG_KALLSYMS_ALL` | `n`

<!-- end-section-config -->

--------------------------------------------------------------------------------

## Stack protection

To prevent stack-smashing, similar to the stack protector used for ELF programs in user-space, the kernel can protect its internal stacks as well.

This configuration is supported in **Linux 3.11 and greater** and thus should only be enabled for such versions.

This configuration also requires building the kernel with the **gcc compiler 4.2 or greater**.

<!-- section-config -->

Domain                | `Config` name              | `Value`
--------------------- | -------------------------- | -------
Kernel-Memory-Stack-1 | `CONFIG_CC_STACKPROTECTOR` | `y`

<!-- end-section-config -->

--------------------------------------------------------------------------------

## Disable access to /dev/mem

The /dev/mem file in Linux systems is directly mapped to physical memory. This can be disastrous if an attacker gains root access, as the attacker would have direct access to physical memory through this convenient device file. It may not always be possible to disable such file, as some applications might need such support. In that case, then this device file should be available only for authenticated applications.

This configuration is supported in **Linux 4.0 and greater** and thus should only be disabled for such versions.

<!-- section-config -->

Domain                 | `Config` name   | `Value`
---------------------- | --------------- | -------
Kernel-Memory-Access-1 | `CONFIG_DEVMEM` | `n`

<!-- end-section-config -->

--------------------------------------------------------------------------------

<!-- pagebreak -->

## Disable cross-memory attach

Disable the process_vm_*v syscalls which allow one process to peek/poke the virtual memory of another.

This configuration is supported in **Linux 3.5 and greater** and thus should only be disabled for such versions.

<!-- section-config -->

Domain                         | `Config` name         | `Value`
------------------------------ | --------------------- | -------
Kernel-Memory-CrossMemAttach-1 | `CROSS_MEMORY_ATTACH` | `n`

<!-- end-section-config -->

--------------------------------------------------------------------------------

## Stack Smashing Attacks

<!-- section-config -->

Domain                        | `compiler` and `linker` options | _State_
----------------------------- | ------------------------------- | --------
Kernel-Memory-StackSmashing-1 | `-fstack-protector-all`         | _Enable_

<!-- end-section-config -->

Emit extra code to check for buffer overflows, such as stack smashing attacks.

--------------------------------------------------------------------------------

## Detect Buffer Overflows

<!-- section-config -->

Domain                          | `compiler` and `linker` options | `Value`
------------------------------- | ------------------------------- | -------
Kernel-Memory-BufferOverflows-1 | `-D_FORTIFY_SOURCE`             | `2`

<!-- end-section-config -->

Helps detect some buffer overflow errors.
