import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import pkg from './package.json';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

export default {
  input: './src/index.ts',
  plugins: [resolve({ extensions }), typescript()],
  output: [
    {
      file: pkg.main,
      format: 'cjs'
    },
    {
      file: pkg.module,
      format: 'es'
    },
    {
      file: pkg.browser,
      format: 'iife',
      name: 'tsrock',
      globals: {}
    }
  ]
};
