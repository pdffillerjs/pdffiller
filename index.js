/*
*   File:       index.js (pdffiller)
*   Project:    PDF Filler
*   Date:       May 2015.
*
*   Description: This PDF filler module takes a data set and creates a filled out
*                PDF file with the form fields populated.
*/
(function(){
    var child_process = require('child_process'),
        exec = require('child_process').exec,
        fdf = require('fdf'),
        _ = require('lodash'),
        fs = require('fs');

    var pdffiller = {

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

        generateFieldJson: function( sourceFile, nameRegex, callback){
            var regName = /FieldName: ([^\n]*)/,
                regType = /FieldType: ([A-Za-z\t .]+)/,
                regFlags = /FieldFlags: ([0-9\t .]+)/,
                fieldArray = [],
                currField = {};
            
            if(nameRegex !== null && (typeof nameRegex) == 'object' ) regName = nameRegex;

            exec( "pdftk " + sourceFile + " dump_data_fields_utf8 " , function (error, stdout, stderr) {
                if (error) {
                    console.log('exec error: ' + error);
                    return callback(error, null);
                }
                
                fields = stdout.toString().split("---").slice(1);
                fields.forEach(function(field){
                    currField = {};
                    
                    currField['title'] = field.match(regName)[1].trim() || ''; 

                    if(field.match(regType)){
                        currField['fieldType'] = field.match(regType)[1].trim() || '';  
                    }else {
                        currField['fieldType'] = '';
                    }

                    if(field.match(regFlags)){
                        currField['fieldFlags'] = field.match(regFlags)[1].trim()|| '';
                    }else{ 
                        currField['fieldFlags'] = '';
                    }

                    currField['fieldValue'] = '';
                    
                    fieldArray.push(currField);
                });
                
                return callback(null, fieldArray);
            });
        },
        
        generateFDFTemplate: function( sourceFile, nameRegex, callback ){
            this.generateFieldJson(sourceFile, nameRegex, function(err, _form_fields){
                if (err) {
                  console.log('exec error: ' + err);
                  return callback(err, null);
                }
                var _keys   = _.pluck(_form_fields, 'title'),
            	    _values = _.pluck(_form_fields, 'fieldValue'),
                    jsonObj = _.zipObject(_keys, _values);
                
                return callback(null, jsonObj);
                
            });
        },

        fillForm: function( sourceFile, destinationFile, fieldValues, callback ) {

            //Generate the data from the field values.
            var formData = fdf.generate( fieldValues ),
                tempFDF = "data" + (new Date().getTime()) + ".fdf";

            //Write the temp fdf file.
            fs.writeFile( tempFDF, formData, function( err ) {

                if ( err ) {
                    return callback(err);
                }

                child_process.exec( "pdftk " + sourceFile + " fill_form " + tempFDF + " output " + destinationFile + " flatten", function (error, stdout, stderr) {

                    if ( error ) {
                      console.log('exec error: ' + error);
                      return callback(error);
                    }
                    //Delete the temporary fdf file.
                    fs.unlink( tempFDF, function( err ) {

                        if ( err ) {
                            return callback(err);
                        }
                        // console.log( 'Sucessfully deleted temp file ' + tempFDF );
                        return callback();
                    });
                } );
            });
        }
    };

    module.exports = pdffiller;

}())
