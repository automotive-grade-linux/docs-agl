---

title : Application Security
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
implement application security

# Application Definition
The term of Application (App) has a very wide definition in AGL.
Almost anything which is not in the core Operating System (OS) is an Application.
Applications can be included in the base software package (image) or
can be added at run-time.

# Application Installation
Applications are installed under the control of the Application Framework (AppFw).
Applications can be delivered and installed with the base image using a
special offline-mode provided by the Application Framework. Apps can also be installed
at runtime.

**Note** In early release, default Apps are installed on the image at first boot.

# Application Containment
Application containment is achieved using the following protections:

* **Linux Native protection**
  * Mandatory Access Control (SMACK)
* **AGL Platform protections**
  * Origin Tracking and Validation
  * Application Privilege Management and Enforcement via Cynara
  * Authenticated Transport via D-Bus

## Mandatory Access Control
Mandatory Access Control (MAC) is a protection provided
by the Linux kernel that requires a Linux Security Module (LSM).
AGL uses an LSM called Simplified Mandatory Access Control Kernel (SMACK).
This protection requires writing SMACK *labels* to the extended attributes of the file
and then writing a policy to define the behavior of each label.
The kernel controls access based on these labels
and this policy.
For more details on SMACK scheme in AGL, please refer to the
security platform security document in the security blueprint.

## Origin Tracking and Validation
Currently, AGL applications are tracked and verified at installation
time by the application and security framework using SMACK labels.
For more details, please refer to the application framework documentation.

## Privilege Management and Enforcement
Application priveleges are managed by Cynara and the security manager
in the application framework.
For more details, please refer to the application framework documentation.

## Autenticated Message Transport
Currently AGL uses the D-Bus interface for transport, using the security
inherent in this interface.
