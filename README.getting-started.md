# docs-agl
AGL Technical Documentation

# Prerequirements

Please install pandoc and its dependencies.

# Export PDF

Execute the following command to export a markdown file to PDF:

```
./doctools/generate-getting-started.sh -m raspberrypi -d pdf
```

# Export HTML

Execute the following command to export a markdown file with instructions for Raspberry Pi to HTML:

```
./doctools/generate-getting-started.sh -m raspberrypi -d html
```

# Export Docuwiki

Execute the following command to export a markdown file with instructions for Raspberry Pi to docuwiki syntaxt which is used in the AGL wiki:

```
./doctools/generate-getting-started.sh -m raspberrypi -d wiki
```
