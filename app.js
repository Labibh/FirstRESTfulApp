var bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose       = require("mongoose"),
    express        = require("express"),
    app            = express();

// APP CONFIG
mongoose.connect("mongodb://localhost:27017/tech_review", { useUnifiedTopology: true, useNewUrlParser: true });

app.set("view engine", "ejs");
app.use(express.static("public"));
mongoose.set("useFindAndModify", false);
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// Mongoose/Model Config
const techSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created : {type: Date, default: Date.now}
});

var Tech = mongoose.model("Tech", techSchema);

//RESTFUL ROUTES

app.get("/", function(req, res){
   res.redirect("/reviews");
});


// INDEX ROUTE
app.get("/reviews", function(req, res){
    Tech.find({}, function(err, reviews){
       if(err){
           console.log("Error!");
       } else {
           res.render("index", {reviews: reviews});
       }
    });
});

// NEW ROUTE
app.get("/reviews/new", function(req, res){
    res.render("new");
});

// CREATE ROUTE
app.post("/reviews", function(req, res){
   //create review
    req.body.tech.body = req.sanitize(req.body.tech.body);

    Tech.create(req.body.tech, function(err, newReview){
       if(err) {
           res.render("new");
       } else {
           res.redirect("/reviews");
       }
    });
});

// SHOW ROUTE
app.get("/reviews/:id", function(req, res){
    Tech.findById(req.params.id, function(err, foundReview){
       if(err){
           res.redirect("/reviews");
       } else {
           res.render("show", {review: foundReview});
       }
    });
});

// EDIT ROUTE
app.get("/reviews/:id/edit", function(req, res){
   Tech.findById(req.params.id, function(err, foundReview){
       if(err){
           res.redirect("/reviews");
       } else {
           res.render("edit", {review: foundReview});
       }
   })
});

// UPDATE ROUTE
app.put("/reviews/:id", function(req, res){
    req.body.tech.body = req.sanitize(req.body.tech.body);
    Tech.findByIdAndUpdate(req.params.id, req.body.tech, function(err, updatedReview){
       if(err){
           res.redirect("/reviews");
       } else {
           res.redirect("/reviews/" + req.params.id);
       }
    });
});

// DELETE ROUTE
app.delete("/reviews/:id", function(req, res){
    //destroy review
    Tech.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/reviews");
       }  else {
           res.redirect("/reviews");
       }
    });
});


var port = 3000;
app.listen(port, function(){
    console.log("The TechReview server has started!");
});