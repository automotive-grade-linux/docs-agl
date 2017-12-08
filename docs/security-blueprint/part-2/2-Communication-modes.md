# Communication modes

## Disable USB, Serial and DOCSIS Support

To disable USB support in U-Boot, following config's shall not be defined:

```
CONFIG_CMD_USB: Enables basic USB support and the usb command.
CONFIG_USB_UHCI: Defines the lowlevel part.
CONFIG_USB_KEYBOARD: Enables the USB Keyboard.
CONFIG_USB_STORAGE: Enables the USB storage devices.
CONFIG_USB_HOST_ETHER: Enables USB Ethernet adapter support.
```

In addition, disable unnecessary communication modes like Ethernet, Serial
ports, DOCSIS in U-Boot and sboot that are not necessary.

Linux Kernel support for USB should be compiled-out if not required. If it is
needed, the Linux Kernel should be configured to only enable the minimum
required USB devices. User-initiated USB-filesystems should be treated with
special care. Whether or not the filesystems are mounted in userspace
(**FUSE**), restricted mount options should be observed.

<!-- config -->

Domain               | Communication modes       | _State_
-------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------
Boot-Communication-1 | `USB`                     | _Disabled_ and _Compiled-out_ if not required.
Boot-Communication-2 | `USB`                     | Else, Kernel should be configured to only enable the minimum required USB devices and filesystems should be treated with special care.
Boot-Communication-3 | `Ethernet`                | _Disabled_
Boot-Communication-4 | U-boot and sboot `DOCSIS` | _Disabled_
Boot-Communication-5 | `Serial ports`            | _Disabled_

<!-- endconfig --> <!-- config -->

Domain                   | `Config` name           | _State_
------------------------ | ----------------------- | -------------
Boot-Communication-USB-1 | `CONFIG_CMD_USB`        | _Not defined_
Boot-Communication-USB-2 | `CONFIG_USB_UHCI`       | _Not defined_
Boot-Communication-USB-3 | `CONFIG_USB_KEYBOARD`   | _Not defined_
Boot-Communication-USB-4 | `CONFIG_USB_STORAGE`    | _Not defined_
Boot-Communication-USB-5 | `CONFIG_USB_HOST_ETHER` | _Not defined_

<!-- endconfig -->

--------------------------------------------------------------------------------

## Disable all unused Network Interfaces

Only used network interfaces should be enabled.
Where possible, services should also be limited to those necessary.

<!-- config -->

Domain               | Communication modes  | _State_
-------------------- | -------------------- | ---------------------------------------------------------------------------------------------
Boot-Communication-1 | `Network interfaces` | Preferably _no network interface is allowed_, otherwise, restrict the services to those used.

<!-- endconfig -->

## Remove or Disable Unnecessary Services, Ports, and Devices

Restrict the `services`, `ports` and `devices` to those used.

<!-- config -->

Domain               | Object                            | Recommendations
-------------------- | --------------------------------- | -------------------------------------------------------------
Boot-Communication-1 | `Services`, `ports` and `devices` | Restrict the `services`, `ports` and `devices` to those used.

<!-- endconfig -->

## Disable flash access

**Recommendation**:

In U-Boot following flash memory commands shall be disabled:

**NAND**: Support for nand flash access available through `do_nand` has to be disabled.

<!-- config -->

Domain                     | `Command` name | _State_
-------------------------- | -------------- | ---------
Boot-Communication-Flash-1 | `do_nand`      | _Disable_

<!-- endconfig -->

Similarly sboot should disable flash access support through command line if any.
