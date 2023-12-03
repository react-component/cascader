module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  rules: {
    'no-template-curly-in-string': 0,
    'prefer-promise-reject-errors': 0,
    'react/no-array-index-key': 0,
    'react/sort-comp': 0,
    '@typescript-eslint/no-explicit-any': 0,
    'jsx-a11y/label-has-associated-control': 0,
    'jsx-a11y/label-has-for': 0,
    'import/no-extraneous-dependencies': 0,
    'no-shadow': 0
  },
};
