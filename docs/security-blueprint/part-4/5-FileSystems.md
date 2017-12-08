# File System

## Disable all file systems not needed

To reduce the attack surface, file system data is parsed by the kernel, so any logic bugs in file system drivers can become kernel exploits.

### Disable NFS file system

NFS FileSystems are useful during development phases, but this can be a very helpful way for an attacker to get files when you are in production mode, so we must disable them.

<!-- section-config -->

Domain                   | `Config` name   | `Value`
------------------------ | --------------- | -------
Kernel-FileSystems-NFS-1 | `CONFIG_NFSD`   | `n`
Kernel-FileSystems-NFS-2 | `CONFIG_NFS_FS` | `n`

<!-- end-section-config -->

--------------------------------------------------------------------------------

<!-- pagebreak -->

## Partition Mount Options

There are several security restrictions that can be set on a filesystem when it is mounted. Some common security options include, but are not limited to:

`nosuid` - Do not allow set-user-identifier or set-group-identifier bits to take effect.

`nodev` - Do not interpret character or block special devices on the filesystem.

`noexec` - Do not allow execution of any binaries on the mounted filesystem.

`ro` - Mount filesystem as read-only.

The following flags shall be used for mounting common filesystems:

<!-- section-config -->

Domain                     | `Partition`         | `Value`
-------------------------- | ------------------- | -----------------------------------------------------------------
Kernel-FileSystems-Mount-1 | `/boot`             | `nosuid`, `nodev` and `noexec`.
Kernel-FileSystems-Mount-2 | `/var` & `/tmp`     | In `/etc/fstab` or `vfstab`, add `nosuid`, `nodev` and `noexec`.
Kernel-FileSystems-Mount-3 | _Non-root local_    | If type is `ext2` or `ext3` and mount point not '/', add `nodev`.
Kernel-FileSystems-Mount-4 | _Removable storage_ | Add `nosuid`, `nodev` and `noexec`.
Kernel-FileSystems-Mount-5 | _Temporary storage_ | Add `nosuid`, `nodev` and `noexec`.
Kernel-FileSystems-Mount-6 | `/dev/shm`          | Add `nosuid`, `nodev` and `noexec`.
Kernel-FileSystems-Mount-7 | `/dev`              | Add `nosuid` and `noexec`.

<!-- end-section-config --> <!-- section-note -->

If `CONFIG_DEVTMPFS_MOUNT` is set, then the kernel will mount /dev and will not apply the `nosuid`, `noexec` options. Either disable `CONFIG_DEVTMPFS_MOUNT` or add a remount with `noexec` and `nosuid` options to system startup.

<!-- end-section-note --> <!-- section-config -->

Domain                     | `Config` name           | _State_ or `Value`
-------------------------- | ----------------------- | -----------------------------------------------------------------------
Kernel-FileSystems-Mount-1 | `CONFIG_DEVTMPFS_MOUNT` | _Disabled_ or add remount with `noexec` and `nosuid` to system startup.

<!-- end-section-config -->
