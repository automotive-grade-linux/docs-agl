---
layout: contribute
title: AGL Reporting Issues
---

# Reporting Issues

Thank you for helping to improve AGL! Issues for AGL are hosted on the [AGL JIRA]({{ site.linkto.jira_base }}). A Linux Foundation account is required before you can submit issues (you can easily [create one here]({{ site.linkto.account }})). Before submitting an issue, please take a moment to search JIRA to see if an issue already exists. If it does, please consider commenting or voting for the issue to help raise its visibility.


## Creating an issue in JIRA

Once you have created an account and logged in, click the blue "Create" button at the top of the [AGL JIRA]({{ site.linkto.jira_project }}) page to create an issue. In the dialog that appears, please fill out the following fields _to the best of your ability_. All fields besides those listed here can be left blank.

Field           | Description
----------------| -----
Project         | Make sure that 'AGL Development' is selected
Issue Type      | Whether or not this is a bug or feature request
Summary         | A one line description of the issue
Component       | The [part of AGL]({{ site.linkto.jira_base }}browse/SPEC/?selectedTab=com.atlassian.jira.jira-projects-plugin:components-panel) this issue pertains to. Please select only one component if possible.
Affects Version | The version of the component that this issue pertains to (Blowfish, Chinook, Dab ...)
Environment     | Some extra context about the environment in which a bug was found (e.g. your development platform, the target machine etc.)
Description     | A thorough description of the issue. For bugs, please provide steps for reproduction as well as any logs or stack traces you might have.
Priority        | The impact of the issue (see below)

## Issue Priority

We gauge issue priority on the following scale:

* **Minor/Trivial:** The feature or bug is very specific or only affects a few people
* **Major:** The feature or bug is important and impacts many people
* **Critical:** Bugs (not features) that block the main function of a component and affect a large number of people
* **Blocker:**  Catastrophic bugs that prevent projects from building or cause basic projects to crash immediately. It is very unlikely that a bug is a Blocker

If you aren't sure about the priority, leave the default (major) selected. Please be aware that as our contributors triage issues, they may change the priority based on our criteria.


