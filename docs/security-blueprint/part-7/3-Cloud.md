# Cloud

## Download

- **authentication**: Authentication is the security process that validates the
  claimed identity of a device, entity or person, relying on one or more
  characteristics bound to that device, entity or person.

- **Authorization**: Parses the network to allow access to some or all network
functionality by providing rules and allowing access or denying access based
on a subscriber's profile and services purchased.

<!-- section-config -->

Domain                       | Object         | Recommendations
---------------------------- | -------------- | --------------------------------------
Application-Cloud-Download-1 | authentication | Must implement authentication process.
Application-Cloud-Download-2 | Authorization  | Must implement Authorization process.

<!-- end-section-config -->

--------------------------------------------------------------------------------

## Infrastructure

- **Deep Packet Inspection**: **DPI** provides techniques to analyze the payload
  of each packet, adding an extra layer of security. **DPI** can detect and
  neutralize attacks that would be missed by other security mechanisms.

- A **DoS** protection in order to avoid that the Infrastructure is no more
  accessible for a period of time.

- **Scanning tools** such as **SATS** and **DAST** assessments perform
  vulnerability scans on the source code and data flows on web applications.
  Many of these scanning tools run different security tests that stress
  applications under certain attack scenarios to discover security issues.

- **IDS & IPS**: **IDS** detect and log inappropriate, incorrect, or anomalous
  activity. **IDS** can be located in the telecommunications networks and/or
  within the host server or computer. Telecommunications carriers build
  intrusion detection capability in all network connections to routers and
  servers, as well as offering it as a service to enterprise customers. Once
  **IDS** systems have identified an attack, **IPS** ensures that malicious
  packets are blocked before they cause any harm to backend systems and
  networks. **IDS** typically functions via one or more of three systems:

  1. Pattern matching.
  2. Anomaly detection.
  3. Protocol behavior.

<!-- pagebreak -->

<!-- section-config -->

Domain                             | Object        | Recommendations
---------------------------------- | ------------- | ----------------------------------------------------------
Application-Cloud-Infrastructure-1 | Packet        | Should implement a DPI.
Application-Cloud-Infrastructure-2 | DoS           | Must implement a DoS protection.
Application-Cloud-Infrastructure-3 | Test          | Should implement scanning tools like SATS and DAST.
Application-Cloud-Infrastructure-4 | Log           | Should implement security tools (IDS and IPS).
Application-Cloud-Infrastructure-5 | App integrity | Applications must be signed by the code signing authority.

<!-- end-section-config -->

--------------------------------------------------------------------------------

## Transport

For data transport, it is necessary to **encrypt data end-to-end**. To prevent **MITM** attacks,
no third party should be able to interpret transported data. Another aspect
is the data anonymization in order to protect the leakage of private information
on the user or any other third party.

The use of standards such as **IPSec** provides "_private and secure
communications over IP networks, through the use of cryptographic security
services, is a set of protocols using algorithms to transport secure data over
an IP network._". In addition, **IPSec** operates at the network layer of the
**OSI** model, contrary to previous standards that operate at the application
layer. This makes its application independent and means that users do not need
to configure each application to **IPSec** standards.

**IPSec** provides the services below :

- Confidentiality: A service that makes it impossible to interpret data if it is
  not the recipient. It is the encryption function that provides this service by
  transforming intelligible (unencrypted) data into unintelligible (encrypted)
  data.
- Authentication: A service that ensures that a piece of data comes from where
  it is supposed to come from.
- Integrity: A service that consists in ensuring that data has not been tampered
  with accidentally or fraudulently.
- Replay Protection: A service that prevents attacks by re-sending a valid
  intercepted packet to the network for the same authorization.
  This service is provided by the presence of a sequence number.
- Key management: Mechanism for negotiating the length of encryption keys
  between two **IPSec** elements and exchange of these keys.

An additional means of protection would be to do the monitoring between users
and the cloud as a **CASB** will provide.

<!-- section-config -->

Domain                        | Object                                    | Recommendations
----------------------------- | ----------------------------------------- | ---------------------------------
Application-Cloud-Transport-1 | Integrity, confidentiality and legitimacy | Should implement IPSec standards.

<!-- end-section-config -->
