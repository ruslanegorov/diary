import { defineConfig } from 'eslint/config';
import prettier from 'eslint-plugin-prettier';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default defineConfig([
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  reactHooks.configs.flat.recommended,
  prettierRecommended,
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
      prettier,
      react,
      'react-hooks': reactHooks,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'react/prop-types': 'off',
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
]);
