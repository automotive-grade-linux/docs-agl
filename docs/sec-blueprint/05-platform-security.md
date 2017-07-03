---

title : Platform Security
date  : 2017-07-07
categories: architecture, automotive
tags: architecture, automotive, linux
layout: techdoc

---

**Table of Content**

1. TOC
{:toc}

This section describes how the Automotive Grade Linux (AGL) platform
applies some of the previously described security concepts to
implement platform security

# Platform Definition
The Automotive Grade Linux(AGL) platform is a Linux distribution
with AGL compliant applications and services. The platform includes the
following hardware:
 - SoC (System-on-Chip)
 - Memory (RAM, ROM, storage, etc.)
 - Peripherals

The AGL platform includes the following software:
 - Linux BSP configured for reference boards
 - Proprietary device drivers for common peripherals on reference boards
 - Application framework
 - Windows/layer management (Graphics)
 - Sound resource management
 - An atomic software update system
 - Building and debug tools (based on Yocto project)

For more details, refer to the AGL Architecture/Specification Document.

# Secure Boot
Currently, AGL does not provide a secure boot solution but highly recommends
that the manufactured solution make use of a secure boot mechanism. For
instructions on securing u-boot, please refer to the System Hardening Guide.

# Certificate and Key Management
Currently, AGL does not provide a secure certificate and key management
solution but highly recommends that the manufactured solution make use
of secure key management.

# Mandatory Access Control
Mandatory Access Control (MAC) is a protection provided
by the Linux kernel that requires a Linux Security Module (LSM).
AGL uses an LSM called Simplified Mandatory Access Control Kernel (SMACK).
This protection involves the creation of SMACK labels as part of the extended
attributes SMACK *labels* to the extended attributes of the file and then
creation of a policy to define the behaviour of each label. The kernel controls
access based on these labels and this policy.

There are two types of SMACK labels.
* An *Execution* SMACK label of a process defines how files
are accessed and created by that process.

* The *File Access* SMACK label defines which process can access the file.
This SMACK label is written to the extended attribute of the file.


By default a process executes with its File Access
SMACK label unless an Execution SMACK label is defined.

AGL's SMACK scheme is based on the Tizen 3 Q2/2015.
It divides the System into the following domains :

## Floor
The *floor* domain includes the base system services and any associated data
and libraries. This data remains unchanged at runtime.
Writing to floor files or directories is allowed only in development
mode or by installation and upgrade software.

The following table details the *floor* domain:

-------------------------------------------------------------------------------------------------------------------------

|Label|   Name |   File     | Process                             | Comment                                              |
|:-:|:-------|:-------------|:------------------------------------|:-----------------------------------------------------|
| |
| -   | Floor  | r-x for all  | Only kernel and<br>internal kernel thread <br>|  --                                              |
| ^   | Hat    | --- for all  | rx on all domains                 | Only for privileged system services (currently only systemd-journal). Useful for backup or virus scans. No file with this label should exist except in the debug log.  |
| *   | Star   | rwx for all  | None                                | used for device files or /tmp Access restriction managed via DAC. Individual files remain protected by their SMACK label.  |



## System
The *system* domain includes a reduced set of core system services of the OS and
any associated data. This data may change at runtime.

The following table details the *system* domain:

-------------------------------------------------------------------------------------------------------------------------

|Label|   Name |   File     | Process                             | Comment                                              |
|:--|:-------|:-------------|:------------------------------------|:-----------------------------------------------------|
| |
|System|System|none|Privileged<br>processes|Process should write only to file with transmute attribute.|
|System::run|Run|rwxatl for User and System label|None|Files are created with the directory label<br>from user and system domain (transmute)<br>Lock is implicit with w.|
|System::shared|Shared|rwxatl for system domain<br>r-x for User label|None|Files are created with the directory label from system domain (transmute)<br>User domain has locked privilege|
|System::Log|Log|rwa for System label<br>xa for user label|None|Some limitation may impose to add w to enable append.|
|System::Sub|SubSystem|Subsystem Config files|SubSystem only|Isolation of risky Subsystem**|


## Applications, Services and User
The *application, services and user* domain includes code that
provides services to the system and user, as well as
any associated data. All code running in this domain is under Cynara
control.

The following table details the *application, services and user* domain:

-------------------------------------------------------------------------------------------------------------------------

|Label|   Name |   File     | Process                             | Comment                                              |
|:--|:-------|:-------------|:------------------------------------|:-----------------------------------------------------|
| |
|App::$AppID|AppID|rwx (for files created by the App).<br>rx for files installed by AppFW|$App runtime<br>executing $App|Only one Label is allowed per App.<br>A data directory is created by the AppFW in rwx mode.<br>Older releases still use User::App::$AppID |
|User::Home|Home|rwx-t from System label<br>r-x-l from App|None|AppFW needs to create a directory in /home/$USER/App-Shared at first launch if not present with label<br>app-data access is "User::App-Shared"<br>without transmute.|
|App-Shared|Shared|rwxat from System and User domains label of $User|None|Shared space between all App running for a given user.<br>Older releases may still use User::App-Shared|

# Yocto Security Layer
Currently, AGL relies on Cynara and Security Manager from Yocto Layer
meta-intel-iot-security. Please note that support for these components has
been dropped in the upstream project.

# Application API Transport
Currently, AGL Application framework uses D-Bus interface for transport
and uses the inherent security that comes with this protocol.

# Resource Management and Protection
AGL provides resource management and protection through SMACK labels.
Please refer to application framework documentation for more details.

# TrustZone
Currently, AGL does not provide any direct support for TrustZone.
This feature strictly depends on the SoC and is only available on ARM architectures.

# AGL Platform Software Update

The update solution must be atomic and the following update requirements:
- Support Smack as MAC
- Support Read-Only Filesystem
- Support Integrity Enforcement

Currently AGL offers a reference implementation of the Over-The-Air
update system using OSTree. Work is being done to secure the OTA
updates using *Uptane*.

For more information on Uptane, please refer to:

https://uptane.github.io/

# Cloud Service Infrastructure
Currently, AGL does not provide a any cloud service infrastructure


For recommendations on hardening the system, please refer to the System Hardening Guide.
