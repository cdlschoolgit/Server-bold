module.exports = {
  env: {
    node: true, // Indicate that your code is running in a Node.js environment

    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: 'eslint:recommended',
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    // 'no-underscore-dangle': ['error', { allow: ['__dirname'] }],
    'no-underscore-dangle': 'off',
    'no-unused-vars': 'off',
  },
};
