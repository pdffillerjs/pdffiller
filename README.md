PDF Filler
======

A PDF form field data filler.

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
