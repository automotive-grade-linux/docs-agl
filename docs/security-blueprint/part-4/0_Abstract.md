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
