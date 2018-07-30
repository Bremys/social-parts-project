const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
      name: {type: String, required: true, unique: true},
      followers: [
        {type: mongoose.Schema.Types.ObjectId, default: []}
    ],
  });
  
  module.exports = mongoose.model('Category', CategorySchema);