const User = require('../../models/User');
const UserSession = require('../../models/UserSession');


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
};


