var express 	= require("express");
var router 		= express.Router();
var Campground	= require("../models/campground")

// ==============
// Campgrounds Routes
// ==============

// INDEX
router.get("/campgrounds", isLoggedIn, function(req, res){
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.logg(err);
		} else {
			res.render("campgrounds/index", {campgrounds:allCampgrounds});
		}
	});
});

// CREATE
router.post("/campgrounds", function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, image:image, description:desc, author:author};
	//create new campground and add to DB
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err)
		} else {
			res.redirect("/campgrounds");
		}
	});
});

//NEW
router.get("/campgrounds/new", isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

//SHOW
router.get("/campgrounds/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else{
			res.render("campgrounds/show", {campground:foundCampground});
		}
	});
});

//EDIT
router.get("/campgrounds/:id/edit", checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground:foundCampground});
		}); 
});

//UPDATE
router.put("/campgrounds/:id", checkCampgroundOwnership, function(req, res){
	
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DESTROY
router.delete("/campgrounds/:id", checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});

//middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			res.redirect("back");
		} else {
			//check if user owns campground
			if(foundCampground.author.id.equals(req.user._id)){
				next();
			} else {
				res.redirect("back");
			}
		}
		});
	} else {
		res.redirect("back");
	}
}


module.exports = router;
