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
    data, expected, convMap;

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
    
    pdfFiller.fillForm( sourcePDF, destinationPDF, data, function(err) { 
        should.not.exist(err);
        done();
    });
});

describe('generateFieldJson Unit Tests', function(){
    beforeEach(function(done){
        expected = [
            {
                "title" : "last_name",
                "fieldType": "Text"
            },
            {
                "title" : "first_name",
                "fieldType": "Text"
            },
            {
                "title" : "date",
                "fieldType": "Text"
            },
            {
                "title" : "football",
                "fieldType": "Button"
            },
            {
                "title" : "baseball",
                "fieldType": "Button"
            },
            {
                "title" : "basketball",
                "fieldType": "Button"
            },
            {
                "title" : "hockey",
                "fieldType": "Button"
            },
            {
                "title" : "nascar",
                "fieldType": "Button"
            }
        ];
        sourcePDF = "test/test.pdf";
    });
    it('Should generate form field JSON as expected', function(){
        pdfFiller.generateFieldJson( sourcePDF, function(err, form_fields) { 
            should.not.exist(err);
            form_fields.should.equal(expected);
            done();
        });
    });
    
});

describe('generateFDFTemplate Unit Tests', function(){
    beforeEach(function(done){
        expected = {
            "last_name" : "",
            "first_name" : "",
            "date" : "",
            "football" : "",
            "baseball" : "",
            "basketball" : "",
            "hockey" : "",
            "nascar" : ""
        };
        sourcePDF = "test/test.pdf";
    });
    it('Should generate an empty FDF Template as expected', function(){
        pdfFiller.generateFDFTemplate( sourcePDF, function(err, fdfTemplate) { 
            should.not.exist(err);
            fdfTemplate.should.equal(expected);
            done();
        });
    });
    
});

describe('convFieldJson2FDF Unit Tests', function(){
    beforeEach(function(done){
        expected = {
            "last_name" : "John",
            "first_name" : "Doe",
            "date" : "Jan 1, 2013",
            "football" : "Off",
            "baseball" : "Yes",
            "basketball" : "Off",
            "hockey" : "Yes",
            "nascar" : "Off"
        };
        
        data = [
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
        sourcePDF = "test/test.pdf";
    });
    it('Should generate an empty FDF Template as expected', function(){
        var FDFData = pdfFiller.convFieldJson2FDF( data );
        FDFData.should.equal(expected);
        done();
    });
    
});

describe('mapForm2PDF Unit Tests', function(){
    beforeEach(function(done){
        var convMap = {
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
        
        data = {
            "lastName" : "John",
            "firstName" : "Doe",
            "Date" : "Jan 1, 2013",
            "footballField" : "Off",
            "baseballField" : "Yes",
            "bballField" : "Off",
            "hockeyField" : "Yes",
            "nascarField" : "Off"
        };
        
        expected = {
            "last_name" : "John",
            "first_name" : "Doe",
            "date" : "Jan 1, 2013",
            "football" : "Off",
            "baseball" : "Yes",
            "basketball" : "Off",
            "hockey" : "Yes",
            "nascar" : "Off"
        };
        sourcePDF = "test/test.pdf";
    });
    it('Should generate form field JSON as expected', function(){
        pdfFiller.mapForm2PDF( data, convMap, function(err, mappedFields) { 
            should.not.exist(err);
            mappedFields.should.equal(expected);
            done();
        });
    });
    
});







