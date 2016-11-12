---

title : platform Security
date  : 2016-06-30
categories: architecture, automotive
tags: architecture, automotive, linux
layout: techdoc 
 
---

**Table of Content**

1. TOC
{:toc}

## Platform Definition
The platform includes a set of HW supporting an AGL Linux distribution and AGL compliant Application and Services.
On the HW side this will include :
 - a SoC
 - RAM, ROM and Storage
 - Peripherial
The AGL SW platform includes all the SW required after the initial boot loader in order to support AGL compliant applications and services :
 - Linux BPS configured for the reference boards
 - Set of drivers for the common peripherials available on the reference boards (they may not all be Open Source)
 - Application Framework
 - Windows/layer management to allow Application to gracefully share the displays
 - Sound resource manager to allow Application to gracefully share the displays
 - an atomic update system support / as read only and MAC (Smack)
 - set of building and debug tools (based on yocto project)

## Secure boot
The secure boot is tighly linked to the SoC and will vary from SoC to SoC.
AGL does not provide the secure boot but AGL platform is designed to be able to operate with a secure boot.

## Certificate and Key Management
The default Key management provided by AGL is SoC independant and use leyrings. Thismodel is less secured than a SoC HW integrated model and we advise AGL adopters to activate HW support from their selected SoC as much as possible.
The activation of HW support for Key management if left to the integrator.

## Madatory Access Control configuration
The general Smack schema used by AGL is inspired from Tizen 3 Q2/2015
but tries to enable a better protection of code ran via run time (e.g.
JavaScript, Python) and enable Cloud/Device hybrid applications model.

It takes into account the Tizen2 experience of creating too complex MAC
rules and limit the use of MAC for process file access tracking leaving
the application capabilities management to other model (Cynara and the
Security manager).


https://wiki.tizen.org/wiki/Security/Overview\#Implementation\_in\_Tizen\_3.0\_2015.Q2

*You will notice that the Smack initial configuration described bellow,
even if not obvious to read, represents a manageable complexity which
should be understood in no more than a few hours.***  
**

This initial Smack schema tries to clearly keep the differentiation
between the execution Smack label of a Process and the Smack label of a
file. The first one defines which file a process can access and how
files will be created by the process. The second defines which process
can access the file. By default a process will execute with its file
access Smack label but that can be overwritten by an execution Smack
label.

The system is split in 3 domains : ***(to be updated with latest model)***

-   **Floor**, which includes the base services and associated data and
    libraries of the OS which are unchanged during the execution of
    the OS.
-   **System**; which includes the basic services of the OS and the data
    that they maintain. Those data are expected to change during the
    execution of the OS.
-   **User**, which includes code providing services to the user and
    their associated data.

**Note: ** Smack label names must be less 254 Char long. In order to be
able to use Smack label on Netlabel CISCO (IPv4) a schema creating label
of less than 23 Char will be required.

So please note that the name given in this table are for clarification
kept in their long form, but are likely going to be shorten in a real
implementation.

***WIP table of smack label required***

## Secured transport for Binder implementation

## Resource Management

## Trust Zone and Trusted Execution
Trusted zone and Trusted execution are services provided by the SoC vendors and services offered can varie even within the same familly of SoC depending of their configuration.
AGL platform does not provide any Trusted Zone or Tusted Execution direct support as these are specific to each indivual SoC but on the other side the AGL platform is architectured to ease the use of HW helpers.
In particular AGL advise whenever possible to take profit of HW helpers available to store critical data in the secure zone and to execute critical validatin code (in particular signature check) in trusted execution mode.

## Critical Resource Protection

## AGL Platform Software Update
AGL platform provides by default a software update module which is capable to respect the AHL platform update requirements:
 - support Smack as MAC
 - support read only / file system
 - support integrity enforcement such as IMA and EVM.
 - 
Any update software respecting these requirement can be used. AGL advise strongly to only use solutions that enable a strong verification of the validity and integrity of the download update or upgrade what ever is the selected solution.

## cloud service infrastructure

