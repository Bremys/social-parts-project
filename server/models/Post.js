const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    poster: mongoose.Schema.Types.ObjectId,
    postType: {type: String, enum: ['BUY', 'SELL'], default: ''},
    postDate: {
      type: Date,
      default: Date.now(),
    },
    title: String,
    price: Number,
    categories: [{type: String}],
    content: String,
    album: [{data: Buffer, contentType: String, default: []}],
  });
  
  module.exports = mongoose.model('Post', PostSchema);