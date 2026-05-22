# Personal and academic website

`Jekyll`-based GitHub page.

## Compiling the LaTeX figures

Compiling the `LaTeX` figures from within the `assets` directory:

```bash
RM_PDF=1 latexmk -cd path/to/file.tex
```

The `latexmkrc` finds the preamble on its own, and compiles correctly using `TeX Live`.
It then converts the figure to svg using `pdf2svg`.
The environment flag `RM_PDF` instructs `latexmk` to remove the PDF afterwards.
Omit that assignment in the command if you want to keep the PDF.
If you don't have `pdf2svg`, or simply don't want to convert the PDF, remove these lines from the `latexmkrc`:

```perl
if ($ENV{'RM_PDF'}) {
    $success_cmd = 'pdf2svg %D %B.svg && rm -f %D';
}
else {
    $success_cmd = 'pdf2svg %D %B.svg';
}
```