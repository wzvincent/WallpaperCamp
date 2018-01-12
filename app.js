var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    flash         = require("connect-flash"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Wallpaper     = require("./models/wallpaper"),
    Comment       = require("./models/comments"),
    User          = require("./models/user"),
    seedDB        = require("./seeds")

// requiring routes    
var commentRoutes   = require("./routes/comments"),
    wallpaperRoutes = require("./routes/wallpapers"),
    indexRoutes      = require("./routes/index")

    
//seedDB();//seed the database

mongoose.connect("mongodb://localhost/wallpaper");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Vincent is best sde in dwf!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/wallpapers", wallpaperRoutes);
app.use("/wallpapers/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The yelpcamp has start"); 
});
