import js from '@eslint/js';
import globals from 'globals';
export default [js.configs.recommended, { ignores: ['node_modules/**', 'public/**'] }, { files: ['**/*.js'], languageOptions: { globals: globals.node }, rules: { 'no-unused-vars': ['error', { argsIgnorePattern: '^_' }] } }];
