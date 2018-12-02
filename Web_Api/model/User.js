const mongoose = require('mongoose')
var bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        unique: true,
        minlength: 1,
        required: true
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    admin: {
        type: Boolean,
        default: false
    },

    icon: {
        type: String,
        required: true
    },

    like: {
        type: Number,
        default: 0
    },
})

UserSchema.statics.authenticate = function (username,password) {
	const User = this
	return User.findOne({username: username}).then((user) => {
		if (!user) {
			return Promise.reject()
		}
		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (error, result) => {
				if (result) {
					resolve(user)
				} else {
					reject()
				}
			})
		})

	})
  }
  
  
  //hashing a password before saving it to the database
  UserSchema.pre('save', function (next) {
    const user = this;
	// check to make sure we don't hash again
	if (user.isModified('password')) {
		bcrypt.genSalt(10, (error, salt) => {
			bcrypt.hash(user.password, salt, (error, hash) => {
				user.password = hash;
				next();
			})
		})
	} else {
		next();
	}
  });
  
  var User = mongoose.model('User', UserSchema);
  module.exports = { User };