js-fdf
======

A commonjs FDF (Form Data Format) generator. FDF is a format you can use to populate Adobe PDF forms. This generator is inspired by this tutorial http://koivi.com/fill-pdf-form-fields/tutorial.php by Justin Koivisto, but uses javascript instead of PHP.

````javascript
var fdf = require('fdf');

fdf = require('js-fdf')

data = fdf.generate
  name: 'Clark'
  type: 'superhero'

fs.writeFileSync('data.fdf', data)
````

A typical way to use the resulting fdf file is:

````
pdftk form.pdf fill_form data.fdf output - flatten
````

This will populate form.pdf with the values
