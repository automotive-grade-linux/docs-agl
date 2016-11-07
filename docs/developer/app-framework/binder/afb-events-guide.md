Guide for developing with events
================================

Signaling agents are services that send events to any clients that
subscribed for receiving it. The sent events carry any data.

To have a good understanding of how to write a signaling agent, the
actions of subscribing, unsubscribing, producing, sending, receiving
events must be described and explained.

Overview of events
------------------

The basis of a signaling agent is shown on the following figure:

![scenario of using events](signaling-basis.svg)

This figure shows the main role of the signaling framework for the
propagation of events.

For people not familiar with the framework, a signaling agent and
a “binding” are similar.

### Subscribing and unsubscribing

Subscribing and subscription is the action that makes a client able to
receive data from a signaling agent. Subscription must create resources
for generating the data and for delivering the data to the client. These
two aspects are not handled by the same piece of software: generating
the data is the responsibility of the developer of the signaling agent
while delivering the data is handled by the framework.

When a client subscribes for data, the agent must:

1.  check that the subscription request is correct;
2.  establish the computation chain of the required data, if not already
    done;
3.  create a named event for the computed data, if not already done;
4.  ask the framework to establish the subscription to the event for the
    request;
5.  optionally give indications about the event in the reply to
    the client.

The first two steps are not involving the framework. They are linked to
the business logic of the binding. The request can be any description of
the requested data and the computing stream can be of any nature, this
is specific to the binding.

As said before, the framework uses and integrates “libsystemd” and its event
loop. Within the framework, "libsystemd" is the standard API/library for
bindings expecting to setup and handle I/O, timer or signal events.

Steps 3 and 4 are bound to the framework.

The agent must create an object for handling the propagation of produced
data to its clients. That object is called “event” in the framework. An
event has a name that allows clients to distinguish it from other
events.

Events are created using the ***afb\_daemon\_make\_event*** function
that takes the name of the event. Example:

```C
	event = afb_daemon_make_event(afb_daemon, name);
```

Once created, the event can be used either to push data to its
subscribers or to broadcast data to any listener.

The event must be used to establish the subscription for the requesting
client. This is done using the ***afb\_req\_subscribe*** function
that takes the current request object and event and associates them
together. Example:

```C
	rc = afb_req_subscribe(afb_req, event);
```

When successful, this function make the connection between the event and
the client that emitted the request. The client becomes a subscriber of
the event until it unsubscribes or disconnects. The
***afb\_req\_subscribe*** function will fail if the client
connection is weak: if the request comes from a HTTP link. To receive
signals, the client must be connected. The AGL framework allows
connections using WebSocket.

The name of the event is either a well known name or an ad hoc name
forged for the usecase.

Let's see a basic example: client A expects to receive the speed in km/h
every second while client B expects the speed in mph twice a second. In
that case, there are two different events because it is not the same
unit and it is not the same frequency. Having two different events
allows to associate clients to the correct event. But this doesn't tell
any word about the name of these events. The designer of the signaling
agent has two options for naming:

