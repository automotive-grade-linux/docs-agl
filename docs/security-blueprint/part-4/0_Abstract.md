# Part 4 - Kernel

## Abstract

**System Hardening:** Best practices associated with the configuration of an
embedded Linux based operating system. This section includes both hardening of
the kernel itself, as well as specific configurations and patches used to
protect against known vulnerabilities within the build and configuration of the
root filesystem.

At the Kernel level, we must ensure that no console can be launched. It could be
used to change the behavior of the system or to have more information about it.
Another aspect is the protection of the memory used by the Kernel.

The next sub-sections contain information on various kernel configuration
options to enhance the security in the kernel (3.10.17) and also for
applications compiled to take advantage of these security features.
Additionally, there are also configuration options that protect from known
vulnerable configuration options. Here's a high level summary of various kernel
configurations that shall be required for deployment.

## Kernel Version

The choice of kernel version for the AGL system is essential to its security.
Depending on the type of board and eventual production system, different kernel
versions are used. For example, one of the systems under study uses the
Linux kernel version 3.10, while another uses the Linux kernel version 4.4.
For the Linux kernel version 3.10.31, there are 25 known vulnerabilities.
These vulnerabilities would allow an attacker to gain privileges,
bypass access restrictions, allow memory to be corrupted, or cause denial of service.
In contrast, the Linux kernel version of 4.4 has many fewer known vulnerabilities.
For this reason, we would in general recommend the later kernel version as a basis
for the platform.

Note that, although there are fewer known vulnerabilities in the most recent kernel
versions there may be many unknown vulnerabilities underlying.
A rule of thumb is to update the kernel as much as possible to avoid the problems
you do know, but you should not be complacent in the trust that you place in it.
A defense-in-depth approach would then apply.

If there are constraints and dependencies in upgrading to a newer kernel version
(e.g. device drivers, board support providers) and you are forced to an older
Linux kernel version, there need to be additional provisions made to reduce
the risk of kernel exploits, which can include memory monitoring, watch-dog services,
and system call hooking. In this case, further defense-in-depth techniques
may be required to mitigate the risk of attacks to known vulnerabilities,
which can also include runtime integrity verification of components
that are vulnerable to tampering.

## Kernel Build Configuration

The kernel build configuration is extremely important for determining the level
of access to services and to reduce the breadth of the attack surface.
Linux contains a great and flexible number of capabilities and this is only controlled
through the build configuration. For example, the `CONFIG_MODULES` parameter
allows kernel modules to be loaded at runtime extending the capabilities of the kernel.
This capability needs to be either inhibited or controlled at runtime through
other configuration parameters. For example, `CONFIG_MODULE_SIG_FORCE=y` ensures
that only signed modules are loaded. There is a very large number of kernel
configuration parameters, and these are discussed in detail in this section.
