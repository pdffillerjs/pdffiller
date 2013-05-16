# A commonjs, coffeescript FDF generator inspired by Justin Koivisto's "KOIVI HTML Form to FDF Parser for PHP (C) 2004"
# http://koivi.com/fill-pdf-form-fields/tutorial.php
# @author Clark Van Oyen


md5 = require "MD5"
fs = require "fs"

#   fdf.generate
#   ---------
#   Generates an FDF (Form Data File) from a provided input map from field name to field value.
#
#   @param form      The input map from field name to field value. ie) {name: 'Clark', type: 'superhero'}
#   @param file      The url or file path of the PDF file which this data is for.
#   @result          FDF representation of the form. You will usually write this to a file.
module.exports.generate = (form, file) ->
    header = (String.fromCharCode 226) + (String.fromCharCode 227) + (String.fromCharCode 207) + (String.fromCharCode 211)
    data =  """%FDF-1.2
            %#{header}
            1 0 obj 
            <<
            /FDF 
            <<
            /Fields [
            """
    for field, val of form
        if typeof val is "array"
            data += """<<
                    /V(#{val})
                    /T["""
            for opt in val
                data += "(" + opt + ")"
            data += "]>>"
        else
            data += """<<
                    /V(#{val})
                    /T(#{field})
                    >>
                    """
    #time_hash = md5 (new Date()).valueOf()
    data += """] 
            >>
            >>
            endobj 
            trailer

            <<
            /Root 1 0 R
            >>
            %%EOF
            """
    data