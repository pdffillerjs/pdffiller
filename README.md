PDF Filler (Node.js)
======

A node.js PDF form field data filler that uses FDF (Form Data Format) generator by <a target="_blank" href="https://github.com/countable">Clark Van Oyen</a>.

PDF Filler requires the PDF ToolKit which can be found here: <a target="_blank" href="http://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/">PDF ToolKit</a>

````javascript
var pdfFiller   = require( 'pdffiller' );

var sourcePDF = "test/test.pdf";
var destinationPDF =  "test/test_complete.pdf";

var data = {
    "last_name" : "John",
    "first_name" : "Doe",
    "date" : "Jan 1, 2013",
    "football" : "Off",
    "baseball" : "Yes",
    "basketball" : "Off",
    "hockey" : "Yes",
    "nascar" : "Off"
};

pdfFiller.fillForm( sourcePDF, destinationPDF, data, function() { console.log("In callback (we're done)."); } );

````

This will take the test.pdf, fill the fields with the data values
and create a complete filled in PDF (test_filled_in.pdf)
