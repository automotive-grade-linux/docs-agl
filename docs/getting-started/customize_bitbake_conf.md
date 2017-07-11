# Customize AGL build

To customize the AGL build, you edit local.conf file, located in the build/conf directory.

```bash
edit $AGL_TOP/build/conf/local.conf
```

## Buildhistory

The OpenEmbedded build system creates this directory when you enable the build history feature.

```bash
INHERIT += "buildhistory"
BUILDHISTORY_COMMIT = "1"
```

For more information please check [Here][buildhistory]

## Deletion of temporary workspace

Removes work files after the OpenEmbedded build system has finished with them.

```bash
INHERIT += "rm_work"
```

For more information please check [Here][rm_work]

## Share sstate cache

The directory for the shared state cache.

```bash
SSTATE_DIR = "${HOME}/workspace_agl/sstate-cache"
```

For more information please check [Here][share_sstatecache]

## Share Download directory

The central download directory used by the build process to store downloads.

```bash
DL_DIR = "${HOME}/workspace_agl/downloads"
```

For more information please check [Here][share_download]

[buildhistory]: http://www.yoctoproject.org/docs/latest/mega-manual/mega-manual.html#maintaining-build-output-quality
[rm_work]: http://www.yoctoproject.org/docs/latest/mega-manual/mega-manual.html#ref-tasks-rm_work
[share_sstatecache]: https://wiki.yoctoproject.org/wiki/Enable_sstate_cache
[share_download]: http://www.yoctoproject.org/docs/latest/mega-manual/mega-manual.html#var-DL_DIR
