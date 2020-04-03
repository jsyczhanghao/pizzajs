const typescript = require('rollup-plugin-typescript2');
const uglifyjs = require('rollup-plugin-uglify');
const path = require('path');

export default {
  input: path.resolve(__dirname, '../src/pizza.ts'),
  output: {
    file: path.resolve(__dirname, '../dist/pizza.js'),
    format: 'umd',
    name: 'pizza'
  },
  plugins: [
    typescript(),
    uglifyjs.uglify(),
  ],
};