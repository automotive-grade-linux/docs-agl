---
layout: contribute
title: AGL Contribution Guidelines
---

# Contributor Guidelines

Thanks for helping to improve AGL ! This page provides a general guide on making contributions to AGL. If you can't find something on this page, please feel free to contact the [mailing list]({{ site.linkto.mail_lists }}).

## Prerequisites

Before contributing to AGL, please complete the following steps:

1. Create an account on [identity.linuxfoundation.org]({{ site.linkto.account }}) to get started.
2. Join the [mailing list]({{ site.linkto.mail_lists }}).
3. Setup your Gerrit account, as described in [the Gerrit Tutorial from mediawiki](https://www.mediawiki.org/wiki/Gerrit/Tutorial)

## Working with JIRA

Issues for AGL are hosted in the [AGL JIRA server]({{ site.linkto.jira_base }}). When reporting issues, please follow [these guidelines](./issues.html).

### Claiming Issues
If you find a JIRA issue that you would like to work on, you can ask to claim it; please leave a comment indicating your intention and a committer will assign it to you. Some issues in JIRA are auto-assigned to certain contributors. If it is clear that an issue is not being worked on, feel free to work on it yourself (but please comment first to let the asignee know).

## Submitting Code

TODO: copy article details from [WIKI](https://wiki.automotivelinux.org/agl-distro/contributing)

### Git Commit Messages

You are highly encouraged to describe your git commit with enough detail for someone else to understand it. In doing so, your commit message can consist of multiple lines. However, it also is highly encouraged that the first line of your commit message not exceed 50 characters. This is because some of the tooling that sits on top of git (such as the httpd apps that let you browse the repos) assumes that the first line is top-level summary that is 50 characters or less. Thus there will be highlighting and truncating of the commit message using these assumptions and it will look weird if these assumptions are not kept. There should also be a blank line between the summary and any further description.

If the commit is related to a JIRA issue, you can specify 'Bug-AGL: ' followed by the issue number.

For example, here is a good commit message:

```
Fixed the whizbang widget

Bug-AGL: SPEC-0000

- added more sanity checking in the build script.
- fixed the API to return the correct value in the scenario where there
  aren't any whizbangs present.
- corrected the documentation.
```

As an alternate to a bullet list, you could put long text here in paragraph form, with each line wrapped at 72 chars and blank lines between paragraphs.

## Documentation

### Markdown format and Extensions

The documentation is written using Markdown format.

The developpers site is generated using  [Jekyll](https://jekyllrb.com) which in turn uses [Kramdown](http://kramdown.gettalong.org/) to generate HTML. Kramdown is compatible with most extensions introduced by [PHP Markdown Extra](http://michelf.com/projects/php-markdown/extra/)

Here a the reference guides for Markdown syntax:

* [Kramdown Quick Reference Guide](http://kramdown.gettalong.org/quickref.html)
* [Kramdown Syntax](http://kramdown.gettalong.org/syntax.html)

### Markdown Editors

Here are some editors specialized in Markdown, in no particular order.

#### Online editors

* [Dillinger](http://dillinger.io/) (GitHub support)
* [SlackEdit](https://stackedit.io/) (GitHub support)
* [Online Kramdown Editor](https://kramdown.herokuapp.com/)

#### Offline editors

* [Atom](https://atom.io/) (for live preview, use Packages > Markdown > Toggle Preview)
* [retext](https://github.com/retext-project/retext)
* [remarkable](http://remarkableapp.github.io/)
