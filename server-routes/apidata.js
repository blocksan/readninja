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
            .then(function(result) {
                var body = _.pick(req.body, ["name", "avatar", "tagline", "username", "email", "password", "website", "bio", "gitU", "instaU", "fbU", "twitU", "numberposts", "likes", "claps", "tags"]);
                body.avatar = result.secure_url;
                console.log(body)
                users.findOneAndUpdate({ _id: req.user._id }, body, { upsert: true }).exec()
                    .then(function(user) {
                        res.status(200).send({ msg: 'author updated ' });
                    }).catch(function(err) {
                        res.status(400).send({ err: 'error in updating author' });
                    })
            }).catch(function(err) {
                res.status(400).send({ err: 'error in updating author' });
            })
        ]);
    } else {
        var body = _.pick(req.body, ["name", "tagline", "username", "email", "password", "website", "bio", "gitU", "instaU", "fbU", "twitU", "numberposts", "likes", "claps", "tags"]);

        users.findOneAndUpdate({ _id: req.user._id }, body, { upsert: true }).exec()
            .then(function(user) {
                res.status(200).send({ msg: 'author updated ' });
            }).catch(function(err) {
                res.status(400).send({ err: 'error in updating author' });
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
            .then(function(result) {
                console.log(result);
                var body = _.pick(req.body, ["heading", "body", "alias", "tags", "difficulty", "likes", "shares", "views", "claps", "type", "readtime", "dateadded", "status", "author", "comments"]);
                body.user = req.user._id;
                body.banner = result.secure_url;
                var post = new posts(body);
                post.save().then(function(post) {
                    users.findOneAndUpdate({ _id: req.user._id }, { $push: { post_id: post._id } }).exec().then(function() {
                        res.status(200).send({ msg: 'post created ', post: post });
                    }, function(err) {
                        res.status(400).send({ err: 'error in creating post' });
                    });
                }, function(err) {
                    console.log(err);
                    res.status(400).send({ err: err });
                });
            }).catch(function(err) {
                res.status(400).send({ err: 'error in uploading image' });
            })
        ])
    } else {
        var body = _.pick(req.body, ["heading", "body", "alias", "tags", "difficulty", "likes", "shares", "views", "claps", "type", "readtime", "dateadded", "status", "author", "comments"]);
        body.user = req.user._id;
        var post = new posts(body);
        post.save().then(function(post) {
            users.findOneAndUpdate({ _id: req.user._id }, { $push: { post_id: post._id } }).exec().then(function() {
                res.status(200).send({ msg: 'post created ', post: post });
            }, function(err) {
                res.status(400).send({ err: 'error in creating post' });
            });
        }, function(err) {
            console.log(err);
            res.status(400).send({ err: err });
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
    ]).exec(function(err, user) {
        if (err) res.send({ err: 'error in fetching authors with posts' });

        res.send(user);
    })

});
router.get('/allPost', function(req, res) {
    posts.find({ 'type': req.query.param }).sort({ "dateadded": -1 }).populate({ path: 'author', select: 'username avatar', }).exec(function(err, posts) {
        if (err) res.send({ err: 'error in fetching posts' });
        res.status(200).send(posts);
    });

});
router.get('/allAuthor', function(req, res) {
    mongoose.models.users.aggregate([{
        $lookup: {
            "from": "posts",
            "localField": "_id",
            "foreignField": "user",
            "as": "posts"
        }
    }]).exec(function(err, users) {
        if (err) res.send({ err: 'error in fetching authors with posts' });
        res.status(200).send(users);
    })

});
router.get('/getAuthorInfo', authenticate, function(req, res) {

    users.findOne({ '_id': req.user._id }).then(function(user) {
        res.status(200).send(user);
    }, function(err) {
        res.status(400).send({ err: 'error in fetching author' });
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
    ]).exec(function(err, user) {
        if (err) res.send({ err: 'error in fetching authors with posts' });

        res.send(user);
    })

});
router.get('/getPost', function(req, res) {
    console.log(typeof req.query.param)
        //mongoose.Types.ObjectId(req.query.param) to query using _id
    posts.find({ 'alias': req.query.param }).populate({ path: 'user', select: 'username avatar', }).exec(function(err, post) {
        if (err) res.send({ err: 'error in fetching posts' });
        res.status(200).send(post);
    });

});
router.delete('/deletePost', authenticate, function(req, res) {
    //mongoose.Types.ObjectId(req.query.param) to query using _id
    posts.remove({ _id: mongoose.Types.ObjectId(req.query.param) }, function(err, post) {
        if (post) {
            users.update({ _id: mongoose.Types.ObjectId(req.user._id) }, { $pull: { post_id: mongoose.Types.ObjectId(req.query.param) } }).then(function(success) {
                res.status(200).send({ msg: 'post removed ' });
            }, function(error) {
                res.status(400).send({ msg: 'error in removing ' });
            })
        } else
            res.status(400).send({ msg: 'error in removing ' });
    })

});
router.get('/filterpost', function(req, res) {
    console.log(req.query.param)
    posts.find({ '_id': mongoose.Types.ObjectId(req.query.param) }).populate({ path: 'user', select: 'username avatar', }).exec(function(err, posts) {
        if (err) res.send({ err: 'error in fetching posts' });
        res.status(200).send(posts);
    });

});
router.post('/filterkeys', function(req, res) {
    console.log(req.body.param, '------------')
    var body = _.pick(req.body.param, ["tags", "category", "difficulty", "readtime"]);
    //console.log(body)
    var filter = new filters(body);
    filter.save().then(function(filter) {
        res.status(200).send(filter);
    }, function(err) {
        res.status(400).send({ err: 'error in creating author' });
    });
});
router.get('/getfilterkeys', function(req, res) {

    filters.find().then(function(filter) {
        res.status(200).send(filter);
    }, function(err) {
        res.status(400).send({ err: 'error in creating author' });
    });

});
router.get('/newpost', authenticate, function(req, res, next) {

    res.render('templates/create-post');
});
router.post('/savePostContentImg', upload.any(), function(req, res, next) {

    Promise.all([cloudinary.uploader.upload(req.files[0].path, { crop: "fill", width: 1100, height: 100 }).then(function(result) {
        console.log(result)
        res.status(200).send(result.secure_url);
    }).catch(function(err) {
        res.status(400).send({ err: 'error in uploading image' });
    })])
})
module.exports = { router: router };