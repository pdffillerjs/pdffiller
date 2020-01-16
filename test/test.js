/*
*   File:       pdf.js
*   Project:    PDF Filler
*   Date:       June 2015.
*
*/

var pdfFiller = require('../index'),
    should = require('should'),
    expected = require('./expected_data');

var dest2PDF =  "test/test_complete2.pdf",
    source2PDF = "test/test.pdf",
    source1PDF = "test/test1.pdf";

var Readable = require('stream').Readable;


/**
 * Unit tests
 */
describe('pdfFiller Tests', function(){

    describe('fillForm()', function(){

        var _data = {
            "first_name" : "1) John",
            "last_name" : "Doe",
            "date" : "Jan 1, 2013",
            "football" : "Off",
            "baseball" : "Yes",
            "basketball" : "Off",
            "hockey" : "Yes",
            "nascar" : "Off"
        };

        it('should return a readable stream when creating a pdf from test.pdf with filled data', function() {
            // mocha will handle errors from returned promises automatically
            return pdfFiller.fillForm( source2PDF, _data).then(function (stream) {
                stream.should.be.an.instanceof(Readable);
            });
        });

        it('should use toFile to create a completely filled PDF that is read-only', function() {
            return pdfFiller.fillFormWithFlatten( source2PDF, _data, true)
                .toFile(dest2PDF)
                .then(function () {
                    return pdfFiller.generateFieldJson(dest2PDF, null).then(function (fdfData) {
                        fdfData.length.should.equal(0);
                    });
                });
        });


        it('should create an unflattened PDF with unfilled fields remaining', function() {
            var source3PDF = source2PDF;
            var dest3PDF = "test/test_complete3.pdf";
            var _data2 = {
                "first_name": "Jerry",
            };

            return pdfFiller.fillFormWithFlatten( source3PDF, _data2, false)
                .toFile(dest3PDF)
                .then(function() {
                    return pdfFiller.generateFieldJson(dest3PDF, null).then(function (fdfData) {
                        fdfData.length.should.not.equal(0);
                    });
                });
        });

        it('should handle expanded utf characters and diacritics', function() {
            var source4PDF = source2PDF;
            var dest4PDF = "test/test_complete4.pdf";
            var diacriticsData = Object.assign({}, _data, {
                "first_name": "मुख्यपृष्ठम्",
                "last_name": "é àالعقائدية الأخرى",
            })

            return pdfFiller.fillFormWithFlatten( source4PDF, diacriticsData, false)
                .toFile(dest4PDF)
                .then(function() {
                    return pdfFiller.generateFieldJson(dest4PDF, null).then(function (fdfData) {
                        fdfData.length.should.not.equal(0);
                    });
                });
        });
    });

    describe('generateFieldJson()', function(){
        var _expected = [
            {
                "fieldFlags": "0",
                "title" : "first_name",
                "fieldValue": "",
                "fieldType": "Text"
            },
            {
                "fieldFlags": "0",
                "title" : "last_name",
                "fieldValue": "",
                "fieldType": "Text"
            },
            {
                "fieldFlags": "0",
                "title" : "date",
                "fieldValue": "",
                "fieldType": "Text"
            },
            {
                "fieldFlags": "0",
                "title" : "football",
                "fieldValue": "",
                "fieldType": "Button"
            },
            {
                "fieldFlags": "0",
                "title" : "baseball",
                "fieldValue": "",
                "fieldType": "Button"
            },
            {
                "fieldFlags": "0",
                "title" : "basketball",
                "fieldValue": "",
                "fieldType": "Button"
            },
            {
                "fieldFlags": "0",
                "title" : "nascar",
                "fieldValue": "",
                "fieldType": "Button"
            },
            {
                "fieldFlags": "0",
                "title" : "hockey",
                "fieldValue": "",
                "fieldType": "Button"
            }
        ];

        it('should generate form field JSON as expected', function(){
            return pdfFiller.generateFieldJson( source2PDF, null).then(function(form_fields) {
                form_fields.should.eql(_expected);
            });
        });

        it('should generate another form field JSON with no errors', function(){
            return pdfFiller.generateFieldJson( source1PDF, null).then(function (form_fields) {
                form_fields.should.eql(expected.test1.form_fields);
            });
        });
    });

    describe('generateFDFTemplate()', function(){

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

        it('should generate a FDF Template as expected', function(){
            return pdfFiller.generateFDFTemplate( source2PDF, null).then(function(fdfTemplate) {
                fdfTemplate.should.eql(_expected);
            });
        });

        it('should generate another FDF Template with no errors', function(){
            return pdfFiller.generateFDFTemplate( source1PDF, null).then(function(fdfTemplate) {
                fdfTemplate.should.eql(expected.test1.fdfTemplate);
            });
        });
    });

    describe('convFieldJson2FDF()', function(){

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
            (FDFData).should.eql(_expected);
            done();
        });
    });

    describe('mapForm2PDF()', function(){

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

});
