module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  root: true,
  env: {
    node: true,
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/ban-types': 'off',
    'arrow-spacing': ['error', { 'before': true, 'after': true }],
    'comma-spacing': ['error', { 'before': false, 'after': true }],
    'object-curly-spacing': ['error', 'always'],
    'quotes': ['error', 'single'],
    '@typescript-eslint/no-unused-vars': 'error',
    'import/no-nodejs-modules': 0,
    'semi': ['error', 'never'],
    'block-spacing': 'error',
    'key-spacing': 'error',
    'func-call-spacing': 'error',
    'keyword-spacing': 'error',
    'rest-spread-spacing': ['error', 'never'],
    'object-shorthand': ['error', 'always', {
      'avoidQuotes': true
    }],
    'prefer-const': 'error',
    'no-multi-spaces': 'error',
    'array-bracket-spacing': ['error', 'always', {
      'arraysInArrays': false,
      'objectsInArrays': false
    }],
    'brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
    'indent': ['error', 2, { 'ObjectExpression': 1, 'SwitchCase': 1 }],
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    'import/extensions': 0,
    'import/no-cycle': 0,
    // https://github.com/typescript-eslint/typescript-eslint/issues/2540#issuecomment-692866111
    'no-use-before-define': 0,
    'import/no-unresolved': 0,
    'consistent-return': 0,
    'no-redeclare': 0,
    'no-script-url': 0,
    'no-plusplus': 0,
    'no-danger': 0,
    'no-param-reassign': 0,
    'no-restricted-syntax': 0,
    'no-trailing-spaces': 'error',
    'padding-line-between-statements': ['error', {
      blankLine: 'always',
      prev: ['const', 'let', 'var'],
      next: '*'
    }, {
      blankLine: 'any',
      prev: ['const', 'let', 'var'],
      next: ['const', 'let', 'var']
    }, {
      blankLine: 'always',
      prev: '*',
      next: 'return'
    }]
  },
};