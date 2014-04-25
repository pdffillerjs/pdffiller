/*
*   File:       pdf.js
*   Project:    PDF Filler
*   Date:       May 2013.
*
*   Description: This script will collect all the field objects from a given
*                PDF file. This can be used to set the FDF data and then merge
*                into the PDF and create a auto populated PDF form.
*/

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

pdfFiller.fillForm( sourcePDF, destinationPDF, data, function() { console.log("In call back..."); } );

