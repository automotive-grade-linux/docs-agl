# Part 8 - Update (**OTA**)

## Abstract

Updating applications and firmware is essential for the development of new
features and even more to fix security bugs.
However, if a malicious third party manages to alter the content during
transport, it could
alter the functioning of the system and/or applications. The security of the
updates is therefore a critical point to evaluate in order to guarantee the
integrity, the confidentiality and the legitimacy of the transmitted data.

## Attack Vectors

Updates Over The Air are one of the most common points where an attacker
will penetrate. An OTA update mechanism is one of the highest threats in the system.
If an attacker is able to install his own application or firmware on the system,
he can get the same level of access that the original application or firmware had.
From that point, the intruder can get unfettered access to the rest of the system,
which might include making modifications, downloading other pieces of software,
and stealing assets.

### Man In The Middle (MITM)

The man-in-the-middle attack is the most classic example of an attack, where an adversary
inserts himself between two communicating entities and grabs whatever is being communicated.
In the case of OTA attacks, the connection in the network may be intercepted:

* On the internet, before the cloud back-end.
* At the base station, 3G,4G,5G connection to the internet.
* At the receiving antenna, connection to the car.
* Between the receiving antenna and the gateway router (if present), connection within the car.
* Between the gateway router and the target component (IVI, In-Vehicle Infotainment unit).

There are many ways to mount a MITM attack. For example, proxy tools like Burp Proxy can
be used to intercept web traffic as a man-in-the-middle. Under the guise of being a testing tool,
the proxy server is often used in attack scenarios. It runs on a variety of platforms.

As another example, false base station attacks are known to be fairly easy to set-up.
The problem is apparently fairly prevalent in countries like China and in the UK.
These fake base stations are sometimes just eavesdropping on the communication,
but others have the potential to do serious harm.

Defenses against MITM attacks include encrypted and signed data pipes. Furthermore,
architects and developers are also recommended to encrypt and sign the payloads that are
being passed over these pipes, to defend against perusal of the data.

### Man At The End (MATE)

The man-at-the-end attack is when an intruder analyzes the end-point of the communication when
software is accessing the data communication. This is a more severe attack type where the attacker can:

* Steal keys.
  * For example, a simple debugging session in running software could reveal a key used in memory.
* Tamper software.
  * For example, replacing just one function call in software with a NOP (i.e. no operation) can drastically change the behavior of the program.
* Jam branches of control.
  * For example, making a program take one branch of control rather than the intended branch can mean the difference between an authorized and a non-authorized installation.
* Modify important data.
  * For example, if the data changed is a key or data leading to a control path, then this attack can be severe.
  * In the case of OTA updates, MATE attacks are particularly problematic for the system. One of the consequences of MATE attacks can be installed software that allows installation of any other software. For example, an attacker might install remote access software to control any part of the system.

--------------------------------------------------------------------------------

## Acronyms and Abbreviations

The following table lists the terms utilized within this part of the document.

Acronyms or Abbreviations | Description
------------------------- | -------------------------------------------------------------------------
_FOTA_                    | **F**irmware **O**ver **T**he **A**ir
_MATE_                    | **M**an **A**t **T**he **E**nd
_MITM_                    | **M**an **I**n **T**he **M**iddle
_OTA_                     | **O**ver **T**he **A**ir
_SOTA_                    | **S**oftware **O**ver **T**he **A**ir
_TUF_                     | **T**he **U**pdate **F**ramework
