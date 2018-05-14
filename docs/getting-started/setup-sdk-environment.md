# AGL SDK Quick Setup

This tutorial explains how to quickly setup an environment suitable to building and packaging AGL Applications using the SDK and a Docker container.
The current tutorial has been tested on Linux, but may work with a few adjustments for Windows or MacOS.

## Step 1: install Docker

First install docker on your host, if not already done.
General instructions for Linux are available on the [Docker Site](https://docs.docker.com/engine/installation/linux/).
Add yourself to the docker group.

## Step 2: setup persistent workspace

Docker images are pre-configured to use a particular uid:gid to enable the use
of OpenEmbedded build system. They provide a dedicated user account *devel*
which belong to uid=1664(devel) gid=1664(devel). (Note: password is *devel*)

The script 'create_container' presented below instantiates a new container
and shares some volumes with the host:

* /xdt (the build directory inside the container) is stored in ~/ssd/xdt_$ID (specific to instance ID)
* /home/devel/mirror is stored in ~/ssd/localmirror_$ID (specific to instance ID)
* /home/devel/share => points to  ~/devel/docker/share (shared by all containers)

Those shared volumes with the host needs the proper permissions to be accessible
from the contained environment.

```bash
mkdir ~/ssd ~/devel
chmod a+w ~/ssd ~/devel
```

**Note**:

* To gain access from your host on files created within the container, your
   host account requires to be added to group id 1664.

## Step 3: install the "Generic AGL Worker" Docker Image

### Get docker image

#### Pre-built image

A pre-built image is available on automotivelinux download public site and can be used directly.

First, download and load the image in your local Docker instance:

```bash
wget -O - https://download.automotivelinux.org/AGL/snapshots/sdk/docker/docker_agl_worker-latest.tar.xz | docker load;
docker images;
      REPOSITORY                              TAG                 IMAGE ID            CREATED             SIZE
      docker.automotivelinux.org/agl/worker-generic   5.99-95             6fcc19b4e0d7        2 weeks ago         1.56GB
      jenkins                                 latest              55720d63e328        5 weeks ago         711.9 MB
      hello-world                             latest              c54a2cc56cbb        5 months ago        1.848 kB
```
Identify the IMAGE_ID you just loaded. In the example above, this is 6fcc19b4e0d7

```bash
export IMAGE_ID=6fcc19b4e0d7
```

#### Rebuilt image

The Docker image for AGL Worker can be rebuilt using the scripts published here [docker-worker-generator](https://git.automotivelinux.org/AGL/docker-worker-generator/).

### Start image

Then, use the 'create_container' script to start a new, fresh container based on the AGL Worker image:

**Note**:

* The password for the id 'devel' inside the docker image is 'devel'.


```bash
git clone https://git.automotivelinux.org/AGL/docker-worker-generator;
cd docker-worker-generator;
./contrib/create_container 0 $IMAGE_ID;
docker ps;
    CONTAINER ID        IMAGE                                       COMMAND                  CREATED             STATUS              PORTS                                                                                        NAMES
    4fb7c550ad75        6fcc19b4e0d7   "/usr/bin/wait_for_ne"   33 hours ago        Up 33 hours         0.0.0.0:2222->22/tcp, 0.0.0.0:69->69/udp, 0.0.0.0:8000->8000/tcp, 0.0.0.0:10809->10809/tcp   agl-worker-odin-0-sdx
```

## Step 4: install the AGL SDK for your target

Here, we assume that we just built an image 'agl-demo-platform-crosssdk' using the Yocto build procedure documented in the [Getting Started](../) section of the documentation.

So we can copy such file to the shared volume.

For example, we could have built the SDK from another worker container listening with SSH on port 2223:

```bash
create_container 1;
ssh -p 2223 devel@mybuilder.local;
... [ prepare build environment ] ...
bitbake agl-demo-platform-crosssdk;
... [ build happens in /xdt/build ] ...
cp /xdt/build/tmp/deploy/sdk/poky-agl-glibc-x86_64-agl-demo-platform-crosssdk-cortexa15hf-neon-toolchain-3.0.0+snapshot.sh ~/share;
```

then login to the first "SDK Container" and install the SDK:

```bash
ssh -p 2222 devel@mysdk.local;
install_sdk ~/share/poky-agl-glibc-x86_64-agl-demo-platform-crosssdk-cortexa15hf-neon-toolchain-3.0.0+snapshot.sh;
```

## Step 5: build your application

First, you must source the SDK environment you wish to use (you MUST repeat this step each time you open a new shell):

```bash
source /xdt/sdk/environment-setup-<your_target>
```

You're then ready to go: get the sources, run the builds ...

```bash
git clone <your repo for your app>;
cd <your app>;
cmake; make; make package;
```
