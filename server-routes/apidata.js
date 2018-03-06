var express = require('express');;
var router = express.Router();
var _ = require('lodash');
var multer = require('multer');

var mongoose = require('./../app/db/db-connection').mongoose;

var users = require('./../app/models/users').users;
var filters = require('./../app/models/filters').filters;
var likes = require('./../app/models/likes').likes;
var posts = require('./../app/models/posts').posts;

var cloudinary = require('cloudinary');
var authenticate = require('./../app/middleware/authenticate').authenticate;

var upload = multer({ dest: 'uploads/' });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

router.get('/dashboard-author', authenticate, function(req, res, next) {
    res.render('templates/dashboard-author');
});
router.post('/updateAuthor', authenticate, upload.any(), function(req, res) {
    // console.log(req.body.param)
    console.log(req.files)
    if (req.files.length) {
        Promise.all([cloudinary.uploader.upload(req.files[0].path, { crop: "fill", width: 100, height: 100 })
            .then(result => {
                var body = _.pick(req.body, ["name", "avatar", "tagline", "username", "email", "password", "website", "bio", "gitU", "instaU", "fbU", "twitU", "likes", "claps", "tags"]);
                body.avatar = result.secure_url;
                body.avatar_id = result.public_id;
                console.log(body)
                users.findOneAndUpdate({ _id: req.user._id }, body, { upsert: true }).exec()
                    .then(user => {
                        res.status(200).json({ msg: 'author updated ' });
                    }).catch(function(err) {
                        res.status(500).json({ error: err });
                    })
            }).catch(err => {
                res.status(500).send({ err: err });
            })
        ]);
    } else {
        var body = _.pick(req.body, ["name", "tagline", "username", "email", "password", "website", "bio", "gitU", "instaU", "fbU", "twitU", "likes", "claps", "tags"]);

        users.findOneAndUpdate({ _id: req.user._id }, body, { upsert: true }).exec()
            .then(user => {
                res.status(200).json({ msg: 'author updated ' });
            }).catch(err => {
                res.status(500).json({ error: err });
            })
    }



    //user.save().then(function(author) {
    // res.status(200).send({ msg: 'author created ' });
    //}, function(err) {
    //res.status(400).send({ err: 'error in creating author' });
    //});
});
router.post('/createpost', authenticate, upload.any(), function(req, res) {
    //console.log(req.user._id, req.files, '---------')

    if (req.files.length) {
        Promise.all([cloudinary.uploader.upload(req.files[0].path, { crop: "fill", width: 1100, height: 100 })
            .then(result => {
                console.log(result);
                var body = _.pick(req.body, ["heading", "body", "alias", "tags", "difficulty", "likes", "shares", "views", "claps", "type", "readtime", "dateadded", "status", "author", "comments"]);
                body.user = req.user._id;
                body.banner = result.secure_url;
                body.banner_id = result.public_id;
                var post = new posts(body);
                post.save().then(post => {
                        users.findOneAndUpdate({ _id: req.user._id }, { $push: { post_id: post._id } })
                            .exec()
                            .then(function() {
                                res.status(200).json(post);
                            }).catch(err => {
                                res.status(500).json({ error: err });
                            });
                    })
                    .then(function() {
                        res.status(200).json(post);
                    }).catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
            }).catch(function(err) {
                res.status(400).send({ err: 'error in uploading image' });
            })
        ])
    } else {
        var body = _.pick(req.body, ["heading", "body", "alias", "tags", "difficulty", "likes", "shares", "views", "claps", "type", "readtime", "dateadded", "status", "author", "comments"]);
        body.user = req.user._id;
        var post = new posts(body);
        post.save().
        then(post => {
            users.findOneAndUpdate({ _id: req.user._id }, { $push: { post_id: post._id } })
                .exec()
                .then(() => {
                    res.status(200).json(post);
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    });
                });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    }
});
router.get('/authorPostsAll', authenticate, function(req, res) {
    mongoose.models.users.aggregate([{
                $match: { _id: mongoose.Types.ObjectId(req.user._id) }
            },
            {
                $lookup: {
                    "from": "posts",
                    "localField": "_id",
                    "foreignField": "user",
                    "as": "posts"
                }
            }
        ]).exec()
        .then(user => {
            res.status(200).json(user)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })

});
router.get('/allPost', function(req, res) {
    if (req.query.param == 'all') {
        posts.find()
            .select("alias views claps dateadded readtime heading difficulty banner_id user _id")
            .sort({ "dateadded": -1 })
            .limit(12)
            .populate({ path: 'user', select: 'username avatar', })
            .exec()
            .then(posts => {
                res.status(200).json(posts);
            }).catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                })
            });
    } else {
        posts.find({ 'type': req.query.param })
            .select("alias views dateadded heading readtime banner_id user _id")
            .sort({ "dateadded": -1 })
            .populate({ path: 'user', select: 'username avatar', })
            .exec()
            .then(posts => {
                res.status(200).json(posts);
            }).catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                })
            });
    }
});
router.get('/trendingPost', function(req, res) {

    // posts.find({ "type": "tutorial" }, { "alias": 1, "likes": 1, "readtime": 1, "claps": 1, "dateadded": 1, "heading": 1, "difficulty": 1, "banner_id": 1, "user": 1, _id: 0 }).sort({ "likes": -1, "claps": -1 }).limit(3).populate({ path: 'user', select: 'username avatar', }).exec(function(err, posts) {
    posts.find()
        .select("alias views readtime claps dateadded heading difficulty banner_id user _id")
        .sort({ "likes": -1, "claps": -1 })
        .limit(3)
        .populate({ path: 'user', select: 'username avatar', })
        .exec()
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

router.get('/allPostName', function(req, res) {
    posts.find()
        .select("alias heading _id")
        .exec()
        .then(posts => {
            res.status(200).json(posts);
        }).catch(err => {
            res.status(500).json({
                error: err
            })
        })
});


router.get('/allAuthor', function(req, res) {
    mongoose.models.users.aggregate([{
            $lookup: {
                "from": "posts",
                "localField": "_id",
                "foreignField": "user",
                "as": "posts"
            }
        }])
        .exec()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })

});
router.get('/getAuthorInfo', authenticate, function(req, res) {

    users.findOne({ '_id': req.user._id })
        .exec()
        .then(user => {
            res.status(200).json(user);
        }).catch(err => {
            console.log(err)
            res.status(500).json({ error: err });
        });
    /* authors.findOne({}).then(function(filter) {
        res.status(200).send(filter);
    }, function(err) {
        res.status(400).send({ err: 'error in creating author' });
    }); */

});

