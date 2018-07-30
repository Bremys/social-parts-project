const UserSession = require('../../models/UserSession');
const User = require('../../models/User');

module.exports = (app) => {

    app.post('/authenticate', (req, res, next) => {
        let {sessionId} = req.cookies;
        if (sessionId === undefined) {
            return res.send({ success: false});
        }
        
        UserSession.find({_id: sessionId, isDeleted: false},(err, sessions) => {
            if (err){
                return res.send({ success: false});
            }
            if (sessions.length != 1){
                return res.send({ success: false});
            }
            User.findById(sessions[0].userId)
            .exec()
            .then((user) => {
                res.send(
                    {   
                        success: true,
                        userId: user._id,
                        user: {
                            username: user.username,
                            lastName: user.lastName,
                            firstName: user.firstName,
                        },
                    }
                );
            });
        });
      });
    
};


