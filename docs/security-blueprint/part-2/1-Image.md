# Image

## Image selection

The boot process shall be uninterruptible and shall irrevocably boot the image
as specified in the boot environment.

In U-Boot set the "_bootdelay_" environment variable and/or define
`CONFIG_BOOTDELAY` to _-2_.

<!-- section-config -->

Domain                 | _Variable_ / `Config` name | `Value`
---------------------- | -------------------------- | -------
Boot-Image-Selection-1 | `CONFIG_BOOTDELAY`         | `-2`
Boot-Image-Selection-2 | _bootdelay_                | `-2`

<!-- end-section-config -->

--------------------------------------------------------------------------------

## Image authenticity

It shall not be possible to boot from an unverified image. The secure boot
feature in U-Boot shall be enabled. The secure boot feature is available from
U-Boot 2013.07 version. To enable the secure boot feature, enable the following
features:

```
CONFIG_FIT: Enables support for Flat Image Tree (FIT) uImage format.
CONFIG_FIT_SIGNATURE: Enables signature verification of FIT images.
CONFIG_RSA: Enables RSA algorithm used for FIT image verification.
CONFIG_OF_CONTROL: Enables Flattened Device Tree (FDT) configuration.
CONFIG_OF_SEPARATE: Enables separate build of u-Boot from the device tree.
CONFIG_DEFAULT_DEVICE_TREE: Specifies the default Device Tree used for the run-time configuration of U-Boot.
```

Generate the U-Boot image with public keys to validate and load the image. It
shall use RSA2048 and SHA256 for authentication.

<!-- section-config -->

Domain                    | `Config` name                | _State_
------------------------- | ---------------------------- | --------
Boot-Image-Authenticity-1 | `CONFIG_FIT`                 | _Enable_
Boot-Image-Authenticity-2 | `CONFIG_FIT_SIGNATURE`       | _Enable_
Boot-Image-Authenticity-3 | `CONFIG_RSA`                 | _Enable_
Boot-Image-Authenticity-4 | `CONFIG_OF_CONTROL`          | _Enable_
Boot-Image-Authenticity-5 | `CONFIG_OF_SEPARATE`         | _Enable_
Boot-Image-Authenticity-6 | `CONFIG_DEFAULT_DEVICE_TREE` | _Enable_

<!-- end-section-config -->
