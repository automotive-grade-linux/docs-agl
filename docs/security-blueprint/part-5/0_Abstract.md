# Part 5 - Platform

## Abstract

The Automotive Grade Linux platform is a Linux distribution with **AGL** compliant applications and services.
The platform includes the following software:

- Linux **BSP** configured for reference boards.
- Proprietary device drivers for common peripherals on reference boards.
- Application framework.
- Windows/layer management (graphics).
- Sound resource management.
- An atomic software update system (chapter Update).
- Building and debug tools (based on Yocto project).

This part focuses on the AGL platform including all tools and techniques used to
upgrade the security and downgrade the danger. It must be possible to apply the
two fundamental principles written at the very beginning of the document. First
of all, security management must remain simple. You must also prohibit
everything by default, and then define a set of authorization rules. As cases
to deal with, we must:

- Implement a **MAC** for processes and files.
- Limit communication between applications (_SystemBus_ and _SystemD_ part).
- Prohibit all tools used during development mode (_Utilities_ and _Services_ part).
- Manage user capabilities (_Users_ part).
- Manage application permissions and policies (_AGLFw_ part).

<!-- section-note -->

The tools and concepts used to meet these needs are only examples.
Any other tool that meets the need can be used.

<!-- end-section-note -->

In AGL, as in many other embedded systems, different security mechanisms settle
in the core layers to ensure isolation and data privacy. While the Mandatory
Access Control layer (**SMACK**) provides global security and isolation, other
mechanisms like **Cynara** are required to check application's permissions at
runtime. Applicative permissions (also called "_privileges_") may vary depending
on the user and the application being run: an application should have access to
a given service only if it is run by the proper user and if the appropriate
permissions are granted.

## Discretionary Access Control

**D**iscretionary **A**ccess **C**ontrol (**DAC**) is the traditional Linux method of separating
users and groups from one another. In a shared environment where multiple users
have access to a computer or network, Unix IDs have offered a way to contain access
within privilege areas for individuals, or shared among the group or system.
The Android system took this one step further, assigning new user IDs for each App.
This was never the original intention of Linux UIDs, but was able to provide
Android’s initial security element: the ability to sandbox applications.

Although AGL mentions use of **DAC** for security isolation, the weight of the
security responsibility lies in the **M**andatory **A**ccess **C**ontrol (**MAC**) and **Cynara**.
Furthermore, there are system services with unique UIDs. however,the system
does not go to the extreme of Android, where every application has its own UID.
All sandboxing (app isolation) in AGL is handled in the **MAC** contexts.

## Mandatory Access Control

**M**andatory **A**ccess **C**ontrol (**MAC**) is an extension to **DAC**,
whereby extended attributes (xattr) are associated with the filesystem.
In the case of AGL, the smackfs filesystem allows files and directories
to be associated with a SMACK label, providing the ability of further
discrimination on access control. A SMACK label is a simple null terminated
character string with a maximum of 255 bytes. While it doesn’t offer the
richness of an SELinux label, which provides a user, role,type, and level,
the simplicity of a single value makes the overall design far less complex.
There is arguably less chance of the security author making mistakes in the policies set forth.

--------------------------------------------------------------------------------

<!-- pagebreak -->

## Acronyms and Abbreviations

The following table lists the terms utilized within this part of the document.

Acronyms or Abbreviations | Description
------------------------- | --------------------------------------------------------------
_ACL_                     | **A**ccess **C**ontrol **L**ists
_alsa_                    | **A**dvanced **L**inux **S**ound **A**rchitecture
_API_                     | **A**pplication **P**rogramming **I**nterface
_AppFw_                   | **App**lication **F**rame**w**ork
_BSP_                     | **B**oard **S**upport **P**ackage
_Cap_                     | **Cap**abilities
_DAC_                     | **D**iscretionary **A**ccess **C**ontrol
_DDOS_                    | **D**istributed **D**enial **O**f **S**ervice
_DOS_                     | **D**enial **O**f **S**ervice
_IPC_                     | **I**nter-**P**rocess **C**ommunication
_MAC_                     | **M**andatory **A**ccess **C**ontrol
_PAM_                     | **P**luggable **A**uthentication **M**odules
_SMACK_                   | **S**implified **M**andatory **A**ccess **C**ontrol **K**ernel
