# Firmware Over The Air

The firmware update is critical since its alteration back to compromise the
entire system. It is therefore necessary to take appropriate protective measures.
The principle of verifying chain integrity fulfills much of AGL's security.
During a firmware update, it is necessary to update the different signatures to
check the integrity of the system.

There is also the constraint of the update time: The system must start quickly
and therefore, update itself as quickly. We imagine that the **FOTA** is mainly
used in the vehicle maintenance session (e.g. Garage). We will then use no more
 **FOTA** but a wired update. There is a limit to what can be updated wirelessly.
 This maintenance update could solve these problems.

Field upgrades can be achieved securely by using a Secure Loader. This loader
will authenticate an incoming image (USB, Serial, Network) prior to writing it
to the flash memory on the device. It should not be possible to write to flash
from bootloader (U-Boot). Note that because USB support is to be disabled within
the sboot/U-Boot code, the board specific implementation of the Secure Loader
will have to manage the entire USB initialization, enumeration, and read/write
access to the mass storage device.

<!-- section-config -->

Domain        | Object                                    | Recommendations
------------- | ----------------------------------------- | ---------------
Update-FOTA-1 | Integrity, confidentiality and legitimacy | Must be secure.

<!-- end-section-config -->

Different possible type of **FOTA**:

- Package-based like rpm, dpkg:

  - `+` Simple.
  - `-` Power-off.
  - `-` Dependency.

- Full file system updates:

  - `+` Robust.
  - `-` Tends device-specific.
  - `-` Need rsync or similar.

- Atomic differential:

  - `+` Robust.
  - `+` Minimal bandwidth consumption.
  - `+` Easy reusable.
  - `-` Physically one file system (Corruption -> unbootable system).
  - `-` No rollback logic.
