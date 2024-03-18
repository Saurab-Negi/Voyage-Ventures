const express= require("express");
const app= express();
const mongoose= require("mongoose");
const Listing= require("./Models/listing");
const path= require("path");
const methodOverride= require("method-override")
const ejsMate= require("ejs-mate"); //It helps to create templates and layouts
const wrapAsync= require("./Utils/wrapAsync");
const ExpressError= require("./Utils/ExpressError");
const {listingSchema, reviewSchema}= require("./schema");
const Review= require("./Models/review");

const MONGO_URL="mongodb://127.0.0.1:27017/VoyageVentures";

main()
.then(() =>{
    console.log("connected to DB");
})
.catch(() =>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate); //use ejs-locals for all ejs templates:
app.use(express.static(path.join(__dirname,"/public"))); //To use static files(which are used everywhere in the page)

//Schema validation using middleware
const validateListing= (req, res, next) =>{
    let {error}= listingSchema.validate(req.body); //using joi for schema validation
    if(error){
        let errMsg= error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}

const validateReview= (req, res, next) =>{
    let {error}= reviewSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}

//Home Route
app.get("/", async (req, res) =>{
    res.render("listings/home.ejs");
})

//Index Route
app.get("/listings", wrapAsync(async (req,res) =>{
    const allListings=  await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}))

//New Route
app.get("/listings/new", (req,res) =>{
    res.render("listings/new.ejs");
})

//Show Route
app.get("/listings/:id", wrapAsync(async (req,res) =>{
    let {id}= req.params;
    const listing= await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", {listing});
}))   

//Create Route
app.post("/listings", validateListing ,wrapAsync(async (req,res,next) =>{ //wrapAsync: It is another way to write try-catch function
    //calling validateListing middleware
    const newListing= new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    })
);
 
//Edit Route
app.get("/listings/:id/edit", validateListing ,wrapAsync(async (req,res) =>{
    let {id}= req.params;
    const listing= await Listing.findById(id);
    res.render("listings/edit.ejs", {listing}); 
}))

//Update Route
app.put("/listings/:id", wrapAsync(async (req,res) =>{
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing}); //Deconstructing into individual values
    res.redirect(`/listings/${id}`);
}))

//Delete Route
app.delete("/listings/:id", wrapAsync(async (req,res) =>{
    let {id}= req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}))

//Reviews Route: POST no need to create index route and show route
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) =>{
    let listing= await Listing.findById(req.params.id);
    let newReview= new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}))

//Delete Reviews Route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) =>{
    let { id, reviewId }= req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}); //The reviewId which is matched to the review in reviews array will be removed 
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}))

app.all("*", (req, res, next) =>{ // If the req doesn't match the above routes
    next(new ExpressError(404,"Page Not Found"));
})

//Defining a Middleware to handle error
app.use((err, req, res, next) =>{
    let {statusCode=500, message="Something went wrong"}= err;
    res.status(statusCode).render("error.ejs",{message});
    //res.status(statusCode).send(message);
})

// app.get("/testlisting",async (req, res) =>{
//     let sampleListing= new Listing({
//         title: "Villa in Mexico",
//         description: "Beach side",
//         price: 1200,
//         location: "Mexico city",
//         country: "Mexico",
//     })

//     await sampleListing.save();
//     console.log("Sample saved");
//     res.send("Successfull testing");
// })

app.listen(3000, () =>{
    console.log("server is listening");
})