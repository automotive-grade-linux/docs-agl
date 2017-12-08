# Bus

We only speak about the **CAN** bus to take an example, because the different
attacks on bus like _FlewRay_, _ByteFlight_, _Most_ and _Lin_ use retro
engineering and the main argument to improve their security is to encrypt data
packets. We just describe them a bit:

- **CAN**: Controller Area Network, developed in the early 1980s, is an
  event-triggered controller network for serial communication with data rates
  up to one MBit/s. **CAN** messages are classified over their respective
  identifier. **CAN** controller broadcast their messages to all connected nodes
  and all receiving nodes decide independently if they process the message.
- **FlewRay**: Is a deterministic and error-tolerant high-speed bus. With a data
  rate up to 10 MBit/s.
- **ByteFlight**: Is used for safety-critical applications in motor vehicles
  like air-bags. Byteflight runs at 10Mbps over 2 or 3 wires plastic optical
  fibers.
- **Most**: Media Oriented System Transport, is used for transmitting audio,
  video, voice, and control data via fiber optic cables. The speed is, for the
  synchronous way, up to 24 MBit/s and asynchronous way up to 14 MBit/s.
  **MOST** messages include always a clear sender and receiver address.
- **LIN**: Local Interconnect Network, is a single-wire subnet work for
  low-cost, serial communication between smart sensors and actuators with
  typical data rates up to 20 kBit/s. It is intended to be used from the year
  2001 on everywhere in a car, where the bandwidth and versatility of a **CAN**
  network is not required.

<!-- section-config -->

Domain                             | Tech name | Recommendations
---------------------------------- | --------- | --------------------------------------------------------------------------
Connectivity-BusAndConnector-Bus-1 | CAN       | Implement hardware solution in order to prohibit sending unwanted signals.

<!-- end-section-config -->

See [Security in Automotive Bus Systems](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.92.728&rep=rep1&type=pdf) for more information.

# Connectors

For the connectors, we supposed that they were disabled by default. For example,
the **USB** must be disabled to avoid attacks like BadUSB. If not, configure the
Kernel to only enable the minimum require **USB** devices. The connectors used
to diagnose the car like **OBD-II** must be disabled outside garages.

<!-- section-config -->

Domain                                    | Tech name | Recommendations
----------------------------------------- | --------- | ----------------------------------------------------------------------
Connectivity-BusAndConnector-Connectors-1 | USB       | Must be disabled. If not, only enable the minimum require USB devices.
Connectivity-BusAndConnector-Connectors-2 | USB       | Confidential data exchanged with the ECU over USB must be secure.
Connectivity-BusAndConnector-Connectors-3 | USB       | USB Boot on a ECU must be disable.
Connectivity-BusAndConnector-Connectors-4 | OBD-II    | Must be disabled outside garages.

<!-- end-section-config -->
