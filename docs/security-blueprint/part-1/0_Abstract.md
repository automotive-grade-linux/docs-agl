# Part 1 - Hardware

## Abstract

The Automotive Grade Linux platform is a Linux distribution with **AGL** compliant applications and services.
The platform includes the following hardware:

- SoC (System-on-Chip).
- Memory (RAM, ROM, storage, etc.).
- Peripherals.

You will find in this first part everything that concerns the hardware security.
The goal is to protect system against all attacks that are trying to gain
additional privileges by recovering and/or changing cryptographic keys in order
to alter the integrity of the boot. We should also prevent hardware modifications
in order to achieve this goal. We will expose below some examples of possible
configurations.

--------------------------------------------------------------------------------

## Acronyms and Abbreviations

The following table lists the terms utilized within this part of the document.

Acronyms or Abbreviations | Description
------------------------- | --------------------------------------
_HSM_                     | **H**ardware **S**ecurity **M**odule
_NVM_                     | **N**on-**V**olatile **M**emory
_SHE_                     | **S**ecure **H**ardware **E**xtensions

--------------------------------------------------------------------------------

## Integrity

The board must store hardcoded cryptographic keys in order to verify among others
the _integrity_ of the _bootloader_. Manufacturers can use **HSM** and **SHE** to
enhance the security of their board.

<!-- section-config -->

Domain               | Object     | Recommendations
-------------------- | ---------- | ----------------------------------
Hardware-Integrity-1 | Bootloader | Must control bootloader integrity.
Hardware-Integrity-2 | Board      | Must use a HSM.
Hardware-Integrity-3 | RTC        | Must not be alterable.

<!-- end-section-config -->

--------------------------------------------------------------------------------

<!-- pagebreak -->

## Certificates

<!-- section-config -->

Domain                 | Object | Recommendations
---------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------
Hardware-Certificate-1 | System | Shall allow storing dedicated certificates.
Hardware-Certificate-2 | ECU    | The ECU must verify the certification authority hierarchy.
Hardware-Certificate-3 | System | Allow the modification of certificates only if the source can be authenticated by a certificate already stored or in the higher levels of the chain of trust.

<!-- end-section-config -->

--------------------------------------------------------------------------------

## Memory

<!-- section-config -->

Domain            | Object     | Recommendations
----------------- | ---------- | ------------------------------------------------------------------------------------
Hardware-Memory-1 | ECU        | The ECU shall never expose the unencrypted key in RAM when using cryptographic keys.
Hardware-Memory-2 | Bootloader | Internal NVM only
Hardware-Module-3 | -          | HSM must be used to secure keys.

<!-- end-section-config -->
