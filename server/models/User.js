const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        default: ''
    },
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    email: {
      type: String,
      default: ''
    },
    password: {
      type: String,
      default: ''
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    signUpDate: {
      type: Date,
      default: Date.now()
    },
    categoriesBuy: [{type: String, default: []}],
    categoriesSell: [{type: String, default: []}],
    posts: [
      {type: mongoose.Schema.Types.ObjectId, default: []}
    ],
    followedUsers: [
        {type: mongoose.Schema.Types.ObjectId, default: []}
    ],
    followers: [
        {type: mongoose.Schema.Types.ObjectId, default: []}
    ]
  });
  
  UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };
  
  UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  
  module.exports = mongoose.model('User', UserSchema);