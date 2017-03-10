module.exports = {
    "globals": {
        "expect": true,
        "describe": true,
        "it": true,
        "beforeEach": true,
        "afterEach": true
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

        "no-var": "error"
    }
};