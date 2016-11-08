
Overview of bindings shipped with AFB-Daemon
===========================================

List of bindings
---------------

Here are the bindings shipped in the source tree:

* Hello World
* Authentication
* Tic Tac Toe
* Audio _(2 backends: ALSA/PulseAudio)_
* Radio _(1 backend: RTLSDR RTL2832U)_
* Media _(1 backend: Rygel UPnP)_

All bindings may not be built, depending on the development libraries present on the system at build time.


Detail of bindings
-----------------

### Hello World

A sample Hello World binding for demonstration and learning purposes.

This binding provides a few unauthenticated requests, all beginning with "ping", to demonstrate basic binder capabilities.

**Verbs**:

* _ping:_ returns a success response
* _pingfail:_ returns a failure response
* _pingnull:_ returns a success response, with an empty JSON response field
* _pingbug:_ does a memory violation (intercepted by the binder)
* _pingJson:_ returns a success response, with a complex JSON response field
* _pingevent:_ broadcasts a global event

<br />


### Authentication

An sample Authentication binding for demonstration purposes.

This binding provides a few requests to demonstrate the binder's token-based security mechanism.

Calling "_connect_" with a security token will initiate a session, calling "_refresh_" will issue a new token and invalidate the previous one, calling "_logout_" will invalidate all tokens and close the session.

**Verbs**:

* _ping:_ returns a success response
* _connect:_ creates a session and returns a new token
* _refresh:_ returns a new token
* _check:_ verifies the passed token is valid
* _logout:_ closes the session

<br />


### Tic Tac Toe

A sample Tic Tac Toe game binding.

This binding provides an interactive Tic Tac Toe game where the binder returns the grid as a JSON response. 

**Verbs**:

* _new:_ starts a new game
* _play:_ asks the server to play
* _move:_ gives a client move
* _board:_ gets the current board state, as a JSON structure
* _level_: sets the server level
* _join_: joins an existing board
* _undo_: undo the last move
* _wait_: wait for a move

<br />


### Audio

A sample Audio binding with 2 backends:

* ALSA (mandatory)
* PulseAudio (optional)

This binding is able to initialize a specific soundcard, define volume levels, channels (mono/stereo...), mute sound, and play a 22,050 Hz PCM stream.

**Verbs**:

* _ping:_ returns a success response
* _init:_ initializes backend, on the "default" sound card
* _volume:_ gets or sets volume, in % (0-100)
* _channels:_ gets or sets channels count (1-8)
* _mute:_ gets or sets the mute status (on-off)
* _play_: gets or sets the playing status (on-off)

_(if PulseAudio development libraries are not found at build time, only ALSA will be available)_

_(if a PulseAudio server is not found at runtime, the binding will dynamically fall back to ALSA)_

_(a specifc backend can be forced by using this syntax before running afb-daemon : **$ export AFB_AUDIO_OUTPUT=Alsa**)_

<br />


### Radio

A sample AM/FM Radio binding with 1 backend:

* RTLSDR - Realtek RTL2832U dongles (mandatory)

This binding is able to initialize specific RTL2832U dongles, switch between AM/FM modes, define frequency, mute sound, and play sound (if combining with the **audio** binding).

**Verbs**:

* _ping:_ returns a success response
* _init:_ initializes backend, looking for plugged-in devices
* _power:_ sets device power status (on-off)
* _mode:_ sets device reception mode (AM-FM)
* _freq:_ sets device frequency (in Hz)
* _mute_: sets device mute status (on-off)
* _play_: sets device playing status (on-off)

_(if rtlsdr development libraries are not found at build time, this binding will not be built)_

<br />


### Media

A sample Media Server binding with 1 backend:

 * Rygel

This binding is able to detect a local Rygel UPnP media server, list audio files, select an audio file for playback, play/pause/seek in this file, upload an audio file to the server.

**Verbs**:

* _ping:_ returns a success response
* _init:_ initializes backend, looking for an active local UPnP server
* _list:_ returns list of audio files, as a JSON structure
* _select:_ select an audio files, by index number (001-...)
* _play:_ plays the currently selected audio file
* _stop:_ stops the currently selected audio file
* _pause:_ pauses the currently selected audio file
* _seek:_ seeks in the currently selected audio file, in seconds
* _upload:_ uploads an audio file, with a POST request

_(if GUPnP/GSSDP development libraries are not fund at build time, this binding will not be built)_

<br />


---
<br />

Sample command-line applications: _afb-client-demo_ (built by default)

Sample HTML5 applications: 
**test/*.html**, 
**[afb-client](https://gerrit.automotivelinux.org/gerrit/gitweb?p=src/app-framework-demo.git;a=tree)**, 
**[afb-radio](https://github.com/iotbzh/afb-radio)**

Sample Qt/QML applications: *test/token-websock.qml*
