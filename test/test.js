/*
*   File:       pdf.js
*   Project:    PDF Filler
*   Date:       June 2015.
*
*/

var pdfFiller = require('pdffiller'), 
    should = require('should');

var destinationPDF =  "test/test_complete.pdf";
    sourcePDF = "test/test.pdf";

/**
 * Unit tests
 */
describe('fillForm Unit Tests', function(){
    var _data = {
        "first_name" : "John",
        "last_name" : "Doe",
        "date" : "Jan 1, 2013",
        "football" : "Off",
        "baseball" : "Yes",
        "basketball" : "Off",
        "hockey" : "Yes",
        "nascar" : "Off"
    };

    
    it('should not throw an error', function() {
        pdfFiller.fillForm( sourcePDF, destinationPDF, _data, function(err) { 
            should.not.exist(err);
        });
    });
});

describe('generateFieldJson Unit Tests', function(){
    var _expected = [
        {
            "title" : "first_name",
            "fieldValue": "",
            "fieldType": "Text"
        },
        {
            "title" : "last_name",
            "fieldValue": "",
            "fieldType": "Text"
        },
        {
            "title" : "date",
            "fieldValue": "",
            "fieldType": "Text"
        },
        {
            "title" : "football",
            "fieldValue": "",
            "fieldType": "Button"
        },
        {
            "title" : "baseball",
            "fieldValue": "",
            "fieldType": "Button"
        },
        {
            "title" : "basketball",
            "fieldValue": "",
            "fieldType": "Button"
        },
        {
            "title" : "nascar",
            "fieldValue": "",
            "fieldType": "Button"
        },
        {
            "title" : "hockey",
            "fieldValue": "",
            "fieldType": "Button"
        }
    ];

    it('Should generate form field JSON as expected', function(){
        pdfFiller.generateFieldJson( sourcePDF, function(err, form_fields) { 
            should.not.exist(err);
            console.log(form_fields);
            form_fields.should.equal(_expected);
        });
    });
    
});

describe('generateFDFTemplate Unit Tests', function(){

    var _expected = {
        "last_name" : "",
        "first_name" : "",
        "date" : "",
        "football" : "",
        "baseball" : "",
        "basketball" : "",
        "hockey" : "",
        "nascar" : ""
    };

    it('Should generate an empty FDF Template as expected', function(){
        pdfFiller.generateFDFTemplate( sourcePDF, function(err, fdfTemplate) { 
            should.not.exist(err);
            fdfTemplate.should.equal(_expected);
            // done();
        });
    });
    
});

describe('convFieldJson2FDF Unit Tests', function(){

    var _expected = {
        "first_name" : "John",
        "last_name" : "Doe",
        "date" : "Jan 1, 2013",
        "football" : "Off",
        "baseball" : "Yes",
        "basketball" : "Off",
        "hockey" : "Yes",
        "nascar" : "Off"
    };
    
    var _data = [
        {
            "title" : "first_name",
            "fieldfieldType": "Text",
            "fieldValue": "John"
        },
        {
            "title" : "last_name",
            "fieldfieldType": "Text",
            "fieldValue": "Doe"
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
            "fieldType": "Button",
            "fieldValue": false
        },
        {
            "title" : "hockey",
            "fieldType": "Button",
            "fieldValue": true
        },
        {
            "title" : "nascar",
            "fieldType": "Button",
            "fieldValue": false
        }
    ];
    
    it('Should generate an corresponding FDF object', function(done){
        var FDFData = pdfFiller.convFieldJson2FDF( _data );
        should.exist(FDFData);
        should.exist(_expected);
        console.log(FDFData);
        console.log(_expected);
        (FDFData).should.eql(_expected);
        done();
    });
    
});

describe('mapForm2PDF Unit Tests', function(){

    var _convMap = {
        "lastName": "last_name",
        "firstName": "first_name",
        "Date": "date",
        "footballField": "football",
        "baseballField": "baseball",
        "bballField": "basketball",
        "hockeyField": "hockey",
        "nascarField": "nascar"
    };
    
    var _data = [
        {
            "title" : "lastName",
            "fieldfieldType": "Text",
            "fieldValue": "John"
        },
        {
            "title" : "firstName",
            "fieldfieldType": "Text",
            "fieldValue": "Doe"
        },
        {
            "title" : "Date",
            "fieldType": "Text",
            "fieldValue": "Jan 1, 2013"
        },
        {
            "title" : "footballField",
            "fieldType": "Button",
            "fieldValue": false
        },
        {
            "title" : "baseballField",
            "fieldType": "Button",
            "fieldValue": true
        },
        {
            "title" : "bballField",
            "fieldType": "Button",
            "fieldValue": false
        },
        {
            "title" : "hockeyField",
            "fieldType": "Button",
            "fieldValue": true
        },
        {
            "title" : "nascarField",
            "fieldType": "Button",
            "fieldValue": false
        }
    ];
    
    var _expected = {
        "last_name" : "John",
        "first_name" : "Doe",
        "date" : "Jan 1, 2013",
        "football" : "Off",
        "baseball" : "Yes",
        "basketball" : "Off",
        "hockey" : "Yes",
        "nascar" : "Off"
    };

    it('Should convert formJson to FDF data as expected', function(done){
        var convertedFDF = pdfFiller.mapForm2PDF( _data, _convMap );
        should.exist(convertedFDF);
        (convertedFDF).should.eql(_expected);
        done();
    });
    
});







