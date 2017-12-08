# Application framework/model (**AppFw**)

The application framework manages:

- The applications and services management: Installing, Uninstalling, Listing, ...
- The life cycle of applications: Start -> (Pause, Resume) -> Stop.
- Events and signals propagation.
- Privileges granting and checking.
- API for interaction with applications.

<!-- section-note -->

- The **security model** refers to the security model used to ensure security
  and to the tools that are provided for implementing that model. It's an
  implementation detail that should not impact the layers above the application
  framework.

- The **security model** refers to how **DAC** (Discretionary Access Control),
  **MAC** (Mandatory Access Control) and Capabilities are used by the system to
  ensure security and privacy. It also includes features of reporting using
  audit features and by managing logs and alerts.

<!-- end-section-note -->

The **AppFw** uses the security model to ensure the security and the privacy of
the applications that it manages. It must be compliant with the underlying
security model. But it should hide it to the applications.

<!-- section-config -->

Domain                 | Object         | Recommendations
---------------------- | -------------- | --------------------------------
Platform-AGLFw-AppFw-1 | Security model | Use the AppFw as Security model.

<!-- end-section-config -->

See [AGL AppFw Privileges Management](http://docs.automotivelinux.org/docs/devguides/en/dev/reference/iotbzh2016/appfw/03-AGL-AppFW-Privileges-Management.pdf) and [AGL - Application Framework Documentation](http://iot.bzh/download/public/2017/SDK/AppFw-Documentation-v3.1.pdf) for more
information.

<!-- pagebreak -->

## Cynara

There's a need for another mechanism responsible for checking applicative
permissions: Currently in AGL, this task depends on a policy-checker service
(**Cynara**).

- Stores complex policies in databases.
- "Soft" security (access is checked by the framework).

Cynara interact with **D-Bus** in order to deliver this information.

<!-- section-config -->

Domain                  | Object      | Recommendations
----------------------- | ----------- | -------------------------------------
Platform-AGLFw-Cynara-1 | Permissions | Use Cynara as policy-checker service.

<!-- end-section-config -->

### Policies

- Policy rules:

  - Are simple - for pair [application context, privilege] there is straight
    answer (single Policy Type): [ALLOW / DENY / ...].
  - No code is executed (no script).
  - Can be easily cached and managed.

- Application context (describes id of the user and the application credentials)
  It is build of:

  - UID of the user that runs the application.
  - **SMACK** label of application.

## Holding policies

Policies are kept in buckets. Buckets are set of policies which have additional
a property of default answer, the default answer is yielded if no policy matches
searched key. Buckets have names which might be used in policies (for directions).
