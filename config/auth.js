// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth': {
        'clientID': '416566402096570', // your App ID
        'clientSecret': '6ec52c2ed456719a611ea78171bf4000', // your App Secret
        'callbackURL': 'http://localhost:8080/auth/facebook/callback',
        'profileURL': 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields': ['email'],
        enableProof: true // For requesting permissions from Facebook API
    },


    'twitterAuth': {
        'consumerKey': 'M5q36jY2QAGbYbv7UYksu71PP',
        'consumerSecret': 'wvHBOQY9BO8yswmmGwqnYVx9lOKtaBBrSmHflaYwigAMildGEC',
        'callbackURL': 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth': {
        'clientID': '221548593476-0nlaqr0m19gj5jokujmnflnighjjj44d.apps.googleusercontent.com',
        'clientSecret': 'PMGdmEtCsJOxnnnNwYKH0LD_',
        'callbackURL': 'http://localhost:8080/auth/google/callback'
    },
    'github': {
        'clientID': '05f7d543cad1882063aa',
        'clientSecret': '266c930ec71b92fdc95329bc1335ce44868cf8ad',

        'callbackURL': 'http://localhost:8080/auth/github/callback'
    }

};