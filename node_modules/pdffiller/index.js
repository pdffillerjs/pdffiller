/*
*   File:       index.js (pdffiller)
*   Project:    PDF Filler
*   Date:       May 2013.
*
*   Description: This PDF filler module takes a data set and creates a filled out
*                PDF file with the form fields populated.
*/

var sys = require( 'sys' ),
    exec = require( 'child_process' ).exec,
    fdf = require( 'fdf' ),
    fs = require( 'fs' );

module.exports = {

    fillForm: function( sourceFile, destinationFile, fieldValues, callback ) {

        //Generate the data from the field values.
        var formData = fdf.generate( fieldValues ),
            tempFDF = "data.fdf";

        //Write the temp fdf file.
        fs.writeFile( tempFDF, formData, function( err ) {

            if ( err ) throw err;

            exec( "pdftk " + sourceFile + " fill_form " + tempFDF + " output " + destinationFile + " flatten", function (error, stdout, stderr) {

                if (error !== null) {
                  console.log('exec error: ' + error);
                  throw error;
                } else {
                    //Delete the temporary fdf file.
                    fs.unlink( tempFDF, function( err ) {

                        if ( err ) throw err;
                        console.log( 'Sucessfully deleted temp file ' + tempFDF );
                        callback();
                    });
                }
            } );
        });
    }
};
