const Post = require('../../models/Post');
const User = require('../../models/User');
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
        console.log(req);
        const { currUser } = req.cookies;
        const { 
            title,
            content,
            buyerSeller,
            price,
            categories, 
        } = req.body;
        const post = new Post();
        post.album = req.files.map((file) => fs.readFileSync(file.path));
        post.poster = currUser;
        post.title = title;
        post.content = content;
        post.postType = buyerSeller;
        post.price = price;
        post.categories = categories;
        post.save()
        .then((doc) => {
            User.findById(doc.poster)
            .exec()
            .then((user) => {
                user.posts.unshift([doc._id]);
                user.save()
                .then(() => {
                    res.send({
                        success: true
                    });
                });
            });
        });
    });
};


