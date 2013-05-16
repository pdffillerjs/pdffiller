PDF Filler
======

A PDF form field data filler that uses FDF (Form Data Format) generator by Clark Van Oyen.

PDF Filler requires the PDF ToolKit which can be found here: <a href="http://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/">PDF ToolKit</a>

````javascript
var fdf = require('fdf');
var pdfFiller = require('pdffiller');

var data = fdf.generate({"name": "John Doe", "age" : 77});

var sourcePDF = "test.pdf";
var destinationPDF = "test_filled_in.pdf";

pdfFiller.fillForm(sourcePDF, destinationPDF, data);

````

This will take the test.pdf, fill the fields with the data values
and create a complete filled in PDF (test_filled_in.pdf)
