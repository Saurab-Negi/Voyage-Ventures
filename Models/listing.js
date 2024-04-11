const mongoose= require("mongoose");
const Schema= mongoose.Schema;
const Review= require("./review");

const listingSchema= new Schema({
    title: {type: String, required: true},
    description: String,
    image: {
        type: String,
        default:"https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
        set: (v) => v === "" // If it's an empty string, set the default image
            ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
            : v, // Otherwise, return the provided string value
      },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId, //To store objectID's of all reviews
            ref: "Review", //Review model will be used as reference
        }
    ]
});

listingSchema.post("findOneAndDelete", async(listing) =>{ //To delete Rveiew object from database
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing= mongoose.model("Listing", listingSchema);
module.exports= Listing;