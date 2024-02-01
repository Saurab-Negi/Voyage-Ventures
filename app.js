const express= require("express");
const app= express();
const mongoose= require("mongoose");
const Listing= require("/Projects/Major/Models/listing.js");
const path= require("path");
const methodOverride= require("method-override")
const ejsMate= require("ejs-mate"); //It helps to create templates and layouts

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

//Index Route
app.get("/listings", async (req,res) =>{
    const allListings=  await Listing.find({});
    res.render("listings/index.ejs",{allListings});
})

//New Route
app.get("/listings/new", async (req,res) =>{
    res.render("listings/new.ejs");
})

//Show Route
app.get("/listings/:id", async (req,res) =>{
    let {id}= req.params;
    const listing= await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
})   

//Create Route
app.post("/listings", async (req,res) =>{
    const newListing= new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});
 
//Edit Route
app.get("/listings/:id/edit", async (req,res) =>{
    let {id}= req.params;
    const listing= await Listing.findById(id);
    res.render("listings/edit.ejs", {listing}); 
})

//Update Route
app.put("/listings/:id", async (req,res) =>{
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing}); //Deconstructing into individual values
    res.redirect(`/listings/${id}`);
})

//Delete Route
app.delete("/listings/:id", async (req,res) =>{
    let {id}= req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
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