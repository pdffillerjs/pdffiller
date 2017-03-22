PDF Filler Stream
======

[![npm version](https://badge.fury.io/js/pdffiller-stream.svg)](https://badge.fury.io/js/pdffiller-stream) [![Build Status](https://travis-ci.org/jasonphillips/pdffiller-stream.svg?branch=master)](https://travis-ci.org/jasonphillips/pdffiller-stream)

> This is a fork of the [pdf-filler](https://github.com/pdffillerjs/pdffiller) package, modified to return promises and readable streams, by piping data in/out of a spawned pdftk process instead of temporarily writing files to disk.

> The goal is cleaner integration, in eg. a microservices context, where it is preferable not to write multiple temporary files to disk and where you may wish to stream the generated pdf directly to a service like AWS.

A node.js PDF form field data filler and FDF generator toolkit. This essentially is a wrapper around the PDF Toolkit library <a target="_blank" href="http://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/">PDF ToolKit</a>.


Quick start
-----------

**You must first have `pdftk` (from pdftk-server, found [here](https://www.pdflabs.com/tools/pdftk-server/)) installed correctly on your platform.**

Then, install this library:

```bash
npm install pdffiller-stream --save
```

**Note for MacOS / OSX Developers** - the main `pdftk` package for OSX is currently broken as of OS 10.11, but PDFLabs released an alternative build that should work normally on the platform: https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/pdftk_server-2.02-mac_osx-10.11-setup.pkg



## Examples

#### 1.Fill PDF with existing FDF Data

````javascript
import pdfFiller from 'pdffiller-stream';

const sourcePDF = "test/test.pdf";

const data = {
    "last_name" : "John",
    "first_name" : "Doe",
    "date" : "Jan 1, 2013",
    "football" : "Off",
    "baseball" : "Yes",
    "basketball" : "Off",
    "hockey" : "Yes",
    "nascar" : "Off"
};

pdfFiller.fillForm( sourcePDF, data)
    .then((outputStream) => {
        // use the outputStream here;
        // will be instance of stream.Readable
    }).catch((err) => {
        console.log(err);
    });

````

This will take the test.pdf, fill the fields with the data values and stream a filled in, read-only PDF.

You can use the returned stream to write a file to disk using a standard library like `fs.createWriteStream(desination)`, or send it directly to a service like AWS (which accepts streams as input).

A chainable convenience method `toFile` is attached to the response, if you simply wish to write the stream to a file with no fuss:

```javascript
pdfFiller.fillForm( sourcePDF, data)
    .toFile('outputFile.PDF')
    .then(() => {
        // your file has been written 
    }).catch((err) => {
        console.log(err);
    });
```

Calling `fillFormWithFlatten()` with `shouldFlatten = false` will leave any unmapped fields still editable, as per the `pdftk` command specification.

```javascript

const shouldFlatten = false;

pdfFiller.fillFormWithFlatten(sourcePDF, data, shouldFlatten)
    .then((outputStream) {
        // etc, same as above
    })
```


#### 2. Generate FDF Template from PDF

````javascript
import pdfFiller from 'pdffiller-stream';

const sourcePDF = "test/test.pdf";

// Override the default field name regex. Default: /FieldName: ([^\n]*)/
const nameRegex = null;  

const FDF_data = pdfFiller.generateFDFTemplate(sourcePDF, nameRegex).then((fdfData) => {
    console.log(fdfData);
}).catch((err) => {
    console.log(err);
});

````

This will print out this
```json
{
    "last_name" : "",
    "first_name" : "",
    "date" : "",
    "football" : "",
    "baseball" : "",
    "basketball" : "",
    "hockey" : "",
    "nascar" : ""
}
```

#### 3. Map form fields to PDF fields
````javascript
import pdfFiller from 'pdffiller-stream';

const conversionMap = {

    "lastName": "last_name",
    "firstName": "first_name",
    "Date": "date",
    "footballField": "football",
    "baseballField": "baseball",
    "bballField": "basketball",
    "hockeyField": "hockey",
    "nascarField": "nascar"
};

const FormFields = {
    "lastName" : "John",
    "firstName" : "Doe",
    "Date" : "Jan 1, 2013",
    "footballField" : "Off",
    "baseballField" : "Yes",
    "bballField" : "Off",
    "hockeyField" : "Yes",
    "nascarField" : "Off"
};

pdfFiller.mapForm2PDF(data, convMap).then((mappedFields) => {
    console.log(mappedFields);
});
````

This will print out the object below.
```json

{
    "last_name" : "John",
    "first_name" : "Doe",
    "date" : "Jan 1, 2013",
    "football" : "Off",
    "baseball" : "Yes",
    "basketball" : "Off",
    "hockey" : "Yes",
    "nascar" : "Off"

}
```

#### 4. Convert fieldJson to FDF data
````javascript
import pdfFiller from 'pdffiller-stream';

const fieldJson = [
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


const FDFData = pdfFiller.convFieldJson2FDF(data);

console.log(FDFData)
````

This will print out:

````json
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
