PDF Filler (Node.js)
======

A node.js PDF form field data filler and FDF generator toolkit. This essentially is a wrapper around the PDF Toolkit library <a target="_blank" href="http://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/">PDF ToolKit</a>.


Quick start
-----------

First, run `npm install node-pdffiller --save` for your app. Then, in an Express app:

```js
var pdfFiller = require('node-pdffiller');

// ...
```


##Examples

#### 1.Fill PDF with existing FDF Data
````javascript
var pdfFiller   = require( 'node-pdffiller' );

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


#### 2. Generate FDF Template from PDF
````javascript
var pdfFiller   = require( 'node-pdffiller' );

var sourcePDF = "test/test.pdf";

var FDF_data = pdfFiller.generateFDFTemplate( sourcePDF, function(err, fdfData) { 
    if (err) throw err;
    console.log(fdfData);
});

````

This will print out this 
```{
    "last_name" : "",
    "first_name" : "",
    "date" : "",
    "football" : "",
    "baseball" : "",
    "basketball" : "",
    "hockey" : "",
    "nascar" : ""
};```

#### 3. Map form fields to PDF fields
````javascript
var pdfFiller = require( 'node-pdffiller' ),
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

    console.log(mappedFields);
});
````

This will print out the object below.
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

#### 4. Convert fieldJson to FDF data
````javascript
var pdfFiller   = require( 'node-pdffiller' );

var sourcePDF = "test/test.pdf";
var fieldJson = [
    {
        "title" : "last_name",
        "fieldfieldType": "Text",
        "fieldValue": "Doe"
    },
    {
        "title" : "first_name",
        "fieldfieldType": "Text",
        "fieldValue": "John"
    },
    {
        "title" : "date",
        "fieldType": "Text",
        "fieldValue": "Jan 1, 2013"
    },
    {
        "title" : "football",
        "fieldType": "Button",
        "fieldValue": false
    },
    {
        "title" : "baseball",
        "fieldType": "Button",
        "fieldValue": true
    },
    {
        "title" : "basketball",
        "fieldType": "Button"
        "fieldValue": false
    },
    {
        "title" : "hockey",
        "fieldType": "Button"
        "fieldValue": true
    },
    {
        "title" : "nascar",
        "fieldType": "Button"
        "fieldValue": false
    }
];

var FDFData = pdfFiller.convFieldJson2FDF( data );
console.log(FDFData)
````

This will print out this 
````
{
    "last_name" : "John",
    "first_name" : "Doe",
    "date" : "Jan 1, 2013",
    "football" : "Off",
    "baseball" : "Yes",
    "basketball" : "Off",
    "hockey" : "Yes",
    "nascar" : "Off"
};
````
