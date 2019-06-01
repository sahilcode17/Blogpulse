var bodyparser = require("body-parser"), 
    methodOverride = require("method-override"),
    expresssanitizer = require("express-sanitizer"),
mongooose = require("mongoose"),
express  = require("express")
app = express()
 
mongooose.connect("mongodb://localhost/blogapp" , {useNewUrlParser:true})
app.set("view engine","ejs")
app.use(express.static("public"))
app.use(bodyparser.urlencoded({extended:true}))
app.use(expresssanitizer())
app.use(methodOverride("_method"))

var port = 9000

// mongoose config
var blogSchema = new mongooose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date , default:Date.now}
})
var blog = mongooose.model("blog",blogSchema)


// restful routes
app.get("/" , function(req,res){
    res.redirect("/blogs")
})

app.get("/blogs", function(req,res){
    blog.find({}, function(err, blogs){
        if(err){
            console.log("error!")
        }
        else{
            res.render("index",{blogs: blogs})
        }

    })
})

app.get("/blogs/new",function(req,res){
    res.render("new")
})
app.post("/blogs", function(req,res){
    blog.create(req.body.blog, function(err , newBlog){
        if(err){
            res.render("new")
        }
        else{
            res.redirect("/blogs")
        }
    })
})
app.get("/blogs/:id" , function(req, res){
    blog.findById(req.params.id , function(err , foundBlog){
        if(err){
            res.redirect("/blogs")
        }
        else{
            res.render("show", {blog:foundBlog})
        }
    })
})
app.get("/blogs/:id/edit", function(req,res){
    blog.findById(req.params.id , function(err,foundBlog){
        if(err){
            res.redirect("/blogs")
        }
        else{
            res.render("edit", {blog : foundBlog})
        }
    })
})

app.put("/blogs/:id" , function(req ,res){
    blog.findByIdAndUpdate(req.params.id , req.body.blog , function(err , updateblog){
        if(err){
            res.redirect("/blogs")
        }
        else{
            res.redirect("/blogs")
        }
    })
})

app.delete("/blogs/:id" , function(req ,res){
    blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs")
        }
        else{
            res.redirect("/blogs/"+req.params.id)
        }
    })
})
// title
// image
// body
// created



app.listen(port, () => console.log(`Listening on port ${port}`))






