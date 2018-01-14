var express = require("express");
var router = express.Router();
var Wallpaper = require("../models/wallpaper");
var middleware = require("../middleware");

//NEW - show form to create new wallpaper
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("wallpapers/new"); 
});

// INDEX - show all wallpapers
router.get("/", function(req, res){
    var noMatch = null;
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Wallpaper.find({name: regex}, function(err,allWallpapers){
           if(err){
               console.log(err);
           } else{
               
               if(allWallpapers.length < 1){
                   noMatch = "No wallpapers match that query, please try again.";
               }
               res.render("wallpapers/index", {wallpapers:allWallpapers, currentUser: req.user, noMatch: noMatch});
           }
        });            
    } else {
        // Get all wallpapers from db
        Wallpaper.find({}, function(err,allWallpapers){
           if(err){
               console.log(err);
           } else{
               res.render("wallpapers/index", {wallpapers:allWallpapers, currentUser: req.user, noMatch: noMatch});
           }
        });
    }
});

//CREATE - create new wallpaper
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newWallpaper = {name: name, image: image, description: description, author: author};
    // Create a new wallpaper and save to DB
    Wallpaper.create(newWallpaper, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/wallpapers");
        }
    });
});

// SHOW - shows more info about one wallpaper
router.get("/:id", function(req, res){
   //find the wallpaper with provided ID
   Wallpaper.findById(req.params.id).populate("comments").exec(function(err, foundWallpaper){
       if(err){
           console.log(err);
       } else {
           //render show template with that wallpaper
           res.render("wallpapers/show", {wallpaper: foundWallpaper});
       }
   });
});

//Edit Wallpaper Route
router.get("/:id/edit", middleware.checkWallpaperOwnership, function(req, res){
    // is user logged in
    Wallpaper.findById(req.params.id, function(err, foundWallpaper){
        res.render("wallpapers/edit", {wallpaper: foundWallpaper});
    });
});

//Update 
router.put("/:id", middleware.checkWallpaperOwnership, function(req, res){
   //find and update the correct wallpaper
   Wallpaper.findByIdAndUpdate(req.params.id, req.body.wallpaper, function(err, updatedWallpaper){
      if(err){
          res.redirect("/wallpapers");
      } else{
          res.redirect("/wallpapers/" + req.params.id);
      }
   });
});

//Destroy Wallpaper Route
router.delete("/:id", middleware.checkWallpaperOwnership, function(req, res){
   Wallpaper.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/wallpapers");
      } else {
          res.redirect("/wallpapers");
      }
   }); 
});

function escapeRegex(text){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;