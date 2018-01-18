var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var UserSchema = new Schema({
    "name": {
        "type": String,
        "trim": true,
        "minlength": 1
    },
    "avatar": {
        "type": String,
        "trim": true,
        "minlength": 1
    },
    "tagline": {
        "type": String,
        "trim": true
    },
    "username": {
        "type": String
    },
    "email": {
        "type": String,
        "trim": true
    },
    "password": {
        "type": String
    },
    "website": {
        "type": String
    },
    "bio": {
        "type": String
    },
    "gitU": {
        "type": String
    },
    "instaU": {
        "type": String
    },
    "fbU": {
        "type": String
    },
    "twitU": {
        "type": String
    },
    "numberposts": {
        "type": Number,
        default: 0
    },
    "likes": {
        "type": Number,
        default: 0
    },
    "claps": {
        "type": Number,
        default: 0
    },
    "tags": {
        type: Array,
        default: []
    },
    post_id: Array,
    type: String,
    token: String,
    handler: String,
    avatar: String,
    platform_id: String,
    platform: String

});
// methods ======================
/* // generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}; */

//to send the formatted json with limited data


//user delete method
UserSchema.statics.removeToken = function(id, token) {
    var User = this;
    return User.findOneAndUpdate({ _id: id }, { token: null }, { upsert: true }).exec()
        .then(function(user) {
            return Promise.resolve(user);
        }, function(err) {
            return Promise.reject();
        })
};

//User object method
UserSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (e) {
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'token': token,
    });
};

//User object method and get user from email and password
UserSchema.statics.findByCredentials = function(email, password) {
    var User = this;

    return User.findOne({ email: email }).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            // Use bcrypt.compare to compare password and user.password and send back the user
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    });
};
UserSchema.statics.findByFabCredentials = function(email, platform_id) {
    var User = this;

    return User.findOne({ email: email, platform_id: platform_id }).then(function(user) {
        if (!user) {
            return Promise.reject();
        } else {
            return Promise.resolve(user);
        }

    });
};

//this method is called everytime whenever save method is called which save password after hashing
UserSchema.pre('save', function(next) {
    var user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});


UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var token = jwt.sign({ _id: user._id.toHexString(), name: user.name, email: user.email }, process.env.SECRET_KEY).toString();

    user.token = token;

    return user.save().then(function() {
        return token;
    })
}
UserSchema.statics.findEmail = function(email) {
    var User = this;

    return User.findOne({ email: email }).then(function(user) {

        if (!user) {
            return Promise.reject();
        } else {
            return Promise.resolve(user);
        }
    })
}
var users = mongoose.model('users', UserSchema)
module.exports = {
    users: users
}