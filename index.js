var spawn = require('child_process').spawn,
    fdf = require("./fdf.js"),
    _ = require('lodash'),
    fs = require('fs');

var pdffiller = {

    mapForm2PDF: function (formFields, convMap) {
        var tmpFDFData = this.convFieldJson2FDF(formFields);
        tmpFDFData = _.mapKeys(tmpFDFData, function (value, key) {
            try {
                convMap[key];
            } catch (err) {

                return key;
            }
            return convMap[key];
        });

        return tmpFDFData;
    },

    convFieldJson2FDF: function (fieldJson) {
        var _keys = _.map(fieldJson, 'title'),
            _values = _.map(fieldJson, 'fieldValue');

        _values = _.map(_values, function (val) {
            if (val === true) {
                return 'Yes';
            } else if (val === false) {
                return 'Off';
            }
            return val;
        });

        var jsonObj = _.zipObject(_keys, _values);

        return jsonObj;
    },

    generateFieldJson: function (sourceFile, nameRegex) {
        var regName = /FieldName: ([^\n]*)/,
            regType = /FieldType: ([A-Za-z\t .]+)/,
            regFlags = /FieldFlags: ([0-9\t .]+)/,
            fieldArray = [],
            currField = {};

        if (nameRegex !== null && (typeof nameRegex) == 'object') regName = nameRegex;

        return new Promise(function (resolve, reject) {
            var childProcess = spawn("pdftk", [sourceFile, "dump_data_fields_utf8"]);
            var output = '';

            childProcess.on('error', function (err) {
                console.log('pdftk exec error: ' + err);
                reject(err);
            });

            childProcess.stdout.on('data', function (data) {
                output += data;
            });

            childProcess.stdout.on('end', function () {
                
                fields = output.split("---").slice(1);

                fields.forEach(function (field) {
                    currField = {};
                    currField['title'] = field.match(regName)[1].trim() || '';

                    if (field.match(regType)) {
                        currField['fieldType'] = field.match(regType)[1].trim() || '';
                    } else {
                        currField['fieldType'] = '';
                    }

                    if (field.match(regFlags)) {
                        currField['fieldFlags'] = field.match(regFlags)[1].trim() || '';
                    } else {
                        currField['fieldFlags'] = '';
                    }

                    currField['fieldValue'] = '';
                    fieldArray.push(currField);
                });

                resolve(fieldArray);
            });

        });
    },

    generateFDFTemplate: function (sourceFile, nameRegex) {
        return new Promise(function (resolve, reject) {

            this.generateFieldJson(sourceFile, nameRegex).then(function (_form_fields) {

                var _keys = _.map(_form_fields, 'title'),
                    _values = _.map(_form_fields, 'fieldValue'),
                    jsonObj = _.zipObject(_keys, _values);

                resolve(jsonObj);

            }).catch(function (err) {

                reject(err);

            });
        }.bind(this));
    },

    fillFormWithOptions: function (sourceFile, fieldValues, shouldFlatten) {

        var promised = new Promise(function (resolve, reject) {

            //Generate the data from the field values.
            var randomSequence = Math.random().toString(36).substring(7);
            var currentTime = new Date().getTime();
            var FDFinput = fdf.createFdf(fieldValues);

            var args = [sourceFile, "fill_form", '-', "output", '-'];
            if (shouldFlatten) {
                args.push("flatten");
            }
            
            var childProcess = spawn("pdftk", args);

            childProcess.stderr.on('data', function (err) {
                console.log('pdftk exec error: ' + err);
                reject(err);
            });

	        function sendData (data) {
                childProcess.stdout.pause();
                childProcess.stdout.unshift(data);
                resolve(childProcess.stdout);
                childProcess.stdout.removeListener('data', sendData);
            };

            childProcess.stdout.on('data', sendData);

            // now pipe FDF to pdftk
            childProcess.stdin.write(FDFinput);
            childProcess.stdin.end();
            
        });

        // bind convenience method toFile for chaining
        promised.toFile = toFile.bind(null, promised); 
        return promised;
    },

    fillFormWithFlatten: function (sourceFile, fieldValues, shouldFlatten) {
        return this.fillFormWithOptions(sourceFile, fieldValues, shouldFlatten);
    },

    fillForm: function (sourceFile, fieldValues) {
        return this.fillFormWithFlatten(sourceFile, fieldValues, true);
    },

};

/** 
 * convenience chainable method for writing to a file (see examples)
 **/
function toFile (promised, path) {
    return new Promise(function (resolve, reject) {
        promised.then(function(outputStream) {

            var output = fs.createWriteStream(path);

            outputStream.pipe(output);
            outputStream.on('close', function() {
                output.end();
                resolve();
            });

        }).catch(function (error) {
            reject(error);
        });
    });
}

module.exports = pdffiller;
