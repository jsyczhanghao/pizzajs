const typescript = require('rollup-plugin-typescript');
const html = require('rollup-plugin-html');
const path = require('path');

export default {
  input: path.resolve(__dirname, '../examples/src/background.ts'),
  output: {
    file: path.resolve(__dirname, '../examples/dist/background.js'),
    format: 'umd',
  },
  plugins: [
    typescript(),
    html({
			include: '**/*.{pxml,css}',
		}),
  ],
};