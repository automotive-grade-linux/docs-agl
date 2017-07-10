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

- A SoC
- RAM, ROM and Storage
- Peripherial

The AGL SW platform includes all the SW required after the initial boot loader in order to support AGL compliant applications and services :

- Linux BPS configured for the reference boards
- Set of drivers for the common peripherials available on the reference boards (they may not all be Open Source)
- Application Framework
- Windows/layer management to allow Application to gracefully share the displays
- Sound resource manager to allow Application to gracefully share the displays
- An atomic update system support / as read only and MAC (Smack)
- Set of building and debug tools (based on yocto project)

## Secure boot

The secure boot is tighly linked to the SoC and will vary from SoC to SoC.  
AGL does not provide the secure boot but AGL platform is designed to be able to operate with a secure boot.

## Certificate and Key Management

The default Key management provided by AGL is SoC independant and use leyrings.  
This model is less secured than a SoC HW integrated model and we advise AGL adopters to activate HW support from their selected SoC as much as possible.  
The activation of HW support for Key management if left to the integrator.

## Madatory Access Control configuration

The general Smack schema used by AGL is inspired from Tizen 3 Q2/2015
but tries to enable a better protection of code ran via run time (e.g.
JavaScript, Python) and enable Cloud/Device hybrid applications model.

It takes into account the Tizen2 experience of creating too complex MAC
rules and limit the use of MAC for process file access tracking leaving
the application capabilities management to other model (Cynara and the
Security manager).

<https://wiki.tizen.org/wiki/Security/Overview\#Implementation\_in\_Tizen\_3.0\_2015.Q2>

** You will notice that the Smack initial configuration described bellow,
even if not obvious to read, represents a manageable complexity which
should be understood in no more than a few hours.**

This initial Smack schema tries to clearly keep the differentiation
between the execution Smack label of a Process and the Smack label of a
file.  
The first one defines which file a process can access and how
files will be created by the process.  
The second defines which process can access the file.  
By default a process will execute with its file
access Smack label but that can be overwritten by an execution Smack
label.

The system is split in 3 domains : 

- **Floor**, which includes the base services and associated data and libraries of the OS which are unchanged during the execution of the OS.  
  Outside of development mode, installation and upgrade software, no one is allowed to write in Floor files and directories.
- **System**; which includes a reduced set of  core services of the OS and the data that they maintain.  
  Those data are expected to change during the execution of the OS.
- **Apps, Services and User**, which includes code providing services to the system and user and their associated data.  
  Per concept all code running in this domain are under strict control and isolation by the Cynara and Smacks rules.

## Floor Domain

-------------------------------------------------------------------------------------------------------------------------

|Label|   Name |   File     | Process                             | Comment                                              |
|:-:|:-------|:-------------|:------------------------------------|:-----------------------------------------------------|
| |
| -   | Floor  | r-x for all  | Only kernel and internal kernel thread |  --                                              |
| ^   | Hat    | --- for all  | rx on all domains                 | only for privileged system Services (today only systemd-journal) useful for backup or virus scan. No file with that label should exist except debug log.  |
| *   | Star   | rwx for all  | None                                | used for device files or /tmp Access restriction managed via DAC. Individual files remain protected by their Smack label.  |

## System Domain

-------------------------------------------------------------------------------------------------------------------------

|Label|   Name |   File     | Process                             | Comment                                              |
|:--|:-------|:-------------|:------------------------------------|:-----------------------------------------------------|
| |
|System|System|none|Privileged processes|Process should only write on file with transmute attribute.|
|System::run|Run|rwxatl for User and System label|None|files are created with directory label from user and system domain (transmute) Lock is implicit with w.|
|System::shared|Shared|rwxatl for system domain r-x for User label|None|files are created with directory label from system domain (transmute) User domain has lock privilege|
|System::Log|Log|rwa for System label xa for user label|None|Some limitation may impose to add w to enable append.|
|System::Sub|SubSystem|SubSystem Config files|SubSystem only|Isolation of risky SubSystem**|

- Runtime:  IoT-OS AppFW always starts a new instance of the runtime for each application (no shared process model is allowed and change the runtime process label to the App Smack label)
- Unconfined mode is reserved for future evolution.

## Apps, services and User Domain

-------------------------------------------------------------------------------------------------------------------------

|Label|   Name |   File     | Process                             | Comment                                              |
|:--|:-------|:-------------|:------------------------------------|:-----------------------------------------------------|
| |
|App::$AppID|AppID|rwx (for files created by the App). rx for files installed by AppFW|$App runtime executing $App|One Label per App. A data Dir is created by the AppFW in rwx. Older releases still use User::App::$AppID |
|User::Home|Home|rwx-t from System label r-x-l from App|None|AppFW needs to create Dir in /home/$USER/App-Shared at 1st launch if not present/ with label app-data access="User::App-Shared" without transmute.|
|App-Shared|Shared|rwxat from System and User domains label of $User|None|Shared space between all App running for a given user. Older releases may still use User::App-Shared|

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
 
Any update software respecting these requirement can be used.  
AGL advise strongly to only use solutions that enable a strong verification of the validity and integrity of the download update or upgrade what ever is the selected solution.

## cloud service infrastructure