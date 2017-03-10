module.exports = {
    "globals": {
        "expect": true,
        "describe": true,
        "it": true,
        "beforeEach": true,
        "afterEach": true,
        "createDom": true,
        "destroyDom": true,
        "mockRaf": true
    },

    "env": {
        "es6": true,
        "commonjs": true,
        "browser": true
    },

    "extends": "eslint:recommended",

    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        }
    },

    "plugins": ["react"],

    "rules": {

        "indent": [
            "error",
            4
        ],

        "linebreak-style": [
            "error",
            "unix"
        ],

        "quotes": [
            "error",
            "single"
        ],

        "semi": [
            "error",
            "always"
        ],

        "no-var": "error",
        "react/jsx-uses-vars": 2
    }
};