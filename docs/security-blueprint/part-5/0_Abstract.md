# Part 5 - Platform

## Abstract

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

The tools and concepts used to meet these needs are only examples. Any other
tool that meets the need can be used.

<!-- end-section-note -->

In AGL, as in many other embedded systems, different security mechanisms settle
in the core layers to ensure isolation and data privacy. While the Mandatory
Access Control layer (**SMACK**) provides global security and isolation, other
mechanisms like **Cynara** are required to check application's permissions at
runtime. Applicative permissions (also called "_privileges_") may vary depending
on the user and the application being run: an application should have access to
a given service only if it is run by the proper user and if the appropriate
permissions are granted.

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
_Cap_                     | **Cap**abilities
_DAC_                     | **D**iscretionary **A**ccess **C**ontrol
_DDOS_                    | **D**istributed **D**enial **O**f **S**ervice
_DOS_                     | **D**enial **O**f **S**ervice
_IPC_                     | **I**nter-**P**rocess **C**ommunication
_MAC_                     | **M**andatory **A**ccess **C**ontrol
_PAM_                     | **P**luggable **A**uthentication **M**odules
_SMACK_                   | **S**implified **M**andatory **A**ccess **C**ontrol **K**ernel
