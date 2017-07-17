---

title : Security BluePrint Overview
date  : 2017-07-07
category: security
tags: security, architecture, automotive, linux
layout: techdoc 
 
---

**Table of Content**

1. TOC
{:toc}

# Introduction

## Security in Modern Connected Vehicles

Modern cars have become a lot more technologically sophisticated and
different than those of the past. We are seeing a wider range of new
features and functionality, with a lot more complex software. It is fair
to say that the cars being introduced to the market today have much
more in common with computing devices like cell phones, than their
predecessors did. Modern car manufacturers are also integrating support
for a broad range of communication technologies for these “connected”
cars. With the advent of such vehicles, Linux has become a natural
choice for the software platform, with Automotive Grade Linux as a
promising example.

## Connected Car: A Hostile Environment

From a security point of view, the remote capabilities of a connected
car results in a much larger attack surface. This opens a whole new
world of security vulnerabilities that need to be considered during the
architectural design. History shows that physical access to a device is
sufficient for a hacker to gain root privileges. This makes the car a
`hostile` environment.

## Abstract

The Security Blueprint documents the security features that
are included as part of Automotive Grade Linux (AGL) and identifies
areas that need to be addressed from a security perspective as
part of AGL. It also gives guidance around existing technologies and
solutions. Finally it provides recommendations and requirements for
areas that are out of scope of this document and AGL.


# Scope
This document will focus on the following key areas:

* Adversaries - Common categories of Attackers
* Threat Analysis - Common threats to AGL system
* Security Concepts - Technologies and practices that can be used to mitigate attacks
* Platform Security - How AGL applies these security concepts for platform security
* Application Security - How AGL applies these security concepts for application security
* System Hardening - Recommendations on hardening AGL systems
