const express= require("express")
const router= express.Router();
const wrapAsync= require("../Utils/wrapAsync");
const {listingSchema}= require("../schema");
const ExpressError= require("../Utils/ExpressError");
const Listing= require("../Models/listing");

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

//Index Route
router.get("/", wrapAsync(async (req,res) =>{
    const allListings=  await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}))

//New Route
router.get("/new", (req,res) =>{
    res.render("listings/new.ejs");
})

//Show Route
router.get("/:id", wrapAsync(async (req,res) =>{
    let {id}= req.params;
    const listing= await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", {listing});
}))   

//Create Route
router.post("/", validateListing ,wrapAsync(async (req,res,next) =>{ //wrapAsync: It is another way to write try-catch function
    //calling validateListing middleware
    const newListing= new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
}))
 
//Edit Route
router.get("/:id/edit", validateListing ,wrapAsync(async (req,res) =>{
    let {id}= req.params;
    const listing= await Listing.findById(id);
    res.render("listings/edit.ejs", {listing}); 
}))

//Update Route
router.put("/:id", wrapAsync(async (req,res) =>{
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing}); //Deconstructing into individual values
    res.redirect(`/listings/${id}`);
}))

//Delete Route
router.delete("/:id", wrapAsync(async (req,res) =>{
    let {id}= req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}))

module.exports=  router;