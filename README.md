# docs-agl
AGL Technical Documentation

# Export PDF

Execute the following command to export a markdown file to PDF:

```
pandoc -N --template=templates/agl.tex --variable mainfont="Arial" --variable sansfont="Arial" --variable monofont="Arial" --variable fontsize=12pt --variable version="Automotive Grade Linux" source-code/source-code.md --latex-engine=xelatex --toc -o source-code.pdf
```

# Export HTML

Execute the following command to export a markdown file to HTML:

```
pandoc source-code/source-code.md -f markdown -t html -s -S --toc -c templates/html/pandoc.css -B templates/html/header.html -A templates/html/footer.html -o source-code.html
```
