const typescript = require('rollup-plugin-typescript2');
const uglifyjs = require('rollup-plugin-uglify');
const path = require('path');

export default [
  {
    input: path.resolve(__dirname, '../src/index.ts'),
    output: {
      file: path.resolve(__dirname, '../dist/pizza.js'),
      format: 'umd',
      name: 'Pizza'
    },
    plugins: [
      typescript({})
    ],
  },

  {
    input: path.resolve(__dirname, '../src/worker.ts'),
    output: {
      file: path.resolve(__dirname, '../dist/worker.js'),
      format: 'commonjs',
      name: 'Pizza'
    },
    plugins: [
      typescript({})
    ],
  },
];