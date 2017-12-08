# Part 3 - Hypervisor

Definition: "A hypervisor or virtual machine monitor (VMM) is computer software,
firmware or hardware that creates and runs virtual machines".

It must include a signature verification (possibly delegated).

<!-- todo -->

Domain                | Improvement
--------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------
Hypervisor-Abstract-1 | Complete Hypervisor part ([jailhouse](https://github.com/siemens/jailhouse) / [KVM](https://www.linux-kvm.org/page/Main_Page) / [Xen](https://www.xenproject.org/developers/teams/embedded-and-automotive.html)).

<!-- endtodo -->

## Native or Bare-metal hypervisors

These hypervisors run directly on the host's hardware to control the hardware and to manage guest operating systems. Those are the ones we're interested in.
