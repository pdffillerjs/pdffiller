/*
*   File:       pdf.js
*   Project:    PDF Filler
*   Date:       June 2015.
*
*/

var pdfFiller = require('pdffiller'), 
    should = require('should');

var sourcePDF,
    destinationPDF,
    data, expected, convMap;

/**
 * Unit tests
 */
// describe('fillForm Unit Tests', function(){
//         data = {
//             "last_name" : "John",
//             "first_name" : "Doe",
//             "date" : "Jan 1, 2013",
//             "football" : "Off",
//             "baseball" : "Yes",
//             "basketball" : "Off",
//             "hockey" : "Yes",
//             "nascar" : "Off"
//         };
//         destinationPDF =  "test/test_complete.pdf";
//         sourcePDF = "test/test.pdf";
    
//     it('should not throw an error', function(done) {
//         pdfFiller.fillForm( sourcePDF, destinationPDF, data, function(err) { 
//             should.not.exist(err);
//             done();
//         });
//     });
// });

// describe('generateFieldJson Unit Tests', function(){
//         expected = [
//             {
//                 "title" : "last_name",
//                 "fieldType": "Text"
//             },
//             {
//                 "title" : "first_name",
//                 "fieldType": "Text"
//             },
//             {
//                 "title" : "date",
//                 "fieldType": "Text"
//             },
//             {
//                 "title" : "football",
//                 "fieldType": "Button"
//             },
//             {
//                 "title" : "baseball",
//                 "fieldType": "Button"
//             },
//             {
//                 "title" : "basketball",
//                 "fieldType": "Button"
//             },
//             {
//                 "title" : "hockey",
//                 "fieldType": "Button"
//             },
//             {
//                 "title" : "nascar",
//                 "fieldType": "Button"
//             }
//         ];
//         sourcePDF = "test/test.pdf";

//     it('Should generate form field JSON as expected', function(done){
//         pdfFiller.generateFieldJson( sourcePDF, function(err, form_fields) { 
//             should.not.exist(err);
//             form_fields.should.equal(expected);
//             done();
//         });
//     });
    
// });

// describe('generateFDFTemplate Unit Tests', function(){

//         expected = {
//             "last_name" : "",
//             "first_name" : "",
//             "date" : "",
//             "football" : "",
//             "baseball" : "",
//             "basketball" : "",
//             "hockey" : "",
//             "nascar" : ""
//         };
//         sourcePDF = "test/test.pdf";

//     it('Should generate an empty FDF Template as expected', function(done){
//         pdfFiller.generateFDFTemplate( sourcePDF, function(err, fdfTemplate) { 
//             should.not.exist(err);
//             fdfTemplate.should.equal(expected);
//             done();
//         });
//     });
    
// });

describe('convFieldJson2FDF Unit Tests', function(){

    expected = {
        "first_name" : "John",
        "last_name" : "Doe",
        "date" : "Jan 1, 2013",
        "football" : "Off",
        "baseball" : "Yes",
        "basketball" : "Off",
        "hockey" : "Yes",
        "nascar" : "Off"
    };
    
    data = [
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
    sourcePDF = "test/test.pdf";
    
    it('Should generate an corresponding FDF object', function(done){
        var FDFData = pdfFiller.convFieldJson2FDF( data );
        should.exist(FDFData);
        should.exist(expected);
        console.log(FDFData);
        FDFData.should.equal(expected);
        done();
    });
    
});

// describe('mapForm2PDF Unit Tests', function(){

//     convMap = {
//         "lastName": "last_name",
//         "firstName": "first_name",
//         "Date": "date",
//         "footballField": "football",
//         "baseballField": "baseball",
//         "bballField": "basketball",
//         "hockeyField": "hockey",
//         "nascarField": "nascar"
//     };
    
//     data = [
//         {
//             "title" : "lastName",
//             "fieldfieldType": "Text",
//             "fieldValue": "John"
//         },
//         {
//             "title" : "firstName",
//             "fieldfieldType": "Text",
//             "fieldValue": "Doe"
//         },
//         {
//             "title" : "Date",
//             "fieldType": "Text",
//             "fieldValue": "Jan 1, 2013"
//         },
//         {
//             "title" : "footballField",
//             "fieldType": "Button",
//             "fieldValue": false
//         },
//         {
//             "title" : "baseballField",
//             "fieldType": "Button",
//             "fieldValue": true
//         },
//         {
//             "title" : "bballField",
//             "fieldType": "Button",
//             "fieldValue": false
//         },
//         {
//             "title" : "hockeyField",
//             "fieldType": "Button",
//             "fieldValue": true
//         },
//         {
//             "title" : "nascarField",
//             "fieldType": "Button",
//             "fieldValue": false
//         }
//     ];
    
//     expected = {
//         "last_name" : "John",
//         "first_name" : "Doe",
//         "date" : "Jan 1, 2013",
//         "football" : "Off",
//         "baseball" : "Yes",
//         "basketball" : "Off",
//         "hockey" : "Yes",
//         "nascar" : "Off"
//     };
//     sourcePDF = "test/test.pdf";

//     it('Should convert formJson to FDF data as expected', function(done){
//         var convertedFDF = pdfFiller.mapForm2PDF( data, convMap );
//         should.exist(convertedFDF);
//         convertedFDF.should.equal(expected);
//         done();
//     });
    
// });







