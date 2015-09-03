/*
*   File:       index.js (pdffiller)
*   Project:    PDF Filler
*   Date:       May 2015.
*
*   Description: This PDF filler module takes a data set and creates a filled out
*                PDF file with the form fields populated.
*/

var sys = require( 'sys' ),
    exec = require( 'child_process' ).exec,
    fdf = require( 'fdf' ),
    _ = require('lodash'),
    fs = require( 'fs' );

module.exports = {

    mapForm2PDF: function( formFields, convMap ){
        var tmpFDFData = this.convFieldJson2FDF(formFields);
        tmpFDFData = _.mapKeys(tmpFDFData, function(value, key){
            try {
                convMap[key];
            } catch(err){

                return key;
            } 
            return convMap[key];
        });

        return tmpFDFData;
    },

    generateFieldJson: function( sourceFile, nameRegex, callback ){
        var regName = /FieldName: ([^\n]*)/,
            regType = /FieldType: ([A-Za-z\t .]+)/,
            fieldArray = [],
            currField = {};
        
        if(nameRegex !== null ) regName = nameRegex;
        
        exec( "pdftk " + sourceFile + " dump_data_fields_utf8 " , function (error, stdout, stderr) {

            if (error) {
              console.log('exec error: ' + error);
              callback(error, null);
            } else {
                fields = stdout.toString().split("---").slice(1);
                fields.forEach(function(field){
                    currField = {};
                    currField['title'] = field.match(regName)[1].trim();
                    currField['fieldType'] = field.match(regType)[1].trim();
                    currField['fieldValue'] = '';
                    
                    fieldArray.push(currField);
                });
                callback(null, fieldArray);
            }
        } );
    },
    
    convFieldJson2FDF: function(fieldJson){
        var _keys = _.pluck(fieldJson, 'title'),
		    _values = _.pluck(fieldJson, 'fieldValue');

    	_values = _.map(_values, function(val){
            if(val === true){
                return 'Yes';
            }else if(val === false) {
                return 'Off';
            }
            return val;
        });

    	var jsonObj = _.zipObject(_keys, _values);

    	return jsonObj;
    },
    
    generateFDFTemplate: function( sourceFile, nameRegex, callback ){
        this.generateFieldJson(sourceFile, nameRegex, function(err, _form_fields){
            if (err) {
              console.log('exec error: ' + error);
              callback(error, null);
            } else {
                var _keys = _.pluck(_form_fields, 'title');
        	
        	var _values = _.pluck(_form_fields, 'fieldValue');
        	    	
            	var jsonObj = _.zipObject(_keys, _values);
            	callback(null, jsonObj);
            }
        });
    },

    fillForm: function( sourceFile, destinationFile, fieldValues, callback ) {

        //Generate the data from the field values.
        var formData = fdf.generate( fieldValues ),
            tempFDF = "data" + (new Date().getTime()) + ".fdf";

        //Write the temp fdf file.
        fs.writeFile( tempFDF, formData, function( err ) {

            if ( err ) callback(err);

            exec( "pdftk " + sourceFile + " fill_form " + tempFDF + " output " + destinationFile + " flatten", function (error, stdout, stderr) {

                if (err !== null) {
                  console.log('exec error: ' + err);
                  callback(err);
                } else {
                    //Delete the temporary fdf file.
                    fs.unlink( tempFDF, function( err ) {

                        if ( err ) callback(err);
                        console.log( 'Sucessfully deleted temp file ' + tempFDF );
                        callback();
                    });
                }
            } );
        });
    }
};
