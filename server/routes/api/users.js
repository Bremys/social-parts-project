const User = require('../../models/User');
const Post = require('../../models/Post');
const Category = require('../../models/Category');


module.exports = (app) => {
    app.get('/api/users/:username', (req, res, next) => {
        const {currUser} = req.cookies;
        User.find({username: req.params.username})
            .exec()
            .then((users) => {
                console.log(users);
                if(users.length === 0){
                    return res.send({
                        found: false
                    });
                }
                console.log("Curr User: ", currUser);
                console.log("Followers: ", users[0].followers);
                console.log("Includes: ", users[0].followers
                                                  .filter((user) => user.equals(currUser)).length > 0);
                res.send({
                    found: true,
                    firstName: users[0].firstName,
                    lastName: users[0].lastName,
                    following: users[0].followers
                               .filter((user) => user.equals(currUser)).length > 0,
                });
            })
            .catch((err) => next(err));
    });


    app.get('/api/users/:username/posts/:postnum', (req, res, next) => {
        const {username, postnum} = req.params;
        console.log(req.params);
        User.findOne({username: username})
            .exec()
            .then((user) => {
                Post.find()
                .where('_id').in(user.posts)
                .sort({postDate: 'descending'})
                .limit(postnum + 1)
                .exec()
                .then((posts) => {
                    if(postnum >= posts.length){
                        return res.send({
                            hasMore: false
                        });
                    }
                    return res.send({
                        posts: posts.map((chosen) => {
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
            })
            .catch((err) => next(err));
    });


    app.post('/api/users/:username/follow', (req, res, next) => {
        const { currUser } = req.cookies;
        const { username } = req.params;
        User.findById(currUser)
        .exec()
        .then((follower) => {
            User.findOne({username: username})
            .exec()
            .then((followed) => {
                follower.followedUsers.push(followed._id);
                followed.followers.push(follower._id);

                follower.save()
                .then(() => {
                    followed.save()
                    .then(() => {
                        res.send({
                            following: true
                        });
                    })
                    .catch((err) => next(err));
                })
                .catch((err) => next(err));
            })
            .catch((err) => next(err));
        })
        .catch((err) => next(err));
    });

    app.post('/api/users/:username/unfollow', (req, res, next) => {
        const { currUser } = req.cookies;
        const { username } = req.params;
        User.findById(currUser)
        .exec()
        .then((follower) => {
            User.findOne({username: username})
            .exec()
            .then((followed) => {
                console.log("follower before: ", follower.followedUsers);
                console.log("followed before: ", followed.followers);
                
                follower.followedUsers = follower.followedUsers
                                                 .filter((user) => !user.equals(followed._id));
                                                 
                followed.followers = followed.followers
                                             .filter((user) => !user.equals(follower._id));
                console.log("follower after: ", follower.followedUsers);
                console.log("followed after: ", followed.followers);
                follower.save()
                .then(() => {
                    followed.save()
                    .then(() => {
                        res.send({
                            following: false
                        });
                    })
                    .catch((err) => next(err));
                })
                .catch((err) => next(err));
            })
            .catch((err) => next(err));
        })
        .catch((err) => next(err));
    });

    app.post('/api/users/contactsupdate', (req, res) => {
        const {
            sellerName,
            openingHours,
            sellerEmail,
            phoneNumber,
            sellerDesc,
            location,
            categories,
        } = req.body;

        const { currUser } = req.cookies;
        User.findById(currUser)
        .exec()
        .then((user) => {
            user.sellerName = sellerName;
            user.openingHours = openingHours;
            user.sellerEmail = sellerEmail;
            user.phoneNumber = phoneNumber;
            user.sellerDesc = sellerDesc;
            user.location = location;
            user.save()
            .then((savedUser) => {
                Category.find()
                .exec()
                .then((allDocs) => {
                    const names = allDocs.map(doc => doc.name);
                    categories.forEach((category) => {
                        if(names.includes(category)) {
                            allDocs[names.indexOf(category)].followers.push(savedUser._id);
                            allDocs[names.indexOf(category)].save();
                        }
                        else {
                            const newCategory = new Category();
                            newCategory.name = category;
                            newCategory.followers = [savedUser._id]
                            newCategory.save();
                        }
                    });
                    res.send({
                        success: true,
                    })
                })
            });
        });
    });
};


