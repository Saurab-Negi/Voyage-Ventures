const express= require("express");
const app= express();
const mongoose= require("mongoose");
const path= require("path");
const methodOverride= require("method-override")
const ejsMate= require("ejs-mate"); //It helps to create templates and layouts
const ExpressError= require("./Utils/ExpressError");
const Review= require("./Models/review");
const listings= require("./routes/listing");
const reviews= require("./routes/review");

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

//Home Route
app.get("/", async (req, res) =>{
    res.render("listings/home.ejs");
})

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

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