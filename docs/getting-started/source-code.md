

# Introduction: Building target AGL image with Yocto project

The standard Yocto process is made of the following steps:

* Setting up your operating system.
* Setting up the build environment for R-Car BSP.
* Downloading the proprietary drivers and installing them in the build environment (if needed).
* Build the image.
* Boot using SD-CARD.
    * Create an SD-CARD.
    * Configure to boot on SD-CARD.
    * Copy the image to the SD-CARD.
    * Boot the board on it.

For convenience, the resulting development images are made available [Here][AGL snapshots master latest]

If you want to bypass the build phase and quick boot the board, you can download the image tarball and the kernel then follow the installation procedure.

## Setting up your operating system
The very first step is to ensure that your system can run the build system of the Yocto Project.

**Important**: it only runs on Linux

 * if your system is Windows© or iOS© you should use a virtualization solution  (Virtualbox, VMWare ...) to run a Linux VM on your system.

For AGL 2.1, Yocto Project 2.1, known as krogoth, has been selected for the BSP and build system.  

Reference data for configuring your system can be found in the Yocto documentation [Here][yocto ref Manual]



Here after an extract of this documentation for most common Linux distributions:

* The build system should be able to run on any modern distributions that has the following versions for:
    * Python
    * Git 1.7.8 or greater
    * tar 1.24 or greater
    * GCC, …

#### Note:
* Python 2.7.3 or greater excluding Python 3.x, which is not supported.


### Ubuntu and Debian
The essential and graphical support packages you need for a supported Ubuntu or Debian distribution are shown in the following command:

```
sudo apt-get install gawk wget git-core diffstat unzip texinfo gcc-multilib \
     build-essential chrpath socat libsdl1.2-dev xterm cpio curl
```

#### Note:
* Also note that for this tutorial, the utility 'curl' has been added to the list of packages to install.

### Fedora
The essential and graphical packages you need for a supported Fedora distribution are shown in the following command:

```
sudo yum install gawk make wget tar bzip2 gzip python unzip perl patch \
     diffutils diffstat git cpp gcc gcc-c++ glibc-devel texinfo chrpath \
     ccache perl-Data-Dumper perl-Text-ParseWords perl-Thread-Queue socat \
     SDL-devel xterm curl
```

### OpenSUSE
The essential and graphical packages you need for a supported OpenSUSE distribution are shown in the following command:

```
sudo zypper install python gcc gcc-c++ git chrpath make wget python-xml \
     diffstat texinfo python-curses patch socat libSDL-devel xterm curl
```

### CentOS
The essential and graphical packages you need for a supported CentOS distribution are shown in the following command:

```
sudo yum install gawk make wget tar bzip2 gzip python unzip perl patch \
     diffutils diffstat git cpp gcc gcc-c++ glibc-devel texinfo chrpath \
     socat SDL-devel xterm curl
```

# Download AGL Source Code
The AGL source code and Yocto layers are maintained on the AGL Gerrit server.  
For information on how to create accounts for gerrit see [Getting Started with AGL][Getting Started with AGL].

## Setting up the build environment
In the following, your top level directory is noted as “AGL_TOP”.  
For example, we will set AGL_TOP to point to a directory “$HOME/workspace_agl”:

```
export AGL_TOP=$HOME/workspace_agl
mkdir -p $AGL_TOP
```

## Prepare Repo Tool
AGL Uses the 'repo' tool for managing repositories.  
You need to setup layers of AGL.  
You can use the commands below to prepare Repo:

```
mkdir -p ~/bin
export PATH=~/bin:$PATH
curl https://storage.googleapis.com/git-repo-downloads/repo > ~/bin/repo
chmod a+x ~/bin/repo
```

#### Note:
* More information about the tool 'repo' [Here][repo info]

## Download source
You can choose your source release

### Download Latest Stable Release
To download all layers for the for the latest stable release, Chinook 3.0.1:

```
cd $AGL_TOP
repo init -b chinook -m chinook_3.0.1.xml -u https://gerrit.automotivelinux.org/gerrit/AGL/AGL-repo
repo sync
```

### Download Latest on Chinook Branch
To download all layers on the current release branch which may be in the midst of testing or changes prior to the next stable release:

```
cd $AGL_TOP
repo init -b chinook -u https://gerrit.automotivelinux.org/gerrit/AGL/AGL-repo
repo sync
```

### Download Master Branch
To download all code from master:

```
cd $AGL_TOP
repo init -u https://gerrit.automotivelinux.org/gerrit/AGL/AGL-repo
repo sync
```

## Set up Build Environment Info
AGL has created a set up script for defining the target build and desired optional features.  
To get a complete list of the options available run.

```
cd $AGL_TOP
source meta-agl/scripts/aglsetup.sh -h
```

Once you run aglsetup.sh with your desired parameters, you can build any target desired.

## Features supported by aglsetup

Here is the list of features for AGL 2.1 that can be specified in the aglsetup.sh command line:

* in **meta-agl**
    * **agl-archiver**:
    * **agl-devel**: activate development options (empty root password, debugger, strace, valgrind …)
    * **agl-isafw**:
    * **agl-netboot**: enable network boot support through TFTP and NBD (see meta-netboot layer)
* in **meta-agl-devel**
    * **agl-oem-extra-libs**:
    * **agl-renesas-kernel**:
* in **meta-agl-extra**
    * **agl-appfw-smack**: enables IoT.bzh Application Framework + SMACK + Cynara
    * **agl-demo**: enable layer meta-agl-demo and meta-qt5 - required to build     * agl-demo-platform
    * **agl-localdev**: add a local layer named “meta-localdev” in meta directory and a local.dev.inc conf file if present
    * **agl-sota**: enable SOTA components and dependencies (meta-sota, meta-filesystems, meta-ruby, meta-rust are added)

For newer features or to get more details on a given feature, take a look at the configuration files stored for each feature and/or each machine in meta-agl/templates and meta-agl-extra/templates.

[AGL snapshots master latest]: https://download.automotivelinux.org/AGL/snapshots/master/latest/
[yocto ref Manual]: http://www.yoctoproject.org/docs/2.0/ref-manual/ref-manual.html#detailed-supported-distros
[Getting Started with AGL]: https://wiki.automotivelinux.org/start/getting-started
[repo info]: https://source.android.com/source/using-repo.html
