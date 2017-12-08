# Consoles

## Disable serial console

Serial console output shall be disabled. To disable console output in U-Boot,
set the following macros:

<!-- config -->

Domain                 | `Config` name                           | `Value`
---------------------- | --------------------------------------- | ---------
Boot-Consoles-Serial-1 | `CONFIG_SILENT_CONSOLE`                 | `Disable`
Boot-Consoles-Serial-2 | `CONFIG_SYS_DEVICE_NULLDEV`             | `Disable`
Boot-Consoles-Serial-3 | `CONFIG_SILENT_CONSOLE_UPDATE_ON_RELOC` | `Disable`

<!-- endconfig --> <!-- todo -->

Domain          | Improvement
--------------- | ------------------------------------
Boot-Consoles-1 | Secure loader: No reference earlier?

<!-- endtodo -->

And set "**silent**" environment variable. For the Secure loader,
disable the traces by not defining the below macro:

<!-- config -->

Domain                 | `Environment variable` name | _State_
---------------------- | --------------------------- | -------------
Boot-Consoles-Serial-1 | `INC_DEBUG_PRINT`           | _Not defined_

<!-- endconfig -->

For sboot proper configuration needs to be done to disable the serial console.

--------------------------------------------------------------------------------

<!-- pagebreak -->

## Immutable environment variables

In U-Boot, ensure Kernel command line, boot commands, boot delay and other
environment variables are immutable. This will prevent side-loading of alternate
images, by restricting the boot selection to only the image in FLASH.

The environment variables shall be part of the text region in U-Boot as default
environment variable and not in non-volatile memory.

Remove configuration options related to non-volatile memory, such as:

<!-- config -->

Domain                     | `Config` name                | _State_
-------------------------- | ---------------------------- | ---------
Boot-Consoles-Variables-1  | `CONFIG_ENV_IS_IN_MMC`       | `#undef`
Boot-Consoles-Variables-2  | `CONFIG_ENV_IS_IN_EEPROM`    | `#undef`
Boot-Consoles-Variables-3  | `CONFIG_ENV_IS_IN_FLASH`     | `#undef`
Boot-Consoles-Variables-4  | `CONFIG_ENV_IS_IN_DATAFLASH` | `#undef`
Boot-Consoles-Variables-5  | `CONFIG_ENV_IS_IN_FAT`       | `#undef`
Boot-Consoles-Variables-6  | `CONFIG_ENV_IS_IN_NAND`      | `#undef`
Boot-Consoles-Variables-7  | `CONFIG_ENV_IS_IN_NVRAM`     | `#undef`
Boot-Consoles-Variables-8  | `CONFIG_ENV_IS_IN_ONENAND`   | `#undef`
Boot-Consoles-Variables-9  | `CONFIG_ENV_IS_IN_SPI_FLASH` | `#undef`
Boot-Consoles-Variables-10 | `CONFIG_ENV_IS_IN_REMOTE`    | `#undef`
Boot-Consoles-Variables-11 | `CONFIG_ENV_IS_IN_UBI`       | `#undef`
Boot-Consoles-Variables-12 | `CONFIG_ENV_IS_NOWHERE`      | `#define`

<!-- endconfig -->

--------------------------------------------------------------------------------

<!-- pagebreak -->

## (Recommendation) Removal of memory dump commands

In U-Boot, following commands shall be disabled to avoid memory dumps:

```
md : Memory Display command.
mm : Memory modify command - auto incrementing address.
nm : Memory modify command - constant address.
mw : Memory write.
cp : Memory copy.
mwc : Memory write cyclic.
mdc : Memory display cyclic.
mtest : Simple ram read/write test.
loopw : Infinite write loop on address range.
```

<!-- config -->

Domain                  | `Command` name | _State_
----------------------- | -------------- | ----------
Boot-Consoles-MemDump-1 | `md`           | _Disabled_
Boot-Consoles-MemDump-2 | `mm`           | _Disabled_
Boot-Consoles-MemDump-3 | `nm`           | _Disabled_
Boot-Consoles-MemDump-4 | `mw`           | _Disabled_
Boot-Consoles-MemDump-5 | `cp`           | _Disabled_
Boot-Consoles-MemDump-6 | `mwc`          | _Disabled_
Boot-Consoles-MemDump-7 | `mdc`          | _Disabled_
Boot-Consoles-MemDump-8 | `mtest`        | _Disabled_
Boot-Consoles-MemDump-9 | `loopw`        | _Disabled_

<!-- endconfig -->

Similarly, memory dump support shall be disabled from sboot.
