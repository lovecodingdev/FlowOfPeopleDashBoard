module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended',
    'plugin:prettier/recommended',
    'prettier',
    'eslint-config-prettier'
  ],
  plugins: ['vue'],
  // add your custom rules here
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    // console.log, console.infoはwarn
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    // 不要なカッコは消す
    'no-extra-parens': 1,
    // 無駄なスペースは削除
    'no-multi-spaces': 2,
    // 不要な空白行は削除。2行開けてたらエラー
    'no-multiple-empty-lines': [2, { max: 1 }],
    // 関数とカッコはあけない(function hoge() {/** */})
    'func-call-spacing': [2, 'never'],
    // true/falseを無駄に使うな
    'no-unneeded-ternary': 2,
    // セミコロンは禁止
    semi: [2, 'never'],
    // varは禁止
    'no-var': 2,
    // jsのインデントは２
    indent: [2, 2, { SwitchCase: 1 }],
    // かっこの中はスペースなし！違和感
    'space-in-parens': [2, 'never'],
    // カンマの前後にスペース入れる？
    'comma-spacing': [2, { before: false, after: true }],
    // 配列のindexには空白入れるな(hogehoge[ x ])
    'computed-property-spacing': 2,
    // キー
    'key-spacing': 2,
    // キーワードの前後には適切なスペースを
    'keyword-spacing': 2,
    'no-useless-constructor': 0,
    'prefer-const': 'off',
    // error-first callback pattern に従うつもりはないのでoff
    // https://github.com/mysticatea/eslint-plugin-node/blob/master/docs/rules/no-callback-literal.md
    'node/no-callback-literal': 'off'
  }
}
