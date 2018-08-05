const Post = require('../../models/Post');
const User = require('../../models/User');
const Category = require('../../models/Category');
const multer = require('multer');
var fs = require('fs');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
      cb(null, new Date().toISOString() + file.originalname);
    }
  });
  

module.exports = (app) => {
    
    const upload = multer({
        storage: storage,
      });
      

    app.post('/api/newpost', upload.any(), (req, res) => {
        const { currUser } = req.cookies;
        const { 
            title,
            content,
            buyerSeller,
            price,
            categories, 
        } = req.body;
        User.findById(currUser)
        .exec()
        .then((user) => {
            const post = new Post();
            post.album = req.files.map((file) => {
                return {
                    data: fs.readFileSync(file.path).toString('base64'),
                    contentType: file.mimetype,
                }
            });
            post.poster = currUser;
            post.posterUsername = user.username;
            post.posterLastName = user.lastName;
            post.posterFirstName = user.firstName;
            post.title = title;
            post.content = content;
            post.postType = buyerSeller;
            post.price = price;
            post.categories = categories;
            post.save()
            .then((doc) => {
                user.posts.unshift([doc._id]);
                user.save()
                .then((savedUser) => {
                    app.get('connectedClients')
                    .forEach((client) => {
                        const connectedFollowers = savedUser.followers.filter(
                            (follower) => {
                                return follower.equals(client.userId);
                            }
                        );

                        if (connectedFollowers.length === 1) {
                            return client.socket.emit('newPost', {
                                poster: {
                                            username: savedUser.username,
                                            lastName: savedUser.lastName,
                                            firstName: savedUser.firstName,
                                        },
                                postId: doc._id,
                                postType: doc.postType,
                                title: doc.title,
                                price: doc.price,
                                content: doc.content,
                                album: doc.album,
                            });
                        }
                        Category.find({followers: client.userId})
                        .where('name').in(categories)
                        .exec()
                        .then((categories) => {
                            if(categories.length > 0){
                                return client.socket.emit('newPost', {
                                    poster: {
                                                username: savedUser.username,
                                                lastName: savedUser.lastName,
                                                firstName: savedUser.firstName,
                                            },
                                    postId: doc._id,
                                    postType: doc.postType,
                                    title: doc.title,
                                    price: doc.price,
                                    content: doc.content,
                                    album: doc.album,
                                }); 
                            }
                        });
                    });
                });
            });
        });
    });

    app.get('/api/fetchposts/:postnum', (req, res) => {
        const { currUser } = req.cookies;
        let { postnum } = req.params;
        postnum = parseInt(postnum);
        User.findById(currUser)
        .exec()
        .then((user) => {
            Post.find()
            .where('poster')
            .in(user.followedUsers)
            .sort({postDate: 'descending'})
            .exec()
            .then((posts) => {
                if(postnum >= posts.length){
                    return res.send({
                        hasMore: false
                    });
                }
                const chosen = posts[postnum];
                return res.send({
                    postId: chosen._id,
                    poster: {
                        username: chosen.posterUsername,
                        lastName: chosen.posterLastName,
                        firstName: chosen.posterFirstName,
                    },
                    postType: chosen.postType,
                    title: chosen.title,
                    price: chosen.price,
                    content: chosen.content,
                    album: chosen.album,
                    hasMore: true,
                });
            });
        });
    });

    app.post('/api/post/comment', (req, res) => {
        const { currUser } = req.cookies;
        const { comment, postId } = req.body;
        User.findById(currUser)
        .exec()
        .then((user) => {
            Post.findById(postId)
            .exec()
            .then((post) => {
                post.comments.push({
                    comment: comment,
                    username: user.username,
                    lastName: user.lastName,
                    firstName: user.firstName,
                });
                post.save()
                .then((saved) => {
                    res.send({
                        success: true,
                        comments: saved.comments,
                    });
                });
            })
        });
    });

    app.get('/api/:postId/comments', (req, res) => {
        const { postId } = req.params;
        Post.findById(postId)
        .exec()
        .then((post) => {
            res.send({
                comments: post.comments,
            });
        })
    });

    app.get('/api/posts/search/:term/:postnum', (req, res) => {
        let { term, postnum } = req.params;
        postnum = parseInt(postnum);
        Post.find()
        .sort({postDate: 'descending'})
        .exec()
        .then((posts) => {
            const substrPosts = posts.filter((post) => {
                return (post.content.search(term) !== -1) || (post.title.search(term) !== -1)
            })
            if(postnum >= substrPosts.length){
                return res.send({
                    hasMore: false
                });
            }
            return res.send({
                posts: substrPosts.slice(0, postnum + 1).map((chosen) => {
                    return {
                        postId: chosen._id,
                        poster: {
                            username: chosen.posterUsername,
                            lastName: chosen.posterLastName,
                            firstName: chosen.posterFirstName,
                        },
                        postType: chosen.postType,
                        title: chosen.title,
                        price: chosen.price,
                        content: chosen.content,
                        album: chosen.album,
                    }
                }),
                hasMore: true,
            });
        });
    });
};


