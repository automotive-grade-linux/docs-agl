---

title : Application Security
date  : 2016-12-07
categories: architecture, automotive
tags: architecture, automotive, linux
layout: techdoc 
 
---

**Table of Content**

1. TOC
{:toc}

## Application Definition

The term of Application (Apps) has a very wide coverage in AGL.  
To make it short, anything which is not in the core OS, is an App.

Apps can be included in the base image or added after the fact, they can offer a UI, or only offer a service.  
In AGL, most of the middleware will be treated as Apps.

## Apps must be installed

Undependently of the fact that Apps are delivered with the base image or later installed on a running image, Apps are installed under the control of the Application Framework (AppFW).  
A special off-line mode of the AppFW, allows to install Apps at image creation.\*

**Note :** In early release, default Apps are installed on the image at first boot.

## App containement

Apps are running in isolation of the system and other Apps.  
In order to acheive an efficient containement multiple strategies are used :

* **Linux Native protection**
  * Smack label (Mandatory Access Control)
  * Capabilities
  * Names Spaces
  * Seccomp filter
  * Cgroup
  * File Integrity
* **AGL Platform protections**
  * End2end App author tracking and validation
  * Apps Privileges
  * Autiticated Apps to Apps/Services transport

## Which protection are enforced on an App

### App origin

The AGL App development process enforces of the level of autorisation given to an App developper and tracks that autorisation level end2end.
Depending of the implementation, the tracking may be :

* static, simply enforced at the registration of the App on the repository or dynamic. 
* dynamic, track and verified at installation by the AppFW.

The origin tracking and validation is critical.  
It is the first section the chain of trust for providing valid information to the AppFW installer module.

### Platform security configuration

The AppFW derives from the Meta data received with the App at delivery, which privileges will be granted to this App :

* Max CPU, RAM, IO, ...
* Firewall configuration
* Name spaces ...

It will create the directories required for the App following the Smack rules described in the "Platform Security" blueprint as well as the associated systemd config files to be used by the launcher.  
As the platform securities services are static for a given release of the OS, the mapping remains simple.

**Important**:

* An App cannot change the CoreOS.

It s not allowed for an App to modify or add an element to the CoreOS.  
Like with containers App are required to embed all the code required for their operation.  
Within this limitation Apps (which can be a only a service) can still offer services to other App by the mean of AGL binders which use the autenticated AGL transport.

### AGL Platform protections

By default AGL provides three specific protection services :

* Privilege management and enforment via cynara
* Autenticated transport (via AGL binders, websocket and Oauth2)
* App origin validation

Because AGL Apps also include services provided by Middleware, new APIs can be created by Apps and new privileges may be required to access those API.  
e.g. a Free Parking space service App from Vinci may offer an API for any Navigation system to read the free parking space count for a given location in order to display it on the Map.  
We may not want to leave wide open that new API what would induce mobile data with its associated charges.

That small use case, shows how AGL AppFW will not only, have to register the privileges requested by an App in Cynara, it will also have to add new privileges associated with API created by Apps.

### Protections enforcement

Platform Securities are enforced by Linux as soon as they are activated.  
This is the simpler case.  
We just need to be sure that means to deactivate those protections are removed from the kernel configuration (see Kernel hardning).

AGL Platform protections are mostly enforced by dedicated middleware which are protected by the platform securities.  
Some more risky zones are identified :

* the creation of binding where an App could create a look a like binding that does not respect any protection.
* services which provide a wide range of service and need to restict the user request following his profile.

The first one can be enforced by removing by setcomp the option to create websocket directly by an App and requesting the creation to be done via a trusted service at binding enabling.  
The second requires a duplication of some API in order to be able to keep the filtering on the verbs of the API without requiring to drill down to the parameters.

The side effect of this complexity will impose to create an introspection mode where there is the possibility to verify all the API offered by an App and which privileges are required to activate them.

### Privilege grouping

In order keep the concept of White listing manageable, a privilege hiercharchy is used.  
A small example shoudl clarify that concept.

* System:Com:SMS:notify
* System:Com:SMS:list
* System:Com:SMS:display
* System:Com:SMS:send
* System:Com:SMS:transfer
* System:Com:SMS: (*the* requires to be explicit on global capability request)
* System:Com:Phone:notify
* System:Com:Phone:list
* System:Com:Phone:display
* System:Com:Phone:send
* System:Com:Phone:transfer
* System:Com:Phone:* 
* System:Com:*              (includes SMS:* & Phone:*)
* System:Com:*:notify     (includes SMS:notify & Phone:notify)

  That last concept might be too complex to implement and real usefulness should be validated.
