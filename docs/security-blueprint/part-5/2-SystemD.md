# SystemD

`afm-system-daemon` is used to:

- Manage users and user sessions.
- Setup applications and services (_CGroups_, _namespaces_, autostart, permissions).
- Use of `libsystemd` for its programs (event management, **D-Bus** interface).

<!-- section-config -->

Domain             | Object         | Recommendations
------------------ | -------------- | ------------------------------------
Platform-SystemD-1 | Security model | Use Namespaces for containerization.
Platform-SystemD-2 | Security model | Use CGroups to organise processes.

<!-- end-section-config -->

See [systemd integration and user management](http://iot.bzh/download/public/2017/AMM-Dresden/AGL-systemd.pdf) for more information.

## Benefits

- Removal of one privileged process: **afm-user-daemon**
- Access and use of high level features:

  - Socket activation.
  - Management of users and integration of **PAM**.
  - Dependency resolution to services.
  - `Cgroups` and resource control.
  - `Namespaces` containerization.
  - Autostart of required API.
  - Permissions and security settings.
  - Network management.

<!-- pagebreak -->

## CGroups

Control Groups offer a lot of features, with the most useful ones you can
control: Memory usage, how much CPU time is allocated, how much device I/O is
allowed or which devices can be accessed. **SystemD** uses _CGroups_ to organise
processes (each service is a _CGroups_, and all processes started by that
service use that _CGroups_). By default, **SystemD** automatically creates a
hierarchy of slice, scope and service units to provide a unified structure for
the _CGroups_ tree. With the `systemctl` command, you can further modify this
structure by creating custom slices. Currently, in AGL, there are 2 slices
(**user.slice** and **system.slice**).

## Namespaces

### User side

There are several ways of authenticating users (Key Radio Frequency, Phone,
Gesture, ...). Each authentication provides dynamic allocation of **uids** to
authenticated users. **Uids** is used to ensure privacy of users and **SMACK**
for applications privacy.

First, the user initiates authentication with **PAM** activation. **PAM**
Standard offers highly configurable authentication with modular design like
face recognition, Voice identification or with a password. Then users should
access identity services with services and applications.
