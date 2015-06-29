/*
*   File:       pdf.js
*   Project:    PDF Filler
*   Date:       May 2013.
*
*   Description: This script will collect all the field objects from a given
*                PDF file. This can be used to set the FDF data and then merge
*                into the PDF and create a auto populated PDF form.
*/

var pdfFiller = require( 'pdffiller' ), 
    should = require('should');

var sourcePDF,
    destinationPDF,
    data, expected;

/**
 * Unit tests
 */
describe('fillForm Unit Tests', function(){
    beforeEach(function(done){
        data = {
            "last_name" : "John",
            "first_name" : "Doe",
            "date" : "Jan 1, 2013",
            "football" : "Off",
            "baseball" : "Yes",
            "basketball" : "Off",
            "hockey" : "Yes",
            "nascar" : "Off"
        };
        destinationPDF =  "test/test_complete.pdf";
        sourcePDF = "test/test.pdf";
    });
    
    pdfFiller.generateFieldJson( sourcePDF, function(form_fields) { 
        form_fields.should.be.equal(expected);
        done();
    });
});

describe('generateFieldJson Unit Tests', function(){
    beforeEach(function(done){
        expected = [
            {
                "title" : "last_name",
                "type": "Text"
            },
            {
                "title" : "first_name",
                "type": "Text"
            },
            {
                "title" : "date",
                "type": "Text"
            },
            {
                "title" : "football",
                "type": "Button"
            },
            {
                "title" : "baseball",
                "type": "Button"
            },
            {
                "title" : "basketball",
                "type": "Button"
            },
            {
                "title" : "hockey",
                "type": "Button"
            },
            {
                "title" : "nascar",
                "type": "Button"
            }
        ];
        sourcePDF = "test/test.pdf";
    });
    it('Should generate form field JSON as expected', function(){
        pdfFiller.fillForm( sourcePDF, function(form_fields) { 
            form_fields.should.equal(expected);
            done();
        });
    });
});