1.  names can be the same (“speed” for example) with sent data
    self-describing itself or having a specific tag (requiring from
    clients awareness about requesting both kinds of speed isn't safe).
2.  names of the event include the variations (by example:
    “speed-km/h-1Hz” and “speed-mph-2Hz”) and, in that case, sent data
    can self-describe itself or not.

In both cases, the signaling agent might have to send the name of the
event and/or an associated tag to its client in the reply of the
subscription. This is part of the step 5 above.

The framework only uses the event (not its name) for subscription,
unsubscription and pushing.

When the requested data is already generated and the event used for
pushing it already exists, the signaling agent must not instantiate a
new processing chain and must not create a new event object for pushing
data. The signaling agent must reuse the existing chain and event.

Unsubscribing is made by the signaling agent on a request of its client.
The ***afb\_req\_unsubscribe*** function tells the framework to
remove the requesting client from the event's list of subscribers.
Example:

```C
	afb_req_unsubscribe(afb_req, event);
```

Subscription count does not matter to the framework: subscribing the
same client several times has the same effect that subscribing only one
time. Thus, when unsubscribing is invoked, it becomes immediately
effective.

#### More on naming events

Within the AGL framework, a signaling agent is a binding that has an API
prefix. This prefix is meant to be unique and to identify the binding
API. The names of the events that this signaling agent creates are
automatically prefixed by the framework, using the API prefix of the
binding.

Thus, if a signaling agent of API prefix ***api*** creates an event
of name ***event*** and pushes data to that event, the subscribers
will receive an event of name ***api/event***.

### Generating and pushing signals and data

This of the responsibility of the designer of the signaling agent to
establish the processing chain for generating events. In many cases,
this can be achieved using I/O or timer or signal events inserted in the
main loop. For this case, the AGL framework uses “libsystemd” and
provide a way to integrates to the main loop of this library using
afb\_daemon\_get\_event\_loop. Example:

```C
	sdev = afb_daemon_get_event_loop(af_daemon);
	rc = sd_event_add_io(sdev, &source, fd, EPOLLIN, myfunction, NULL);
```

In some other cases, the events are coming from D-Bus. In that case, the
framework also uses “libsystemd” internally to access D-Bus. It provides
two methods to get the available D-Bus objects, already existing and
bound to the main libsystemd event loop. Use either
***afb\_daemon\_get\_system\_bus*** or
***afb\_daemon\_get\_user\_bus*** to get the required instance. Then
use functions of “libsystemd” to handle D-Bus.

In some rare cases, the generation of the data requires to start a new
thread.

When a data is generated and ready to be pushed, the signaling agent
should call the function ***afb\_event\_push***. Example:

```C
	rc = afb_event_push(event, json);
	if (rc == 0) {
		stop_generating(event);
		afb_event_drop(event);
	}
```

The function ***afb\_event\_push*** pushes json data to all the
subscribers. It then returns the count of subscribers. When the count is
zero, there is no subscriber listening for the event. The example above
shows that in that case, the signaling agent stops to generate data for
the event and delete the event using afb\_event\_drop. This is one
possible option. Other valuable options are: do nothing and continue to
generate and push the event or just stop to generate and push the data
but keep the event existing.

### Receiving the signals

Understanding what a client expects when it receives signals, events or
data shall be the most important topic of the designer of a signaling
agent. The good point here is that because JSON[^1] is the exchange
format, structured data can be sent in a flexible way.

The good design is to allow as much as possible the client to describe
what is needed with the goal to optimize the processing to the
requirements only.

### The exceptional case of wide broadcast

Some data or events have so much importance that they can be widely
broadcasted to alert any listening client. Examples of such an alert
are:

-   system is entering/leaving “power safe” mode
-   system is shutting down
-   the car starts/stops moving
-   ...

An event can be broadcasted using one of the two following methods:
***afb\_daemon\_broadcast\_event*** or
***afb\_event\_broadcast***.

Example 1:

```C
	afb_daemon_broadcast_event(afb_daemon, name, json);
```

Example 2:

```C
	event = afb_daemon_make_event(afb_daemon, name);
	. . . .
	afb_event_broadcast(event, json);
```

As for other events, the name of events broadcasted using
***afb\_daemon\_broadcast\_event*** are automatically prefixed by
the framework with API prefix of the binding (signaling agent).

Reference of functions
----------------------

### Function afb\_event afb\_daemon\_make\_event

The function ***afb\_daemon\_make\_event*** that is defined as below:

```C
/*
 * Creates an event of 'name' and returns it.
 * 'daemon' MUST be the daemon given in interface when activating the binding.
 */
struct afb_event afb_daemon_make_event(struct afb_daemon daemon, const char *name);
```

The daemon is the handler to the application framework binder daemon
received during initialisation steps of the binding.

Calling the function ***afb\_daemon\_make\_event*** within the initialisation
function ***afbBindingV1Register*** will _fail_ because the plugin
name is not known at this time.

The correct way to create the event at initialisation is to call the function
***afb\_daemon\_make\_event*** within the initialisation
function ***afbBindingV1ServiceInit***.

### Function afb\_event\_push

The function ***afb\_event\_push*** is defined as below:

```C
/*
 * Pushes the 'event' with the data 'object' to its observers.
 * 'object' can be NULL.
 *
 * For convenience, the function calls 'json_object_put' for object'.
 * Thus, in the case where 'object' should remain available after
 * the function returns, the function 'json_object_get' shall be used.
 *
 * Returns the count of clients that received the event.
 */
int afb_event_push(struct afb_event event, struct json_object *object);
```

As the function ***afb\_event\_push*** returns 0 when there is no
more subscriber, a binding can remove such unexpected event using the
function ***afb\_event\_drop***.

### Function afb\_event\_drop

The function ***afb\_event\_drop*** is defined as below:

```C
/*
 * Drops the data associated to the event
 * After calling this function, the event
 * MUST NOT BE USED ANYMORE.
 */
void afb_event_drop(struct afb_event event);
```

### Function afb\_req\_subscribe

The function ***afb\_req\_subscribe*** is defined as below:

```C
/*
 * Establishes for the client link identified by 'req' a subscription
 * to the 'event'.
 * Returns 0 in case of successful subscription or -1 in case of error.
 */
int afb_req_subscribe(struct afb_req req, struct afb_event event);
```

The subscription adds the client of the request to the list of subscribers
to the event.

### Function afb\_req\_unsubscribe

The function ***afb\_req\_unsubscribe*** is defined as
below:

```C
/*
 * Revokes the subscription established to the 'event' for the client
 * link identified by 'req'.
 * Returns 0 in case of successful unsubscription or -1 in case of error.
 */
int afb_req_unsubscribe(struct afb_req req, struct afb_event event);
```

The unsubscription removes the client of the request of the list of subscribers
to the event.
When the list of subscribers to the event becomes empty,
the function ***afb\_event\_push*** will return zero.

### Function afb\_event\_broadcast

The function ***afb\_event\_broadcast*** is defined as below:

```C
/*
 * Broadcasts widely the 'event' with the data 'object'.
 * 'object' can be NULL.
 *
 * For convenience, the function calls 'json_object_put' for 'object'.
 * Thus, in the case where 'object' should remain available after
 * the function returns, the function 'json_object_get' shall be used.
 *
 * Returns the count of clients that received the event.
 */
int afb_event_broadcast(struct afb_event event, struct json_object *object);
```

This uses an existing event (created with ***afb\_daemon\_make\_event***)
for broadcasting an event having its name.


### Function afb\_daemon\_broadcast\_event

The function ***afb\_daemon\_broadcast\_event*** is defined as below:

```C
/*
 * Broadcasts widely the event of 'name' with the data 'object'.
 * 'object' can be NULL.
 * 'daemon' MUST be the daemon given in interface when activating the binding.
 *
 * For convenience, the function calls 'json_object_put' for 'object'.
 * Thus, in the case where 'object' should remain available after
 * the function returns, the function 'json_object_get' shall be used.
 *
 * Returns the count of clients that received the event.
 */
int afb_daemon_broadcast_event(struct afb_daemon daemon, const char *name, struct json_object *object);
```

The name is given here explicitely. The name is automatically prefixed
with the name of the binding. For example, a binding of prefix "xxx"
would broadcat the event "xxx/name".


Architectural digressions
-------------------------

Based on their dependencies to hardware, signaling agents can be split
into 2 categories: low-level signaling agents and high-level signaling
agents.

Low-level signaling agents are bound to the hardware and focused on
interfacing and driving.

High-level signaling agent are independent of the hardware and ocused on
providing service.

This separation (that may in the corner look artificial) aim to help in
the systems design. The main idea here is that high-level signaling
agents are providing “business logic”, also known as “application
logic”, that is proper to the car industry and that can be reused and
that can evolve as a foundation for the future of the industry.

The implementation of this decomposition may follow 2 paths: strict
separation or soft composition.

### Strict separation

The strict separation implements the modularity composition of signaling
agent through the framework. The high-level signaling agent subscribes
to the low level signaling agent using the standard client API.

Advantages:

-   Modularity
-   Separation of responsibilities
-   Possible aggregation of multiple sources
-   Soft binding of agent good for maintenance

Drawbacks:

-   Cost of propagation of data (might serialize)
-   Difficulties to abstract low-level signaling agent or to find a
    trade-of between abstracting and specializing

The key is modularity versus cost of propagation. It can be partly
solved when logical group of signaling agent are launched together in
the same binder process. In that particular case, the cost of
propagation of data between agents is reduced[^2] because there is no
serialization.

This reduction of the propagation cost (and of the resources used)
precludes implementation of strong security between the agents because
they share the same memory.

### Soft composition

The soft composition implements the business logic of high-level
signaling agents as libraries that can then be used directly by the low
level signaling agents.

Advantages:

-   No propagation: same memory, sharing of native structures

Drawbacks:

-   Cannot be used for aggregation of several sources
-   Difficulties to abstract low-level signaling agent or to find a
    trade-of between abstracting and specializing
-   Source code binding not good for maintenance

[^1]: There are two aspect in using JSON: the first is the flexible data
    structure that mixes common types (booleans, numbers, strings,
    arrays, dictionaries, nulls), the second, is the streaming
    specification. Streaming is often seen as the bottleneck of using
    JSON (see http://bjson.org). When the agent share the same process,
    there is no streaming at all.

[^2]: Within the same process, there is not serialization, the
    propagation has the cost of wrapping a json data and calling
    callbacks with the benefit of having a powerful callback manager:
    the event mechanism of the framework.
