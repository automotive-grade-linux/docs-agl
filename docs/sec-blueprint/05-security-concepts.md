---

title : Application Security Concepts
date  : 2016-06-30
categories: architecture, automotive
tags: architecture, automotive, linux
layout: techdoc 
 
---

**Table of Content**

1. TOC
{:toc}

## Security Principles
When connecting a car to the internet, not only we create a mobile entry
point to our private life, we also relocate our entry doors anywhere in
the world.

Neither all places on this planet are nice nor safe, nor are
the people.  
The locks and alarms on cars, will give only a fake
impression of security once that internet connection has entered the
place.

Internet enables the worse of human side to get access to private
domains.  
If we are not careful, it will likely be invaded in a very
short time following connection..

**So, connected cars security must be designed as a military vehicle
which would be deployed in a high risk zone even when designing cars for
out towns and villages**:

-   Physical access to the car should not be a white card to hack
    the system.  
    Most cars sleep in the streets and public car parks where physical
    accessibility is easy.
-   Known defect should be corrected by SW update in real time, without a return to
    home or garage.
-   A separation of functionalities in isolated domains should allow the
    car to remain safe and operational by limiting the contamination,
    would a malicious SW succeed to pass the protections.
-   Connectivity between the various domains should be restricted to the
    minimal set required for their operation.
-   Software loaded in cars and in the cloud should be vetted in
    accordance with its capability to access critical resources.  
    The vetting authority must be controllable, enforceable and revocable.
-   Inside each domain, sub domains should be created to limit even
    more, the nuisances capabilities of a successful malicious code.
-   Software or devices not wetted should never be able to access any
    critical resources.

**The strategy can be summarise as “anything, which is not explicitly
authorise is strictly forbidden”,also known as ‘white listing’ policy.**

We all understand those concepts, and nevertheless reports still show
that very little people care about implementing protection against those
risks yet.  
As a consequence most Connected Car projects are coming on
the market with major security holes.  
It will take some time *(and likely some catastrophes)* for the Automotive Industry to clean up the
pre-cyber security awareness designed products.

The complexity induced by a security framework requires serious effort
on the design side and complexifies the code execution.  
Fortunately our modern CPUs, which are very fast and ernergy efficient, can reduce this overhead
to very acceptable extra work load on the computing and energy
sub-systems.

The challenge of Connected Cars is very similar to embedded devices
in general.  
Within AGL we are defining solutions, which can enable this
new market to emerge without requiring each product design to be
chaperoned by security experts.  
*The world does not hold enough security experts to even overview even a few percent of the projects that are required
to create all connected devices that will be launched in the next 10
years.*

If embedded developers must implement complex security models
without, having neither the time nor the skills, to architecture them
correctly, *they can only succeed by reusing ready made trusted
solutions*.  
Fortunately Connected Cars are based on some flavour of
Linux operating system which has, due to its long serving years in many
critical domains, a large offering of security options.

AGL only focus on the security facilities offered under
Linux operating system for the connected car market.  
Non Linux Operating systems which can also be present in a connected car, are not covered by AGL platform security model.

## Strategy
There is no miracle solution.  
When deciding which security strategy, you
will need, first to try to evaluate all the possible attack vectors,
then to define your priorities and your limits.

Even if today complexity is mostly in the software (SW), we still need
some hardware (HW) to run it.  
Securing the HW is a very complex task which fortunately is likely yet not required for Connected Cars.  
I will not open more the topic here.  
Nevertheless applying a healthy design attitude by reducing obvious direct risk vectors (debug serial connector
wired in production, tracks with clear communication channel easy
accessible on PCB, …) should be done.

Would your automotive project requires a more protected HW, you will
find plenty of literature on that topic.  
I personally like this relatively old (2004) paper from J Grand as an introduction to the
domain.  
http://www.grandideastudio.com/wp-content/uploads/secure\_embed\_paper.pdf

On the SW side, the most efficient model is to work by layer :

-   **be sure that the desired SW is loaded**  
    On non connected devices, a trusted boot is considered a valid
    enough solution, but Connected Cars requirement to enable
    applications be added after the initial equipment provisioning,
    requires more than a simple trusted boot.  
    A strategy to control the integrity of the software and its
    configuration is required.