//all data of author with its linked posts
router.get('/getAuthorPost', function(req, res) {
    console.log(req.query.param)

    mongoose.models.users.aggregate([{
                $match: { _id: mongoose.Types.ObjectId(req.query.param) }
            },
            {
                $lookup: {
                    "from": "posts",
                    "localField": "_id",
                    "foreignField": "user",
                    "as": "posts"
                }
            }
        ])
        .exec()
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });

});
router.get('/getPost', function(req, res) {
    //mongoose.Types.ObjectId(req.query.param) to query using _id
    posts.find({ 'alias': req.query.param })
        .populate({ path: 'user', select: 'username avatar post_id likes', })
        .exec()
        .then(post => {
            res.status(200).send(post);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });

});
router.delete('/deletePost', authenticate, function(req, res) {
    //mongoose.Types.ObjectId(req.query.param) to query using _id
    posts.remove({ _id: mongoose.Types.ObjectId(req.query.param) })
        .exec()
        .then(post => {
            if (post) {
                return users.update({ _id: mongoose.Types.ObjectId(req.user._id) }, { $pull: { post_id: mongoose.Types.ObjectId(req.query.param) } })
            }
        })
        .then(success => {
            res.status(200).json({ msg: 'post removed ' });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })

});
router.post('/viewPost', authenticate, function(req, res) {
    //mongoose.Types.ObjectId(req.query.param) to query using _id

    posts.findOneAndUpdate({ 'alias': req.body.param }, { $inc: { views: 1 } }, { new: true, upsert: false })
        .then(post => {

            if (post) {
                //change likes to views later
                return users.findOneAndUpdate({ _id: mongoose.Types.ObjectId(post.user) }, { $inc: { likes: 1 } }, { new: true, upsert: false });
            }
        })
        .then(() => {
            res.status(200).json({ msg: 'post viewed' });
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            });
        })

});
router.post('/clapPost', authenticate, function(req, res) {
    //mongoose.Types.ObjectId(req.query.param) to query using _id
    let data;
    posts.findOneAndUpdate({ 'alias': req.body.param }, { $inc: { claps: 1 } }, { new: true, upsert: false })
        .exec()
        .then(post => {
            if (post) {
                data = post
                return users.findOneAndUpdate({ _id: mongoose.Types.ObjectId(post.user) }, { $inc: { claps: 1 } }, { new: true, upsert: false })
            }
        })
        .then(user => {
            res.status(200).json({ claps: data.claps });
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err });
        })

});
router.get('/filterpost', function(req, res) {
    posts.find({ '_id': mongoose.Types.ObjectId(req.query.param) })
        .populate({ path: 'user', select: 'username avatar', })
        .exec()
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })

});
router.post('/filterkeys', function(req, res) {
    console.log(req.body.param, '------------')
    var body = _.pick(req.body.param, ["tags", "category", "difficulty", "readtime"]);
    //console.log(body)
    var filter = new filters(body);
    filter.save()
        .then(filter => {
            res.status(200).json(filter);
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
});
router.get('/getfilterkeys', function(req, res) {

    filters.find()
        .then(filter => res.status(200).json(filter))
        .catch(err => res.status(400).json({ error: err }));

});
router.get('/newpost', authenticate, (req, res, next) => {
    res.render('templates/create-post');
});
router.post('/savePostContentImg', upload.any(), (req, res, next) => {

    Promise.all([cloudinary.uploader.upload(req.files[0].path, { crop: "fill", width: 1100, height: 100 })
        .then(result => {
            res.status(200).send(result.secure_url);
        }).catch(function(err) {
            res.status(500).json({
                error: err
            });
        })
    ])
})
module.exports = { router: router };