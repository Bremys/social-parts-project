const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    poster: mongoose.Schema.Types.ObjectId,
    postType: {type: String, enum: ['BUY', 'SELL']},
    postDate: {
      type: Date,
      default: Date.now()
    },
    categories: String,
    content: String,
    album: [{data: Buffer, contentType: String, default: []}]
  });
  
  module.exports = mongoose.model('Post', PostSchema);