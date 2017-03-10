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
        "node": true
    },

    "extends": "eslint:recommended",

    "rules": {
        "indent": [
            "error",
            "4"
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

        "no-console": "off",
        "no-var": "error"
    }
};