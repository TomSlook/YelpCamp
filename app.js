var express 		= require("express"),
	app 			= express(),
	bodyParser 		= require("body-parser"),
	mongoose 		= require("mongoose"),
	Campground		= require("./models/campground"),
	Comment			= require("./models/comment"),
	User			= require("./models/user"),
	passport 		= require("passport"),
	methodOverride	= require("method-override"),
	LocalStrategy 	= require("passport-local"),
	seedDB			= require("./seeds");

//requiring routes
var commentRoutes 		= require("./routes/comments"),
	campgroundRoutes 	= require("./routes/campgrounds"),
	indexRoutes 			= require("./routes/index");

//Set up
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

mongoose.connect('mongodb://localhost:27017/YelpCamp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// seedDB();

// Passport config
app.use(require("express-session")({
	secret: "This is used to encrypt and decrypt the sessions",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware that adds user data to each route
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});


//Routes
app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);


//Listener
app.listen(3000, function() { 
  console.log('Server listening on https://wdb-navlh.run-us-west2.goorm.io/'); 
});