-   **Be able to change (upgrade) the software to correct a newly
    discovered risk.**  
    Assuming that the system will never be broken is an utopia.  
    The right strategy is to plan how to recover from the discovering of a
    new security issue to avoid its propagation.  
    *This upgrade mechanism must be particularly solid has it has to be
    capable of being executed on a compromised system without the
    support of a skilled operator.*
-   **Only select trusted Linux drivers.**  
    In Linux, drivers are executed with the same privilege level than
    the Kernel itself.  
    I short a malicious or hacked driver is an
    uncontrolled open door to the hart of the system.  
    Only vetted driver should be used and any complexity unique to the platform should be
    pushed in the user space domain.  
    This remark is particularly important when introducing drivers that are connecting with the
    outside world.  
    Ideally dynamic driver integration after boot should be banned even
    if that would limit the flexibility of hot plug for USB devices.  
    Solutions to reinforce the Linux Kernel integrity during execution,
    can be activated but they are an order of magnitude more complex to
    activate than keeping bespoke logic in user space.  
    https://www.isoc.org/isoc/conferences/ndss/11/pdf/3\_1.pdf
-   **Isolate the core of the system from the middleware.**  
    By default the protection on Unix type systems (and so Linux) is
    done by allocating the user a set of access rights.  
    The side effect is that any code running under a given name can access all the
    resources that is given to that user.  
    Furthermore it is possible at any time to further expend this access to other users.  
    *As most of code in traditional embedded software run with the Administrator
    privilege (root) we foresee the danger of this traditional
    embedded model.  
    Fortunately Linux provides a Security model called LSM.* (
    https://en.wikipedia.org/wiki/Linux\_Security\_Modules)  
    It allows to create an access strategy which is not controlled by
    the user but rather by the system configuration.  
    Multiple front end are available to control LSM and that will be studied a bit later in
    this paper.  
    This allows to create a Mandatory Access Control (MAC)
    which is a powerful tools to avoid compromised code to gain access
    to extra resources to propagate further.  
    Other restriction based on the c-groups, the Posix capabilities and
    the Seccomp can used in addition to LSM to further mitigate
    the risks.
-   **Isolate Applications**  
    IoS and Android phones have initiated the Apps model and nowadays
    launching a product which cannot be extended by Apps (from a closed
    or open Store) after the creation of the device is a risky
    marketing strategy.  
    While the model of Apps loaded from an open store is reserved to a very small category of mass consumer devices,
    the capability to load Apps after the creation of the initial SW is
    a very attractive way to reduce the time to market as well as the
    reaction time to changing market demand.  
    In particular it would allow car manufacturers, to customise the car
    SW, individually on the production line, to the buyer wish.  
    *By design Apps are created with a quite loose coupling with the
    core SW.  
    The default Linux DAC (Discretionary Access Model) is not
    the most reliable for limiting the access to the system capabilities
    to the minimum required.*  
    Associating the validation of the origin of an App to the resource
    that such App can claim access, with the enforcement of restriction
    in accessing the system resources to those explicitly granted, is a
    far more reliable approach.
-   **Private data protection**  
    *Cars know a lot about us, from where we go, to who we call, who get
    in our car (via the phone detection) and hold data that we are not
    willing to let go in the Open without our explicit consent.*  
    This creates three main families of requirements :

    -   Requires a safe provisioning of new devices and App in the
        system (know who is who and who does what. )
    -   Enforce encryption to any traffic going out.
    -   Enforce encryption on local storage for personal data to
        mitigate off line attack risk.
    -   Enforce isolation of devices own by multiple users that connect
        to the car.

## Secure Boot
The trusted or secured boot is a facility offered by most Systems on Chip (SoC)
which enforces :

-   booting the system in a known state  
    (e.g. all the RAM set to "0", all internal peripherals set
    to silent)
-   providing a validation that the loaded initial code is signed by a
    valid authority  
    (in short the SW is really coming from a known valid source).

As the feature is very closed to the HW, almost as many solutions exist
than SoC vendors and many of them requires to buy a large volume of SoC
in order to get access to the facility and are by that requirement not available to generic platform developers.

The Secured Boot option associated to a modern boot loader such as UEFI or uboot
allows to restrict the execution of the system initialisation code to those which which carries a valid signature.
Even if the system presents some weaknesses and constrains, it is likely
*a valid and accessible solution for most device manufacturers even for
medium volume.*

Once the trusted boot activated, you will have a good confidence
*(history shows that security loop holes are always available
somewhere)* that the code which will start to run when powering the
device, is the expected one.

## Read Only root file system.

In most embedded system the core OS is under control of the device
manufacturer.  
*A very simple and efficient way to limit opportunities to
get the core OS and middle-ware to be modified by a malicious code, is
to store it on a read only partition*.  
Even if that is not 100% bulletproof it seriously complexifies the level of required knowledge to
break into the OS and greatly eases, the implementation of a recovery
strategy.

In order to enable some local persistent changes such as those required
to register some network or locale configurations, an overlay can be
created for some directories.  
Since Linux 4.0, the kernel supports by default OverlayFS which provides that facility and support the extended
file attributes required by file base MAC such as SELinux and Smack.  
https://github.com/torvalds/linux/commit/e9be9d5e76e34872f0c37d72e25bc27fe9e2c54c

## Code Integrity during execution

In the embedded world it is quite acceptable to restrict the end user to
operate the system as designed.  
We can take profit of this favorable position, to limit the capabilities of a malicious applications to
change our Operating System (OS) after the protected initialisation
(trusted boot).  
This can be done *by activating an integrity enforcement such as IMA/EVM on all the core OS.*  
http://sourceforge.net/p/linux-ima/wiki/Home/

In short IMA allows the kernel to check that a file has not been changed
by validating it against a stored/calculate hash (called label) while
EVM checks the file attributes (including the extended ones).

Two types of labels are available :

-   immutable and signed
-   simple

The signed labels are reserved for code or data which are static and
provide the best level of protection.  
The signing tool remains external of the device.  
The simple hashes are reserved for code which can be
install dynamically and the hash can be recalculated on the fly by the
OS providing a lesser level of protection.

Obviously some restriction will be imposed on which SW modules are
allowed to update an IMA/EVM label and all public keys used for
signature checking must be protected with an unmutable label or stored
in the HW security sub-system.

## Update and Ugrade

The integrity enforcement does not allow immutable files to be updated
on line.  
The Integrity system would detect the violation and block any
further reading of such file.

*The update solution must cater with this constrain and must be
implemented via an atomic model where all changes are done in one step,
on the entire core OS, generally just before a reboot..*

## Mandatory Access Control (MAC)

Connected Cars are comparable to middle volume consumer managed products
(very similar to connected TV), by this, I mean, product where the
software is entirely provided by the device manufacturer.  
The main side effects are well known :

-   low cost and small CPU
-   high control of the OS and Middleware loaded on the box
-   user, at best, very slow to activate update
-   no visibility by the manufacturer of the external environment where
    the device is connected.
-   No skilled administrator
-   No recovery console.

For those reasons, a solution like Smack has been selected by AGL as the
best suited LSM front end.  
Furthermore, its adoption on Tizen by Samsung
for delivering millions of Smart TVs enable an active community focussed
on keeping good performance on smaller CPUs.  
<https://wiki.tizen.org/wiki/Category:Security>

## Applications
*Apps are the weak security vector in many modern system.*  
Car manufacturers need to add bespoke/localised App developers in order to
make their product commercially attractive.  
It is a fast moving world very different to the use and habits of the Automotive industry.

Defining the right level of App vetting is a real challenge.  
A quick reality check on markets where Apps exist, such as Mobile, Smart TV or
Smart Watches, show that the detection of roke Apps is very complex
already on platforms that impose the execution via a Virtual Machine, so
we can imagine what is the complexity, when native code support is
required in order to run on very small CPU.

**As we cannot fully trust Apps, we have to contain them**.  
This can be done by :

-   Limiting Apps download origin to trusted ones.
-   Restrict Apps privileges, resources and APIs access to what is
    explicitly authorised
-   Isolate Apps runtime

Restricting Apps origin to trusted source is quite simple.  
The simple use of a certificate to validate the App signature is a powerful model
when associated with an installer code which cannot be called via a back
door.  
A simple model consists in separating the download process and
exposed (UX, connected) from the installer code which can validate the
App origin and installation in a isolated process with a lower surface
of attack.

Restricting Apps privileges requires first to know what are the
requested and authorised privileges.  
The granularity of these privileges, must offer a good flexibility while remains simple, to be
understood by the developers and the user.  
The compromise will depend of the target audience.   
The current return of experience from Android and Tizen, tend to reduce the list of privileges to a shorter list rather
than in opposite.  
The creation of goup or App class is an other valid model.

The list of requested privileges will be associated to the App in a
Manifest.  
A practical extra validation of the requested privileges can
be done depending of the App origin and signature level (e.g.
Manufacturer, Partner and Community stores).

The association between the App and its privileges list must be kept
safe and available for enforcement in the system.  
The Samsung originated Open Source project Cynera (https://github.com/Samsung/cynara) provides
such service and is optimised for execution on small SoC.

Isolating the App when running is the most challenging task, it requires
to let the App access enough of the system to execute its task but no
more, to mitigate any malicious activity.  
One model to address this challenge consist in slicing the access to the system :

-   CPU, RAM
-   devices
-   network
-   middleware
-   files
-   libraries and system calls.

CPU and RAM over use can be restricted with a correct C-Group
configuration.

Devices and files can be isolated by MAC and DAC.

Network access can be controlled via MAC in association with the
nftables.

Middleware in AGL is access via binders which provides not only an
isolation via creation of different security context but adds the
concept of authentication which limit attack through man-in-the-middle
*https://en.wikipedia.org/wiki/Man-in-the-middle\_attack*.

The control of Libraries and system API usage is far more complex.  
MAC advanced usages can help in this domain but Seccomp-BPF can go further.  
Seccomp which is an upstream feature of the Linux kernel is used by
Mozilla and Chrome in their browsers and enable a low level protection
solution.  
Seccomp can quickly induce a performance hit and access rules
must remain simple.  
The following page provides interserting reports on performance cost of
that feature. (https://wiki.tizen.org/wiki/Security:Seccomp) for one
system.

### Name spaces

Containers have made Linux name spaces visible to the mass.  
They are very popular and unfortunately often confused with security enforcement
due to their common use as light virtualisation solution in the cloud.

Whichever model of container is referenced, they all use the Linux
various name spaces
(http://man7.org/linux/man-pages/man7/namespaces.7.html).  
The general idea is to share a common kernel and to let each containers run its own
virtual Linux user space and middleware.  
With the increased CPU performance and the facility provided by novel filesystem architectures
such as overlayfs, the files and code which happen to be unchanged
between different containers can even remain shared transparently on
disk and in RAM, enabling the use of containers for single App in the
cloud or on small embedded system.

From a security point of view, while containers provides an isolation
between themselves, it must remain present to the designer that :

-   kernel is shared and security weaknesses and zero day defects can be
    used to cross domains.
-   As each container can provides its own version of the middleware,
    upgrading the system is not enough to correct known security issues.  
    Each container must individually be updated.
-   Due to the transparent overlay model sharing files between
    containers, predicting the actually used disk space is challenging.
-   UX needs to share the same Display and Input what can open back
    doors in the system.

At least two lines of interest seem to provide a serious value for the
Automotive domain :

-   Isolating subsystem
-   Easing development

The isolation model is very interesting when multiple service providers
needs to share the same embedded device.  
A commonly listed use case, is the sharing of an IVI system with games or cloud multimedia services.

The ease of development, is potentially even more valuable.  
One of the challenge faced by the embedded SW industry is the lack of skilled
embedded software developers.  
*Enabling web and traditional IT programmers to work in a known environment and to run their App on an
IoT device without requiring to become an embedded SW expert would be of
a high value*.

The Smack provides a solution to create MAC name spaces, so in theory
nothing would stop to launch containers for each Apps in an isolated
environment.

As further reading on similar topic, you can have a look at the Open
Source Vasum project.  
https://github.com/Samsung/vasum  
https://wiki.tizen.org/wiki/Security:Vasum

## Process Management
While developers will always have a good reason for delaying the
activation of the security layers, to succeed, you will need to keep a
few base concepts enforced:

-   Security is invasive. It goes everywhere.
-   Security cannot be apply as a patch at the end of the project.
-   System must be developed with the security 'on' or it will
    never work.
-   SW must be written secured first time, as late adaptation is
    too difficult.
- Underestimating the resistance of the developer team is a common
mistake which can lead to massive over costs and delays.
- Implication of the right expert and management drive from the beginning is a
requirement that cannot be negotiated.
