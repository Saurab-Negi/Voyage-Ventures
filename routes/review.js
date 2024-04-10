const express= require("express")
const router= express.Router({mergeParams: true});
const wrapAsync= require("../Utils/wrapAsync");
const ExpressError= require("../Utils/ExpressError");
const {reviewSchema}= require("../schema");
const Review= require("../Models/review");
const Listing= require("../Models/listing");

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

//Reviews Route: POST no need to create index route and show route
router.post("/", validateReview, wrapAsync(async (req, res) =>{
    let listing= await Listing.findById(req.params.id);
    let newReview= new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}))

//Delete Reviews Route
router.delete("/:reviewId", wrapAsync(async (req, res) =>{
    let { id, reviewId }= req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}); //The reviewId which is matched to the review in reviews array will be removed 
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}))

module.exports= router;