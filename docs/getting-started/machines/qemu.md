# Building the AGL Demo Platform for QEMU

To build the QEMU version of the AGL demo platform use machine **qemux86-64** along with features **agl-demo** and **agl-devel**:

```bash
source meta-agl/scripts/aglsetup.sh -f -m qemux86-64 agl-demo agl-devel
bitbake agl-demo-platform
```

By default, the build will produce a compressed *vmdk* image in **tmp/deploy/images/qemux86-64/agl-demo-platform-qemux86-64.vmdk.xz**

# Deploying the AGL Demo Platform for QEMU

## Prepare an image for boot

Decompress the **agl-demo-platform-qemux86-64.vmdk.xz** image to prepare it for boot.

### Linux

```bash
cd tmp/deploy/images/qemux86-64
xz -d agl-demo-platform-qemux86-64.vmdk.xz
```

### Windows

Download [7-Zip](http://www.7-zip.org/) and select **agl-demo-platform-qemux86-64.vmdk.xz** to be decompressed.

## Boot an image

### QEMU

#### Install

Note: if an AGL crosssdk has been created, it will contain a qemu binary for the host system. This SDK qemu binary has no graphics support and cannot currently be used to boot an AGL image.

*Arch*:

```bash
sudo pacman -S qemu
```

*Debian/Ubuntu*:

```bash
sudo apt-get install qemu-system-x86
```

*Fedora*:

```bash
sudo yum install qemu-kvm
```

#### Boot

Boot the **agl-demo-platform-qemux86-64.vmdk** image in qemu with kvm support:

```bash
qemu-system-x86_64 -enable-kvm -m 2048 \
	-hda agl-demo-platform-qemux86-64.vmdk \
	-cpu kvm64 -cpu qemu64,+ssse3,+sse4.1,+sse4.2,+popcnt \
	-vga virtio -show-cursor \
	-device virtio-rng-pci \
	-serial mon:stdio -serial null \
	-soundhw hda \
	-net nic,vlan=0 \
	-net user,hostfwd=tcp::2222-:22
```

### VirtualBox

#### Install

Download and install [VirtualBox](https://www.virtualbox.org/wiki/Downloads) 5.2.0 or later.

#### Boot

Boot the **agl-demo-platform-qemux86-64.vmdk** image in VirtualBox:

* Start VirtualBox
* Click **New** to create a new machine
    * Enter **AGL QEMU** as the *Name*
    * Select **Linux** as the *Type*
    * Select **Other Linux (64-bit)** as the *Version*
    * Set *Memory size* to **2 GB**
    * Click **Use an existing virtual hard disk file** under *Hard disk*
        * Navigate to and select the **agl-demo-platform-qemux86-64.vmdk** image
* Ensure that the newly created **AGL QEMU** machine is highlighted and click **Start**

### VMWare Player

#### Install

Download and install [VMWare Player](https://www.vmware.com/products/player/playerpro-evaluation.html)

#### Boot

Boot the **agl-demo-platform-qemux86-64.vmdk** image in VMWare Player:

* Start VMWare Player
* Select **File** and **Create a New Virtual Machine**
    * Select **I will install the operating system later** and click **Next**
    * Select **Linux** as the *Guest Operating System*, **Other Linux 3.x kernel 64-bit** as the *Version*, and click **Next**
    * Enter **AGL QEMU** as the *Name* and click **Next**
    * Leave *disk capacity settings* unchanged and click **Next**
    * Click **Finish**
* Select/highlight **AGL QEMU** and click **Edit virtual machine settings**
    * Select/highlight **Memory** and click **2 GB**
    * Select/highlight **Hard Disk (SCSI)** and click **Remove**
    * Click **Add**
        * Select **Hard Disk** and click **Next**
        * Select **SCSI (Recommended)** and click **Next**
        * Select **Use an existing virtual disk** and click **Next**
        * Browse and select the **agl-demo-platform-qemux86-64.vmdk** image
        * Click **Finish**
        * Click **Keep Existing Format**
    * Click **Save**
* Ensure that the newly created **AGL QEMU** machine is highlighted and click **Power On**
