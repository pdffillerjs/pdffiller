PDF Filler (Node.js)
======

A node.js PDF form field data filler and FDF generator toolkit. This essentially is a wrapper around the PDF Toolkit library <a target="_blank" href="http://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/">PDF ToolKit</a>.

PDF Filler requires the PDF ToolKit which can be found here: <a target="_blank" href="http://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/">PDF ToolKit</a>


##Examples

###Fill PDF with existing FDF Data
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

pdfFiller.fillForm( sourcePDF, destinationPDF, data, function(err) { 
    if (err) throw err;
    console.log("In callback (we're done)."); 
});

````

This will take the test.pdf, fill the fields with the data values
and create a complete filled in PDF (test_filled_in.pdf)


###Generate FDF Data from PDF
````javascript
var pdfFiller   = require( 'pdffiller' );

var sourcePDF = "test/test.pdf";

var FDF_data = pdfFiller.generateFieldJson( sourcePDF, function(err, fdfData) { 
    if (err) throw err;
    console.log(fdfData);
});

````

This will print out this 
```{
    "last_name" : "John",
    "first_name" : "Doe",
    "date" : "Jan 1, 2013",
    "football" : "Off",
    "baseball" : "Yes",
    "basketball" : "Off",
    "hockey" : "Yes",
    "nascar" : "Off"
};```

###Map form fields to PDF fields
````javascript
var pdfFiller = require( 'pdffiller' ),
    sourcePDF = "test/test.pdf",
    FDF_data,
    destinationPDF =  "test/test_complete.pdf";

var conversionMap = {
    "lastName": "last_name",
    "firstName": "first_name",
    "Date": "date",
    "lastName": "last_name",
    "footballField": "football",
    "bballField": "basketball",
    "baseballField": "baseball",
    "hockeyField": "hockey",
    "nascarField": "nascar"
};

var FormFields = {
    "lastName" : "John",
    "firstName" : "Doe",
    "Date" : "Jan 1, 2013",
    "footballField" : "Off",
    "baseballField" : "Yes",
    "bballField" : "Off",
    "hockeyField" : "Yes",
    "nascarField" : "Off"
};

pdfFiller.mapForm2PDF( data, convMap, function(err, mappedFields) { 
    if (err) throw err;

    console.log(FDF_data);
    pdfFiller.fillForm( sourcePDF, destinationPDF, FDF_data, function() { console.log("PDF Generated"); } );
});
````

This will print out the object below and will generate a filled-out pdf.
```{
    "last_name" : "John",
    "first_name" : "Doe",
    "date" : "Jan 1, 2013",
    "football" : "Off",
    "baseball" : "Yes",
    "basketball" : "Off",
    "hockey" : "Yes",
    "nascar" : "Off"
};```


