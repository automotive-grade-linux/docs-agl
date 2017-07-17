---

title : Security Concepts
date  : 2017-07-07
categories: architecture, automotive
tags: architecture, automotive, linux
layout: techdoc

---

**Table of Content**

1. TOC
{:toc}


This document addresses the following security concepts that help make
connected vehicles less vulnerable to security threats.

## Secure Boot

Secure boot refers to preventing malicious software applications and
"unauthorized" operating systems from loading during the system start-up
process. The goal is to protect users from rootkits and other
low-level malware attacks. Modern bootloaders come with features that
can be used to enable secure boot in the system.

## Software Integrity

The goal of software integrity is to ensure that all software running on
a system has not been altered in any way, either accidentally or
maliciously. This is typically achieved by checking a file's hash or
signature against a protected, “good” value that exists in the system.
Maintaining software integrity ensures that your system behaves as
intended. In principle, it protects the system against any malicious
code trying to tamper your system.

## Secure Update/Upgrade

Software updates in connected vehicles are a very useful feature, which
can deliver significant benefits. If not implemented with security in
mind, software updates can incur serious vulnerabilities. Any software
update system must ensure that not only are the software updates to
devices done in a secure way, but also that the repositories and servers
hosting these updates are adequately protected. As the process of updating
software migrates from a `Dealership` update model towards an `Over-The-Air`
update model, securing these processes becomes a high priority.

## Layered Security

It has been well established amongst software security researchers, that
a layered approach to security ensures a stronger protection against attackers.
A multi-layered approach to security should be included when designing the
architecture of a connected car. The goal is to ensure that even if one layer
of security is compromised, the other layers will protect the platform, while at the
same time making it harder for attackers to breach the security of the
system.

## Read-Only File Systems

When following a layered security design, one simple yet effective way
to protect the platform is to make the file system read-only. It is
important to note that making the filesystem read-only is not a
foolproof security mechanism. It does, however, make life more complex
for an attacker.

## Mandatory Access Control

Mandatory Access Control (MAC) refers to a type of access control in a
Linux system that constrains the ability of a “subject” to access a
“resource”. The Linux kernel makes these decisions based on a
pre-existing policy. User are not allowed to override or modify this
policy, either accidentally or intentionally. MAC uses the underlying
kernel framework of Linux Security Modules (LSM). There are multiple
LSMs available including SELinux, Simplified Mandatory Access Control
Kernel (SMACK), AppArmor and others. AGL uses SMACK as the MAC.

## Secured Applications

Applications in the modern car are steadily improving the dashboard and
control of the car. Applications have also proven to be frequent point
of attack for hackers. In AGL, The term of Application (App) has a very
wide definition. Almost anything which is not in the core OS is considered
an Application. At the same time, when talking about the security of applications,
any mobile applications that have been designed to interact with the car
must also be considered. Secured applications are mission-critical for OEMs
who want to meet customer expectations for innovative software features,
while ensuring the safety and proper functioning of their vehicles.
