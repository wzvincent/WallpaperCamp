var mongoose = require("mongoose");
var Wallpaper = require("./models/wallpaper");
var Comment = require("./models/comments");
var data = [
    {
        name:   "lake",
        image:  "https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?auto=format&fit=crop&w=1050&q=80",
        description: "hah"
    },
    {
        name:   "lake",
        image:  "https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?auto=format&fit=crop&w=1050&q=80",
        description: "hah"
    },
    {
        name:   "lake",
        image:  "https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?auto=format&fit=crop&w=1050&q=80",
        description: "hah"
    }
]

function seedDB(){
    //Remove all wallpapers
    Wallpaper.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed wallpapers");
        //add a few wallpapers
        data.forEach(function(seed){
            Wallpaper.create(seed, function(err, wallpaper){
                if(err){
                    console.log(err);
                } else {
                    console.log("added a wallpaper");
                    //create a comment
                    Comment.create(
                        {
                            text: "This picture is so beautiful!",
                            author: "Vincent"
                        }, function(err, comment){
                            if(err){
                                console.log(err);    
                            }else{
                                wallpaper.comments.push(comment);
                                wallpaper.save();
                                console.log("Created new comment");
                            }
                        });
                }
            });
        });
    });
    
}

module.exports = seedDB;