
module.exports = {
    root: true,
    env: {
        browser: true,
        es6: true,
        node: true
    },
    extends: [
        'plugin:vue/vue3-essential',
        '@vue/standard'
    ],
    parserOptions: {
        parser: '@babel/eslint-parser'
    },
    rules: {
        'vue/html-indent': ['error', 4, {
            attribute: 1,
            closeBracket: 0,
            switchCase: 0,
            ignores: []
        }],
        'vue/max-attributes-per-line': [
            2,
            {
                singleline: 10,
                multiline: 1
            }
        ],
        'vue/first-attribute-linebreak': [
            2,
            {
                singleline: 'ignore',
                multiline: 'below'
            }
        ],
        indent: ['error', 4],
        'vue/component-name-in-template-casing': ['error', 'kebab-case'],
        'vue/script-indent': [
            'error',
            4,
            { baseIndent: 1 }
        ],
        'space-before-function-paren': ['error', 'never'],
        semi: [2, 'never'],
        'vue/singleline-html-element-content-newline': 'off',
        'vue/multiline-html-element-content-newline': 'off',
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
    },
    overrides: [
        {
            files: ['*.vue'],
            rules: {
                indent: 'off'
            }
        }
    ]
}
