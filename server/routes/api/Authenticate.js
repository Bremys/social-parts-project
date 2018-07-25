const UserSession = require('../../models/UserSession');

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
            return res.send({ success: true});
        });
      });
    
};


