import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'

export default [
    {
        languageOptions: { globals: globals.node },
        rules: {
            quotes: ['error', 'single'],
            'object-curly-spacing': ['error', 'always'],
            semi: ['error', 'never'],
            indent: ['error', 4],
        },
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
]
