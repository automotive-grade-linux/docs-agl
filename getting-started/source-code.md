# Download AGL Source Code

The AGL source code and Yocto layers are maintained on the AGL Gerrit server. For information on how to create accounts for gerrit see Getting Started with AGL.

## Prepare Repo Tool

AGL Uses the Repo tool for managing repositories. First you need to setup layers of AGL. You can use the commands below to prepare Repo:
```
mkdir ~/bin
export PATH=~/bin:$PATH
curl https://storage.googleapis.com/git-repo-downloads/repo > ~/bin/repo
chmod a+x ~/bin/repo
```
## Download Latest Stable Release

To download all layers for the for the latest stable release, Blowfish 2.0.2:

```
repo init -b blowfish -m default_blowfish_2.0.2.xml -u https://gerrit.automotivelinux.org/gerrit/AGL/AGL-repo
repo sync
```

## Download Latest on Blowfish Branch

To download all layers on the current release branch which may be in the midst of testing or changes prior to the next stable release:
```
repo init -b blowfish -u https://gerrit.automotivelinux.org/gerrit/AGL/AGL-repo
repo sync
```
## Download Master Branch

To download all code from master:

```
repo init -u https://gerrit.automotivelinux.org/gerrit/AGL/AGL-repo
repo sync
```

## Set up Build Environment

Set up the development environment for the desired target hardware. AGL has created a set up script for defining the target build and desired optional features. To get a complete list of the options available run.

```
  $ source meta-agl/scripts/aglsetup.sh -h
```

Once you run aglsetup.sh with your desired paramaters, you can build any target desired.

## Features supported by aglsetup

Here is the list of features for AGL 2.0 that can be specified in the aglsetup.sh command line:

- in **meta-agl**
    * **agl-devel**: activate development options (empty root password, debugger, strace, valgrind …)
    * **agl-netboot**: enable network boot support through TFTP and NBD (see meta-netboot layer)
- in **meta-agl-extra**
    * **agl-appfw-smack**: enables IoT.bzh Application Framework + SMACK + Cynara
    * **agl-demo**: enable layer meta-agl-demo and meta-qt5 - required to build     * agl-demo-platform
    * **agl-localdev**: add a local layer named “meta-localdev” in meta directory and a local.dev.inc conf file if present
    * **agl-sota**: enable SOTA components and dependencies (meta-sota, meta-filesystems, meta-ruby, meta-rust are added)

For newer features or to get more details on a given feature, take a look at the configuration files stored for each feature and/or each machine in meta-agl/templates and meta-agl-extra/templates.
