# Mandatory Access Control

<!-- section-note -->

We decided to put the **MAC** protection on the platform part despite the fact
that it applies to the kernel too, since its use will be mainly at the platform
level (except floor part).

<!-- end-section-note -->

**M**andatory **A**ccess **C**ontrol (**MAC**) is a protection provided by the
Linux kernel that requires a **L**inux **S**ecurity **M**odule (**LSM**). AGL
uses an **LSM** called **S**implified **M**andatory **A**ccess **C**ontrol
**K**ernel (**SMACK**). This protection involves the creation of **SMACK**
labels as part of the extended attributes **SMACK** labels to the file extended
attributes. And a policy is also created to define the behaviour of each label.

The kernel access controls is based on these labels and this policy. If there
is no rule, no access will be granted and as a consequence, what is not
explicitly authorized is forbidden.

There are two types of **SMACK** labels:

- **Execution SMACK** (Attached to the process): Defines how files are
  _accessed_ and _created_ by that process.
- **File Access SMACK** (Written to the extended attribute of the file): Defines
  _which_ process can access the file.

By default a process executes with its File Access **SMACK** label unless an
Execution **SMACK** label is defined.

AGL's **SMACK** scheme is based on the _Tizen 3 Q2/2015_. It divides the System
into the following domains:

- Floor.
- System.
- Applications, Services and User.

See [AGL security framework review](http://iot.bzh/download/public/2017/AMMQ1Tokyo/AGL-security-framework-review.pdf) and [Smack White Paper](http://schaufler-ca.com/yahoo_site_admin/assets/docs/SmackWhitePaper.257153003.pdf)
for more information.

--------------------------------------------------------------------------------

<!-- pagebreak -->

## Floor

The _floor_ domain includes the base system services and any associated data and
libraries. This data remains unchanged at runtime. Writing to floor files or
directories is allowed only in development mode or during software installation
or upgrade.

The following table details the _floor_ domain:

Label | Name  | Execution **SMACK** | File Access **SMACK**
----- | ----- | ------------------- | ---------------------------------------
`-`   | Floor | `r-x` for all       | Only kernel and internal kernel thread.
`^`   | Hat   | `---` for all       | `rx` on all domains.
`*`   | Star  | `rwx` for all       | None

<!-- section-note -->

- The Hat label is Only for privileged system services (currently only
  systemd-journal). Useful for backup or virus scans. No file with this label
  should exist except in the debug log.

- The Star label is used for device files or `/tmp` Access restriction managed
  via **DAC**. Individual files remain protected by their **SMACK** label.

<!-- end-section-note --> <!-- section-config -->

Domain             | `Label` name | Recommendations
------------------ | ------------ | -----------------------------------------------------------
Kernel-MAC-Floor-1 | `^`          | Only for privileged system services.
Kernel-MAC-Floor-2 | `*`          | Used for device files or `/tmp` Access restriction via DAC.

<!-- end-section-config -->

--------------------------------------------------------------------------------

<!-- pagebreak -->

## System

The _system_ domain includes a reduced set of core system services of the OS and
any associated data. This data may change at runtime.

The following table details the _system_ domain:

Label            | Name      | Execution **SMACK**                             | File Access **SMACK**
---------------- | --------- | ----------------------------------------------- | ---------------------
`System`         | System    | None                                            | Privileged processes
`System::Run`    | Run       | `rwxatl` for User and System label              | None
`System::Shared` | Shared    | `rwxatl` for system domain `r-x` for User label | None
`System::Log`    | Log       | `rwa` for System label `xa` for user label      | None
`System::Sub`    | SubSystem | Subsystem Config files                          | SubSystem only

<!-- section-config -->

Domain              | `Label` name     | Recommendations
------------------- | ---------------- | -------------------------------------------------------------------------------------------------------------
Kernel-MAC-System-1 | `System`         | Process should write only to file with transmute attribute.
Kernel-MAC-System-2 | `System::run`    | Files are created with the directory label from user and system domain (transmute) Lock is implicit with `w`.
Kernel-MAC-System-3 | `System::Shared` | Files are created with the directory label from system domain (transmute) User domain has locked privilege.
Kernel-MAC-System-4 | `System::Log`    | Some limitation may impose to add `w` to enable append.
Kernel-MAC-System-5 | `System::Sub`    | Isolation of risky Subsystem.

<!-- end-section-config -->

--------------------------------------------------------------------------------

<!-- pagebreak -->

## Applications, Services and User

The _application_, _services_ and _user_ domain includes code that provides
services to the system and user, as well as any associated data. All code
running on this domain is under _Cynara_ control.

The following table details the _application_, _services_ and _user_ domain:

Label               | Name   | Execution **SMACK**                                                         | File Access **SMACK**
------------------- | ------ | --------------------------------------------------------------------------- | ---------------------------
`User::Pkg::$AppID` | AppID  | `rwx` (for files created by the App). `rx` for files installed by **AppFw** | $App runtime executing $App
`User::Home`        | Home   | `rwx-t` from System label `r-x-l` from App                                  | None
`User::App-Shared`  | Shared | `rwxat` from System and User domains label of $User                         | None

<!-- section-config -->

Domain              | `Label` name        | Recommendations
------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------
Kernel-MAC-System-1 | `User::Pkg::$AppID` | Only one Label is allowed per App. A data directory is created by the AppFw in `rwx` mode.
Kernel-MAC-System-2 | `User::Home`        | AppFw needs to create a directory in `/home/$USER/App-Shared` at first launch if not present with label app-data access is `User::App-Shared` without transmute.
Kernel-MAC-System-3 | `User::App-Shared`  | Shared space between all App running for a given user.

<!-- end-section-config -->

## Attack Vectors

There are 4 major components to the system:

- The LSM kernel module.
- The `smackfs` filesystem.
- Basic utilities for policy management and checking.
- The policy/configuration data.

As with any mandatory access system, the policy management needs to be carefully separated
from the checking, as the management utilities can become a convenient point of attack.
Dynamic additions to the policy system need to be carefully verified, as the ability to
update the policies is often needed, but introduces a possible threat. Finally,
even if the policy management is well secured, the policy checking and failure response
to that checking is also of vital importance to the smooth operation of the system.

While **MAC** is a certainly a step up in security when compared to DAC, there are still
many ways to compromise a SMACK-enabled Linux system. Some of these ways are as follows:

- Disabling SMACK at invocation of the kernel (with command-line: security=none).
- Disabling SMACK in the kernel build and redeploying the kernel.
- Changing a SMACK attribute of a file or directory at install time.
- Tampering with a process with the CAP_MAC_ADMIN privilege.
- Setting/Re-setting the SMACK label of a file.
- Tampering with the default domains (i.e. /etc/smack/accesses.d/default-access-domains).
- Disabling or tampering with the SMACK filesystem (i.e. /smackfs).
- Adding policies with `smackload` (adding the utility if not present).
- Changing labels with `chsmack` (adding the utility if not present).
