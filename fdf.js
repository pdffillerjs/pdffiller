var fs = require('fs');
var _ = require('lodash');

// only this sequence in FDF header requires char codes
var headerChars = new Buffer(
    (String.fromCharCode(226)) +
    (String.fromCharCode(227)) +
    (String.fromCharCode(207)) +
    (String.fromCharCode(211)) +
    "\n"
);

var header = Buffer.concat([
    new Buffer("%FDF-1.2\n"),
    headerChars,
    new Buffer(
        "1 0 obj \n" +
        "<<\n" +
        "/FDF \n" +
        "<<\n" +
        "/Fields [\n"
    )
]);

var footer = new Buffer(
    "]\n" +
    ">>\n" +
    ">>\n" +
    "endobj \n" +
    "trailer\n" +
    "\n" +
    "<<\n" +
    "/Root 1 0 R\n" +
    ">>\n" +
    "%%EOF\n"
)

var escapeString = function escapeString(value) {
    var out = value.toString();
    out = out.replace(/\\/g, "\\\\");
    out = out.replace(/\(/g, "\\(");
    out = out.replace(/\)/g, "\\)");
    out = out.toString("utf8");
    return out;
}

exports.createFdf = function (data) {    
    var body = new Buffer([]);

    _.mapKeys(data, function (value, name) {
        try {
            body = Buffer.concat([
                body,
                new Buffer(
                    "<<\n" +
                    "/T (" +
                    escapeString(name) +
                    ")\n" +
                    "/V (" +
                    escapeString(value) +
                    ")\n" +
                    ">>\n"
                )
            ]);
        } catch (err) {
            let errMsg = "Cannot escape string: '" + name + ": " + value + "'.";
            throw Error(errMsg);
        }
    });

    return Buffer.concat([header, body, footer]);
}