# Wireless

In this part, we talk about possible remote attacks on a car, according to the
different areas of possible attacks. For each communication channels, we
describe attacks and how to prevent them with some recommendations. The main
recommendation is to always follow the latest updates of these remote
communication channels.

<!-- section-config -->

Domain                  | Object | Recommendations
----------------------- | ------ | ------------------------------------------------------------------
Connectivity-Wireless-1 | Update | Always follow the latest updates of remote communication channels.

<!-- end-section-config -->

We will see the following parts:

- [Wifi](#wifi)

- [Bluetooth](#bluetooth)

- [Cellular](#cellular)

- [Radio](#radio)

- [NFC](#nfc)

<!-- section-todo -->

Domain                  | Improvement
----------------------- | -------------------------------------------
Connectivity-Wireless-1 | Add communication channels (RFID, ZigBee?).

<!-- end-section-todo -->

--------------------------------------------------------------------------------

For existing automotive-specific means, we take examples of existing system
attacks from the _IOActive_ document ([A Survey of Remote Automotive Attack Surfaces](https://www.ioactive.com/pdfs/IOActive_Remote_Attack_Surfaces.pdf))
and from the ETH document ([Relay Attacks on Passive Keyless Entry and Start Systems in Modern Cars](https://eprint.iacr.org/2010/332.pdf)).

- [Telematics](https://www.ioactive.com/pdfs/IOActive_Remote_Attack_Surfaces.pdf#%5B%7B%22num%22%3A40%2C%22gen%22%3A0%7D%2C%7B%22name%22%3A%22XYZ%22%7D%2C60%2C720%2C0%5D)

- [Passive Anti-Theft System (PATS)](https://www.ioactive.com/pdfs/IOActive_Remote_Attack_Surfaces.pdf#%5B%7B%22num%22%3A11%2C%22gen%22%3A0%7D%2C%7B%22name%22%3A%22XYZ%22%7D%2C60%2C574%2C0%5D)

- [Tire Pressure Monitoring System (TPMS)](https://www.ioactive.com/pdfs/IOActive_Remote_Attack_Surfaces.pdf#%5B%7B%22num%22%3A17%2C%22gen%22%3A0%7D%2C%7B%22name%22%3A%22XYZ%22%7D%2C60%2C720%2C0%5D)

- [Remote Keyless Entry/Start (RKE)](https://www.ioactive.com/pdfs/IOActive_Remote_Attack_Surfaces.pdf#%5B%7B%22num%22%3A26%2C%22gen%22%3A0%7D%2C%7B%22name%22%3A%22XYZ%22%7D%2C60%2C720%2C0%5D)

- [Passive Keyless Entry (PKE)](https://eprint.iacr.org/2010/332.pdf)

--------------------------------------------------------------------------------

<!-- pagebreak -->

## Wifi

### Attacks

We can differentiate existing attacks on wifi in two categories: Those on
**WEP** and those on **WPA**.

- **WEP** attacks:

  - **FMS**: (**F**luhrer, **M**antin and **S**hamir attack) is a "Stream cipher
    attack on the widely used RC4 stream cipher. The attack allows an attacker
    to recover the key in an RC4 encrypted stream from a large number of
    messages in that stream."
  - **KoreK**: "Allows the attacker to reduce the key space".
  - **PTW**: (**P**yshkin **T**ews **W**einmann attack).
  - **Chopchop**: Found by KoreK, "Weakness of the CRC32 checksum and the lack
    of replay protection."
  - **Fragmentation**

- **WPA** attacks:

  - **Beck and Tews**: Exploit weakness in **TKIP**. "Allow the attacker to
    decrypt **ARP** packets and to inject traffic into a network, even
    allowing him to perform a **DoS** or an **ARP** poisoning".
  - [KRACK](https://github.com/kristate/krackinfo): (K)ey (R)einstallation
    (A)tta(ck) ([jira AGL SPEC-1017](https://jira.automotivelinux.org/browse/SPEC-1017)).

### Recommendations

- Do not use **WEP**, **PSK** and **TKIP**.

- Use **WPA2** with **CCMP**.

- Should protect data sniffing.

<!-- section-config -->

Domain                       | Tech name or object | Recommendations
---------------------------- | ------------------- | -------------------------------------------------------------------------
Connectivity-Wireless-Wifi-1 | WEP, PSK, TKIP      | Disabled
Connectivity-Wireless-Wifi-2 | WPA2 and AES-CCMP   | Used
Connectivity-Wireless-Wifi-3 | WPA2                | Should protect data sniffing.
Connectivity-Wireless-Wifi-4 | PSK                 | Changing regularly the password.
Connectivity-Wireless-Wifi-5 | Device              | Upgraded easily in software or firmware to have the last security update.

<!-- end-section-config -->

See [Wifi attacks WEP WPA](https://matthieu.io/dl/wifi-attacks-wep-wpa.pdf)
and [Breaking wep and wpa (Beck and Tews)](https://dl.aircrack-ng.org/breakingwepandwpa.pdf)
for more information.

--------------------------------------------------------------------------------

<!-- pagebreak -->

## Bluetooth

### Attacks

- **Bluesnarfing** attacks involve an attacker covertly gaining access to your
  Bluetooth-enabled device for the purpose of retrieving information, including
  addresses, calendar information or even the device's **I**nternational
  **M**obile **E**quipment **I**dentity. With the **IMEI**, an attacker could
  route your incoming calls to his cell phone.
- **Bluebugging** is a form of Bluetooth attack often caused by a lack of
  awareness. Similar to bluesnarfing, bluebugging accesses and uses all phone
  features but is limited by the transmitting power of class 2 Bluetooth radios,
  normally capping its range at 10-15 meters.
- **Bluejacking** is the sending of unsolicited messages.
- **BLE**: **B**luetooth **L**ow **E**nergy [attacks](https://www.usenix.org/system/files/conference/woot13/woot13-ryan.pdf).
- **DoS**: Drain a device's battery or temporarily paralyze the phone.

### Recommendations

- Not allowing Bluetooth pairing attempts without the driver's first manually
  placing the vehicle in pairing mode.
- Monitoring.
- Use **BLE** with caution.
- For v2.1 and later devices using **S**ecure **S**imple **P**airing (**SSP**),
  avoid using the "Just Works" association model. The device must verify that
  an authenticated link key was generated during pairing.

<!-- section-config -->

Domain                            | Tech name     | Recommendations
--------------------------------- | ------------- | ------------------------------------------------------------
Connectivity-Wireless-Bluetooth-1 | BLE           | Use with caution.
Connectivity-Wireless-Bluetooth-2 | Bluetooth     | Monitoring
Connectivity-Wireless-Bluetooth-3 | SSP           | Avoid using the "Just Works" association model.
Connectivity-Wireless-Bluetooth-4 | Visibility    | Configured by default as undiscoverable. Except when needed.
Connectivity-Wireless-Bluetooth-5 | Anti-scanning | Used, inter alia, to slow down brute force attacks.

<!-- end-section-config -->

See [Low energy and the automotive transformation](http://www.ti.com/lit/wp/sway008/sway008.pdf),
[Gattacking Bluetooth Smart Devices](http://gattack.io/whitepaper.pdf),
[Comprehensive Experimental Analyses of Automotive Attack Surfaces](http://www.autosec.org/pubs/cars-usenixsec2011.pdf)
and [With Low Energy comes Low Security](https://www.usenix.org/system/files/conference/woot13/woot13-ryan.pdf)
for more information.

--------------------------------------------------------------------------------

<!-- pagebreak -->

## Cellular

### Attacks

- **IMSI-Catcher**: Is a telephone eavesdropping device used for intercepting
  mobile phone traffic and tracking location data of mobile phone users.
  Essentially a "fake" mobile tower acting between the target mobile phone and
  the service provider's real towers, it is considered a man-in-the-middle
  (**MITM**) attack.

- Lack of mutual authentication (**GPRS**/**EDGE**) and encryption with **GEA0**.

- **Fall back** from **UMTS**/**HSPA** to **GPRS**/**EDGE** (Jamming against
  **UMTS**/**HSPA**).

- 4G **DoS** attack.

### Recommendations

- Check antenna legitimacy.

<!-- section-config -->

Domain                           | Tech name | Recommendations
-------------------------------- | --------- | --------------------------
Connectivity-Wireless-Cellular-1 | GPRS/EDGE | Avoid
Connectivity-Wireless-Cellular-2 | UMTS/HSPA | Protected against Jamming.

<!-- end-section-config -->

See [A practical attack against GPRS/EDGE/UMTS/HSPA mobile data communications](https://media.blackhat.com/bh-dc-11/Perez-Pico/BlackHat_DC_2011_Perez-Pico_Mobile_Attacks-wp.pdf)
for more information.

--------------------------------------------------------------------------------

## Radio

### Attacks

- Interception of data with low cost material (**SDR** with hijacked DVB-T/DAB
  for example).

### Recommendations

- Use the **R**adio **D**ata **S**ystem (**RDS**) only to send signals for audio
  output and meta concerning radio.

<!-- section-config -->

Domain                        | Tech name | Recommendations
----------------------------- | --------- | --------------------------------------------
Connectivity-Wireless-Radio-1 | RDS       | Only audio output and meta concerning radio.

<!-- end-section-config -->

--------------------------------------------------------------------------------

<!-- pagebreak -->

## NFC

### Attacks

- **MITM**: Relay and replay attack.

### Recommendations

- Should implements protection against relay and replay attacks (Tokens, etc...).
- Disable unneeded and unapproved services and profiles.
- NFC should be use encrypted link (secure channel). A standard key agreement
  protocol like Diffie-Hellmann based on RSA or Elliptic Curves could be applied
  to establish a shared secret between two devices.
- Automotive NFC device should be certified by NFC forum entity: The NFC Forum
  Certification Mark shows that products meet global interoperability standards.
- NFC Modified Miller coding is preferred over NFC Manchester coding.

<!-- section-config -->

Domain                      | Tech name | Recommendations
--------------------------- | --------- | ------------------------------------------------------
Connectivity-Wireless-NFC-1 | NFC       | Protected against relay and replay attacks.
Connectivity-Wireless-NFC-2 | Device    | Disable unneeded and unapproved services and profiles.

<!-- end-section-config -->
