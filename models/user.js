var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
	username: String,
	password: String
});

//adds passport methods to User Schema and therefore User model
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
