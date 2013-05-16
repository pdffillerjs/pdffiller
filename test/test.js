/*
*   File:       pdf.js
*   Project:    Simplified Rentals
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
    "first_name" : "John",
    "last_name" : "Doe",
    "age" : 20,
    "gender" : "m"
};

pdfFiller.fillForm( sourcePDF, destinationPDF, data );