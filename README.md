PDF Filler
======

A PDF form field data filler that uses FDF (Form Data Format) generator by <a target="_blank" href="https://github.com/countable">Clark Van Oyen</a>.

PDF Filler requires the PDF ToolKit which can be found here: <a target="_blank" href="http://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/">PDF ToolKit</a>

````javascript
var pdfFiller = require('pdffiller');

var data = {
    "first_name": "John",
    "last_name": "Doe"
    "age" : 77,
    "gender": "m"
};

var sourcePDF = "test.pdf";
var destinationPDF = "test_filled_in.pdf";

pdfFiller.fillForm(sourcePDF, destinationPDF, data);

````

This will take the test.pdf, fill the fields with the data values
and create a complete filled in PDF (test_filled_in.pdf)
