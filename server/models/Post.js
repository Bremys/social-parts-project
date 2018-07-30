const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    poster: mongoose.Schema.Types.ObjectId,
    posterUsername: {type: String},
    posterFirstName: {type: String},
    posterLastName: {type: String},
    postType: {type: String, enum: ['BUY', 'SELL'], default: ''},
    postDate: {
      type: Date,
      default: Date.now(),
    },
    title: String,
    price: Number,
    categories: {type: [String]},
    content: String,
    album: [{data: String, contentType: String}],
    comments: [
        {
          comment: String, 
          username: String,
          lastName: String,
          firstName: String,
        }],
  });
  
  module.exports = mongoose.model('Post', PostSchema);