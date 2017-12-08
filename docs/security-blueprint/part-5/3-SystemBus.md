# D-Bus

D-Bus is a well-known **IPC** (Inter-Process Communication) protocol (and
daemon) that helps applications to talk to each other. The use of D-Bus is great
because it allows to implement discovery and signaling.

The D-Bus session is by default addressed by environment variable
`DBUS_SESSION_BUS_ADDRESS`. Using **systemd** variable `DBUS_SESSION_BUS_ADDRESS`
is automatically set for user sessions. D-Bus usage is linked to permissions.

D-Bus has already had several [security issues](https://www.cvedetails.com/vulnerability-list/vendor_id-13442/D-bus-Project.html)
(mostly **DoS** issues), to allow applications to keep talking to each other.
It is important to protect against this type of attack to keep the system more
stable.


<!-- section-config -->

Domain          | Object         | Recommendations
--------------- | -------------- | ------------------------------------
Platform-DBus-1 | Security model | Use D-Bus as IPC.
Platform-DBus-2 | Security model | Apply D-BUS security patches: [D-Bus CVE](https://www.cvedetails.com/vulnerability-list/vendor_id-13442/D-bus-Project.html)

<!-- end-section-config -->
