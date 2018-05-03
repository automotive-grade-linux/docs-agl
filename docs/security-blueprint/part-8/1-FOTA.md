# Firmware Over The Air

The firmware update is critical since its alteration back to compromise the
entire system. It is therefore necessary to take appropriate protective measures.

AGL includes the _meta-updater_ Yocto layer that enables OTA software
updates via [Uptane](https://uptane.github.io), an automotive-specific extension
to [The Update Framework](https://theupdateframework.github.io/). Uptane and TUF
are open standards that define a secure protocol for delivering and verifying
updates even when the servers and network--internet and car-internal--aren't fully trusted.

_meta-updater_ includes the application [`aktualizr`](https://github.com/advancedtelematic/aktualizr),
developed Advanced Telematic Systems (now part of HERE Technologies) that enables
OTA for an ECU. `aktualizr` combined with Uptane is suitable for updating the
firmware, software, and other packages on even functionally critical ECUs.
`aktualizr` can be enabled with the free, open souce backend
[`ota-community-edition`](https://github.com/advancedtelematic/ota-community-edition).

This FOTA update mechanism can be enabled through the `agl-sota` feature.

## Building

To build an AGL image that uses `aktualizr`, the following can be used.

```
source meta-agl/scripts/aglsetup.sh -m <machine> agl-sota <other-features...>
```

During the build, _meta-updater_ will use credentials downloaded from `ota-community-edition`
to sign metadata verifying the build as authentic. These signatures are part of the Uptane
framework and are used to verify FOTA updates.

## Atomic Upgrades with Rollbacks

`aktualizr`'s primary method of updating firmware is to use `libostree` with binary diffs.
The binary diffs use the least amout of bandwidth, and by it's nature `libostree` stores
current and previous firmware versions on disk or in flash memory to allow for rollbacks.

`libostree` is a content addressable object store much like `git`. Versions are specified
via SHA2-256. These hashes are signed in the Uptane metadata and are robust against
cryptographic compromise.
