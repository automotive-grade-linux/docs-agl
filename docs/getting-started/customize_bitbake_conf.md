# Customize AGL build
To customize the AGL build, you edit local.conf file, located in the build/conf directory.

```
edit $AGL_TOP/build/conf/local.conf
```

## Buildhistory
The OpenEmbedded build system creates this directory when you enable the build history feature.

```
INHERIT += "buildhistory"
BUILDHISTORY_COMMIT = "1"
```

For more information please check [Here][buildhistory]


## deletion of temporary workspace
Removes work files after the OpenEmbedded build system has finished with them.

```
INHERIT += "rm_work"
```

For more information please check [Here][rm_work]


[buildhistory]: http://www.yoctoproject.org/docs/latest/mega-manual/mega-manual.html#maintaining-build-output-quality
[rm_work]: http://www.yoctoproject.org/docs/latest/mega-manual/mega-manual.html#ref-tasks-rm_work
