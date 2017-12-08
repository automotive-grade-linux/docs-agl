# Part 9 - Secure development

In order to save a lot of time in code auditing, developers must follow coding guidelines.

## Secure build

### Kernel build

Tools like:

- [Code optimisation](https://github.com/jduck/lk-reducer).
- [Kernel Drivers test](https://github.com/ucsb-seclab/dr_checker) with [docs](https://www.usenix.org/system/files/conference/usenixsecurity17/sec17-machiry.pdf).

<!-- section-todo -->

Domain                  | Improvement
----------------------- | ------------
SecureDev-SecureBuild-1 | Add content.

<!-- end-section-todo -->

## App/Widget signatures

<!-- section-todo -->

Domain                 | Improvement
---------------------- | ------------
SecureDev-Signatures-1 | Add content.

<!-- end-section-todo -->

## Code audit

These tools are used to check the correct implementation of functionalities and
compliance with related good practices.

- [Continuous Code Quality](https://www.sonarqube.org/).

<!-- section-todo -->

Domain                | Improvement
--------------------- | -----------------------------------------------------
SecureDev-CodeAudit-1 | Add CVE analyser.
SecureDev-CodeAudit-2 | [OSSTMM](http://www.isecom.org/mirror/OSSTMM.3.pdf).

<!-- end-section-todo -->

### SATS

- [RATS](https://github.com/andrew-d/rough-auditing-tool-for-security) (Maybe to old).
- [Flaw Finder](https://www.dwheeler.com/flawfinder/).

- [wiki list](https://en.wikipedia.org/wiki/List_of_tools_for_static_code_analysis).

- [Mathematical approach](https://perso.univ-rennes1.fr/david.lubicz/planches/David_Pichardie.pdf).

It is necessary to verify that the application code does not use functions that
are depreciated and recognized as unsecured or cause problems.

### DATS

- [wiki list](https://en.wikipedia.org/wiki/Dynamic_program_analysis#Example_tools).
