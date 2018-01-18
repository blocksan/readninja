var express = require('express');
var _ = require('lodash');
var router = express.Router();
var mongoose = require('./../app/db/db-connection').mongoose;
var User = require('./../app/models/users').users;
var authenticate = require('./../app/middleware/authenticate').authenticate;
//var helper = require('sendgrid').mail;

function register(req, res) {
    var body = _.pick(req.body, ['email', 'name', 'avatar', 'platform', 'platform_id', 'password', 'type']);

    var user = new User(body);
    user.save().then(function(user) {

        //sendConfirmMail(body.name, body.last_name, body.email)
        return user.generateAuthToken();

    }).then(function(token) {
        //send the token to the header which will always be use to verify

        res.header('x-auth', token).json({ user: user, token: token });
    }).catch(function(err) {
        console.log(err);
        if (err.name === 'ValidationError')
            res.status(400).send({ 'errorname': err.name, 'message': 'name must be filled' })
        else if (err.name == 'MongoError' && err.code == 11000)
            res.status(400).send({ 'errorname': err.name, 'message': err.errmsg, 'code': err.code })
    });

}

/* function sendConfirmMail(name, last_name, email) {
    var fromEmail = new helper.Email('admin@bangg.in');
    var toEmail = new helper.Email(email);
    var subject = 'Welcome to Bangg.in';
    var content = new helper.Content('text/html', 'Hi <b> ' + name + ' ' + last_name + '</b>,<br>Welcome to the best online platform for designers where you can find best designs.<br><br>Thanks,<br>Team bangg');
    var mail = new helper.Mail(fromEmail, subject, toEmail, content);
    var sg = require('sendgrid')('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');
    var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
    });

    sg.API(request, function(error, response) {
        if (error) {
            console.log('Error response received');
        }
        console.log(response);
    });

} */

router.post('/register', function(req, res) {
    var body = _.pick(req.body, ['email']);
    User.findEmail(body.email).then(function(user) {
        res.status(400).send({ 'message': 'Email already exists' })
    }).catch(function(e) {
        register(req, res);
    });
});
router.post('/login', function(req, res) {
    if (req.body.platform == "facebook") {
        var body = _.pick(req.body, ['email', 'platform_id']);
        User.findByFabCredentials(body.email, body.platform_id).then(function(user) {
            return user.generateAuthToken().then(function(token) {
                res.header('x-auth', token).json({ user: user, token: token });
            });
        }).catch(function(e) {
            register(req, res);
        });
    } else if (req.body.platform == "google") {
        var body = _.pick(req.body, ['email', 'platform_id']);
        User.findByFabCredentials(body.email, body.platform_id).then(function(user) {
            return user.generateAuthToken().then(function(token) {
                res.header('x-auth', token).json({ user: user, token: token });
            });
        }).catch(function(e) {
            register(req, res);
        });
    } else {
        var body = _.pick(req.body, ['email', 'password']);
        User.findByCredentials(body.email, body.password).then((user) => {
            return user.generateAuthToken().then(function(token) {
                res.header('x-auth', token).json({ user: user, token: token });
            });
        }).catch(function() {
            res.status(400).send({ "err": "username or password incorrect" });
        });
    }
});
router.delete('/logout', authenticate, function(req, res) {
    User.removeToken(req.user._id, req.token).then(function(response) {
        res.status(200).send();
    }).catch(function(e) {
        res.status(401).send();
    });
});

//authenticate based on the token set by header
router.get('/me', authenticate, function(req, res) {
    res.send(req.user);
});

//add cart item
/* router.post('/addCart', authenticate, function(req, res) {
    console.log(req.body.pdata)
    var body = _.pick(req.body.pdata, ["product", "product_size", "product_color", "product_quantity", "date_added", "product_status"])
    body.user = req.user._id;
    Cart.findOneAndUpdate({ "user": body.user, "product": body.product, "product_size": body.product_size }, { $inc: { "product_quantity": body.product_quantity } }, function(err, cartitems) {
        console.log(cartitems)
        if (cartitems)
            res.status(200).send({ msg: 'quantity updated' });
        else {
            var cart = new Cart(body);
            cart.save().then(function(cart) {
                res.status(200).send({ msg: 'item added to cart' });
            }, function(err) {
                res.status(400).send({ err: 'error in saving to cart' });
            });
        }
    }, function(err) {

    });

}); */

//get cart item
/* router.post('/getCart', authenticate, function(req, res) {
    Cart.find({ "user": req.user._id }, function(err, cartitems) {
        Cart.populate(cartitems, { path: 'product' }, function(err, cartitems) {
            res.send(cartitems);
        });
    })
}); */

//count cart item
/* router.post('/countCart', authenticate, function(req, res) {
    Cart.find({ "user": req.user._id }, function(err, cartitems) {

        res.send({ "count": cartitems.length });
    })
}); */

/* router.post('/incCart', authenticate, function(req, res) {
    Cart.findOneAndUpdate({ "_id": req.body.cart_id, "user": req.user._id }, { $inc: { "product_quantity": 1 } }, function(err, cartitems) {

        res.send({ "count": cartitems.length });
    }, function(err) {

    })
}); */

/* router.post('/deleteCartItem', authenticate, function(req, res) {
    Cart.findOneAndRemove({ "_id": req.body.cart_id, "user": req.user._id }, function(err, cartitems) {
        res.send({ "count": cartitems.length });
    }, function(err) {

    })
}); */


//add address of user
/* router.post('/saveAddress', authenticate, function(req, res) {
    var body = _.pick(req.body.address, ["name", "mobile", "address", "city", "state", "country", "pincode"]);
    var user = req.user;
    body.user = user._id;
    body.email = user.email;
    var address = new Address(body);
    address.save().then(function(address) {
        res.status(200).send({ msg: 'address created ' });
    }, function(err) {
        res.status(400).send({ err: 'error in saving address' });
    });
}); */




module.exports = { router: router };