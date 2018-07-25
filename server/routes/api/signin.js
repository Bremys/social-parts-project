const User = require('../../models/User');
const UserSession = require('../../models/UserSession');


module.exports = (app) => {

  app.post('/api/account/signout', (req, res, next) => {
    let {sessionId} = req.cookies;
        if (sessionId === undefined) {
            return res.send({ success: false});
        }
        UserSession.find({_id: sessionId, isDeleted: false},(err, sessions) => {
            res.clearCookie('sessionId');
            res.clearCookie('currUser');
            if (err){
            return res.send({ success: false});
            }
            if (sessions.length != 1){
            return res.send({ success: false});
            }

            UserSession.deleteOne({_id: sessionId})
            .then(() => {
              return res.send({ success: true});
            });
            
        });
      });

        app.post('/api/account/signin', (req, res, next) => {
        const { body } = req;
        let {username, password} = body;
    
        if (!username) {
          return res.send({
            success: false,
            message: 'Error: Username cannot be blank.'
          });
        }
        if (!password) {
          return res.send({
            success: false,
            message: 'Error: Password cannot be blank.'
          });
        }
        
        username = username.toLowerCase();
        username = username.trim();

        console.log(username);

        User.find({
          username: username
        }, (err, users) => {

          console.log(users);
          
          if (err) {
            console.log('err 2:', err);
            return res.send({
              success: false,
              message: 'Error: server error'
            });
          }
          if (users.length != 1) {
            return res.send({
              success: false,
              message: 'Error: Invalid'
            });
          }
    
          const user = users[0];
          if (!user.validPassword(password)) {
            return res.send({
              success: false,
              message: 'Error: Invalid'
            });
          }
    
          // Otherwise correct user
          const userSession = new UserSession();
          userSession.userId = user._id;
          userSession.save((err, doc) => {
            if (err) {
              console.log(err);
              return res.send({
                success: false,
                message: 'Error: server error'
              });
            }
            
            res.cookie('sessionId', doc._id);
            res.cookie('currUser', doc.userId);
            return res.send({
              success: true,
              message: 'Valid sign in',
            });
          });
        });
      });

    app.post('/api/account/signin', (req, res, next) => {
        const { body } = req;
        let {username, password} = body;
    
        if (!username) {
          return res.send({
            success: false,
            message: 'Error: Username cannot be blank.'
          });
        }
        if (!password) {
          return res.send({
            success: false,
            message: 'Error: Password cannot be blank.'
          });
        }
        
        username = username.toLowerCase();
        username = username.trim();

        console.log(username);

        User.find({
          username: username
        }, (err, users) => {

          console.log(users);
          
          if (err) {
            console.log('err 2:', err);
            return res.send({
              success: false,
              message: 'Error: server error'
            });
          }
          if (users.length != 1) {
            return res.send({
              success: false,
              message: 'Error: Invalid'
            });
          }
    
          const user = users[0];
          if (!user.validPassword(password)) {
            return res.send({
              success: false,
              message: 'Error: Invalid'
            });
          }
    
          // Otherwise correct user
          const userSession = new UserSession();
          userSession.userId = user._id;
          userSession.save((err, doc) => {
            if (err) {
              console.log(err);
              return res.send({
                success: false,
                message: 'Error: server error'
              });
            }
            
            res.cookie('sessionId', doc._id);
            return res.send({
              success: true,
              message: 'Valid sign in',
            });
          });
        });
      });
  
  
  
    app.post('/api/account/signup', (req, res) => {
    const body = req.body
    let {
        username, 
        firstName, 
        lastName, 
        email, 
        password, 
        confirmedPassword
    } = body;
    
    if (!username) {
        return res.send({
          success: false,
          message: 'Error: Username cannot be blank.'
        });
    }
    if (!firstName) {
        return res.send({
          success: false,
          message: 'Error: First Name cannot be blank.'
        });
    }
    if (!lastName) {
        return res.send({
          success: false,
          message: 'Error: Last Name cannot be blank.'
        });
    }
    if (!email) {
      return res.send({
        success: false,
        message: 'Error: Email cannot be blank.'
      });
    }
    if (!password) {
      return res.send({
        success: false,
        message: 'Error: Password cannot be blank.'
      });
    }
    if (!confirmedPassword) {
        return res.send({
          success: false,
          message: 'Error: Confirmed Password cannot be blank.'
        });
    }
    if (password != confirmedPassword){
        return res.send({
            success: false,
            message: 'Error: Passwords don\'t match.'
          });
    }

    email = email.toLowerCase();
    email = email.trim();
    username = username.toLowerCase();
    username = username.trim();

    // Steps:
    // 1. Verify email doesn't exist
    // 2. Save

    User.find().or([{ username: username }, 
                    {email: email}])
    .then(users => {
        if (users.length > 0) {
            let msg = '';
            if (users[0].username.localeCompare(username) === 0) {
                msg = 'Error: Username taken.';
            }
            else {
                msg = 'Error: Email taken.';
            }
            return res.send({
              success: false,
              message: msg
            });
          }
          // Save the new user
          const newUser = new User();
          
          newUser.username = username;
          newUser.firstName = firstName;
          newUser.lastName = lastName;
          newUser.email = email;
          newUser.password = newUser.generateHash(password);
          newUser.save((err, user) => {
            if (err) {
              return res.send({
                success: false,
                message: 'Error: Server error'
              });
            }
            return res.send({
              success: true,
              message: 'Signed up'
            });
          });
     })
    .catch(error => {
        console.log(error);
        return res.send({
        success: false,
        message: 'Error: Server error'
      });
    })
  }); // end of sign up endpoint
};


