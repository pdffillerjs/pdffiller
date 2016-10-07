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
    dest1PDF =  "test/test_complete1.pdf",
    source1PDF = "test/test1.pdf";


/**
 * Unit tests
 */
describe('pdfFiller Tests', function(){

    describe('fillForm()', function(){

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

        it('should not throw an error when creating test_complete.pdf from test.pdf with filled data', function(done) {
            this.timeout(15000);
            pdfFiller.fillForm( source2PDF, dest2PDF, _data, function(err) {
                should.not.exist(err);
                done();
            });
        });

        it('should create an completely filled PDF that is read-only', function(done) {
            this.timeout(15000);
            pdfFiller.fillFormWithFlatten( source2PDF, dest2PDF, _data, true, function(err) {
                pdfFiller.generateFieldJson(dest2PDF, null, function(err, fdfData) {
                    fdfData.length.should.equal(0);
                    done();
                });
            });
        });

        it('should create an completely filled PDF that is read-only and with an specific temporary folder for FDF files', function(done) {
            this.timeout(15000);
            pdfFiller.fillFormWithOptions( source2PDF, dest2PDF, _data, true, './', function(err) {
                pdfFiller.generateFieldJson(dest2PDF, null, function(err, fdfData) {
                    fdfData.length.should.equal(0);
                    done();
                });
            });
        });

        it('should create an unflattened PDF with unfilled fields remaining', function(done) {
            this.timeout(15000);
            var source3PDF = source2PDF;
            var dest3PDF = "test/test_complete3.pdf";
            var _data2 = {
                "first_name": "Jerry",
            };
            pdfFiller.fillFormWithFlatten( source3PDF, dest3PDF, _data2, false, function(err) {
                pdfFiller.generateFieldJson(dest3PDF, null, function(err, fdfData) {
                    fdfData.length.should.not.equal(0);
                    done();
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

        it('should generate form field JSON as expected', function(done){
            this.timeout(15000);
            pdfFiller.generateFieldJson( source2PDF, null, function(err, form_fields) {
                should.not.exist(err);
                form_fields.should.eql(_expected);
                done();
            });
        });

        it('should generate another form field JSON with no errors', function(done){
            this.timeout(15000);
            pdfFiller.generateFieldJson( source1PDF, null, function(err, form_fields) {
                should.not.exist(err);
                form_fields.should.eql(expected.test1.form_fields);
                done();
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

        it('should generate a FDF Template as expected', function(done){
            this.timeout(15000);
            pdfFiller.generateFDFTemplate( source2PDF, null, function(err, fdfTemplate) {
                should.not.exist(err);
                fdfTemplate.should.eql(_expected);
                done();
            });
        });

        it('should generate another FDF Template with no errors', function(done){
            this.timeout(15000);
            pdfFiller.generateFDFTemplate( source1PDF, null, function(err, fdfTemplate) {
                should.not.exist(err);
                fdfTemplate.should.eql(expected.test1.fdfTemplate);
                done();
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
