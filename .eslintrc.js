module.exports = {
    // 继承官方的规则
    extends: [ 'eslint:recommended' ] ,
    env: {
        node: true, // 启用node中的全局变量
        browser: true,
        es2022: true
    },
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module'
    },
    rules: {
        'no-console': 'off',
        'no-unused-vars': 'off',
        'no-var': 'error',
    }
    // "plugins": [
    //     "react"

};
