---

title : Security BluePrint Overview
date  : 2016-07-06
category: security
tags: security, architecture, automotive, linux
layout: techdoc 
 
---

**Table of Content**

1. TOC

{:toc}

## Introduction

### Abstract

This document describes how it is possible to create reasonably secured connected cars using already available Open Source components.  
The complexity attached to such project is clearly exposed for each step and may seem a quite heavy reading.  
Fortunately ready made solutions are coming on the market (Open Source and Proprietary), enabling short cuts for many of us.

The documentation mostly focusses on the embedded side of the problem leaving the cloud components and manufacturing processes for further study.

### The risk is real

Connected cars, to be accepted by users and keeping under control liability of the Automotive Industry will have to solve many issues ranging from physical, direct, and remote and indirect cloud attacks.  
A large section of unsolved technical security challenges, lies in car connectivity to user owned devices and well as to cloud.  
The Automotive Industry, by opposition to those operating in cloud and mobiles businesses, has little experience of security issues and no long return of experience.  
Proven solutions derived from the IT world are for most of them, inapplicable.

For many people the Cyber Security risk for the Automotive industry is still at best not understood and unfortunately more often, simply ignored.  
If the Fiat-Chrysler cyber car jacking has forced the industry to open their eyes, it is just a beginning.

- 24 Jul 2015 Hacking a radio in a car:  
    *"… the computer systems built into Fiat Chrysler cars: the flaw can
    be exploited by an attacker to wirelessly take control of the
    engine, brakes and entertainment system ..."  
    "… the US National Highway Traffic Safety Administration has
    recalled 1.4 million of the manufacturer's cars after a dangerous
    software flaw was revealed just days ago..."*  
    <http://www.theregister.co.uk/2015/07/24/chrysler_recall_for_wireless_hacking_hole/>
- One day (likely not that far) we could see car blocked by
    ramsomware, or cyber terrorism using cars as weapon if nothing is
    done.  

As malicious hackers or terrorists are smart and well organised, we know 
that if we let them enter a system, even by a side door, they will work
they way to the more juicy part of the system to monetise their work.

As connected cars are going to interact with our phone and the cloud,
they will become a vector of attack not very dissimilar to the video
surveillance cameras in recent cyber attack with the added complexity
that tracking a mobile source will be more complex.

 <http://www.theregister.co.uk/2016/10/10/iot\_botnet/>

## Scope

Designing Connected cars without enabling a high level of security is
not acceptable and will be soon a key market requirement for any
respectable automotive company.  
AGL is aimaing at providing a reasonable level of security by default.  
The level of default security will evolve with the time and future releases to align with market expectations and needs.

In order to converge on such an open question, we need to take
assumptions which are realistic for the targeted domain, in our case a
Connected Car.

The assumptions selected are the following:

- Secure boot with Hardware chain of trust.
- recent LTSI based kernel (4.1.x, 4.9.x, ...)
- kernel and middleware securely updated once in a while  
 in the future that rate will increase a lot.
- Middleware and Application compiled with up-to-date compiler
 protections activated and checked through a static analysis process.
- Rootfs (/) in read-only, /home encrypted., integrity protected by
 IMA/EVM
- Customisation reduced to Apps vetted by the manufacturer's store
- 24/7 connection to the outside world (sensor and internet).
- Developer mode not active by default.
- There is no administrator (only a user) for the product which mostly
 run non attended.

We can see that in such configuration, the base OS (kernel&middleware)
represents a well guarded entry point for a malicious hacker.  
The combination of trusted boot, integrity enforcement and rootfs in ro,
creates a set a garded walls to anyone, who would try to modify valid
code on the product.

The main risks will lie in the exploitation of Zero Days security holes
in the base OS (by definition correction and update is always an after
the fact event in that case) and the Apps store where vetting process
cannot afford to be that solid if real flexibility is required.

We cannot completely avoid external activation of the base OS security
holes (publicly known or not) but we can limit the actions and reach of
any compromised code.

We will start by reducing the surface of attack by designing a product
without open backdoors (e.g. cars drivers do not need a ssh connection
nor tcpdump), so why to install the such development code on the image,
and continue by reducing the capabilities which can be claimed by any
code to the minimum required.  
This can be done by running the code with a non administrator’s user ID 
(non root) and by removing the unrequired capabilities and file access 
at code launch via Mandatory Access Control (MAC) and the Posix Capabilities.  
In the case of Smack, the general concept is to associate different
label to specific code.  
As the MAC label cannot be changed by theprocess itself, it enables the security rules set to enforce the respect
of the predefine code behaviour.  
Code with connects to the outside world
by any mean, should first benefit of these special security
configurations.  
The default policy should be good enough cover the security needs of most non connecting code.

Once the surface of attack is reduced, you need to reduce possible
damage when a malicious user will have found his way in.  
*Please remember that in security the question is not to know if someone will
break in, but rather when, how you will detect it, and how to limit
potential damages.*

In this phase we will take care to limit options for a malicious user to
move sideways and activate code that would help him to get more control
over the system.  
We will pay a detailed attention to any code which can
grant more privileges, change MAC label, create new user, install new
Apps or update.  
Those types of code are normally called from a very
limited entry points in the system and once again the MAC system is your
best friend when it comes to restrict activation from valid vector.

## Glossary

DAC Discretionaly Access Control
MAC Mandatory Access Control
SoC System on Chip