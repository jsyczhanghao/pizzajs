const typescript = require('rollup-plugin-typescript');
const string = require('rollup-plugin-string');
const path = require('path');

export default {
  input: path.resolve(__dirname, '../example/src/app.ts'),
  output: {
    file: path.resolve(__dirname, '../example/dist/app.js'),
    format: 'umd',
  },
  plugins: [
    typescript(),
    string.string({
      include: '**/*.{tpl,css}',
    }),
  ],
};