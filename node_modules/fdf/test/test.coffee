
fdf = require '../index'
fs = require 'fs'
data = fdf.generate
  name: 'Clark'
  type: 'superhero'

fs.writeFileSync('document.fdf', data)
