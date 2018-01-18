module.exports = function(router, passport) {

    router.get('/auth/dashboard-author', isLoggedIn, function(req, res, next) {
        res.render('templates/dashboard-author');
    });
    router.get('/auth/facebook', passport.authenticate('facebook', {
        scope: ['email', 'public_profile', ]
    }));
    router.get('/jsonCredentials', isLoggedIn, function(req, res, next) {

        res.json({ logged: "true", email: req.user.email, id: req.user._id, handler: req.user.handler ? req.user.handler : "" })
    });
    router.get('/resetHeader', function(req, res, next) {
        res.json({ "logged": "false" })
    });

    // handle the callback after facebook has authenticated the user
    router.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));
    // route for twitter authentication and login
    router.get('/auth/twitter', passport.authenticate('twitter'));

    // handle the callback after twitter has authenticated the user
    router.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect: '/auth/profile',
            failureRedirect: '/'
        }));

    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails

    router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    // the callback after google has authenticated the user
    router.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/jsonCredentials',
            failureRedirect: '/'
        }));

    // =====================================
    // LOGOUT ==============================
    // =====================================
    router.get('/auth/logout', function(req, res) {

        req.logout();
        res.json({ 'message': 'logout' })
    });

    router.post('/auth/signup', passport.authenticate('local-signup', {
        successRedirect: '/auth/profile', // redirect to the secure profile section
        failureRedirect: '/', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    router.get('/auth/github',
        passport.authenticate('github'));

    router.get('/auth/github/callback',
        passport.authenticate('github', {
            successRedirect: '/auth/profile',
            failureRedirect: '/'
        }));
    router.post('/auth/login', passport.authenticate('local-login', {
        successRedirect: '/auth/profile', // redirect to the secure profile section
        failureRedirect: '/', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    function isLoggedIn(req, res, next) {
        console.log('-----------not logged in')
            // if user is authenticated in the session, carry on 
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        res.redirect('/resetHeader');
    }


}