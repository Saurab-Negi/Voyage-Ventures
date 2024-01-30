const mongoose= require("mongoose");
const Schema= mongoose.Schema;

const listingSchema= new Schema({
    title: {type: String,required: true},
    description: String,
    image: {
        type: String,
        default: "https://unsplash.com/photos/yellow-wooden-house-on-body-of-water-surrounded-with-trees-L8Q0cd7bQ0U",
        set: function(v) {
            // Check if the provided value is an object
            if (typeof v === 'object' && v !== null && v.url) {
                // If it's an object with a URL property, return the URL
                return v.url;
            } else if (v === "") {
                // If it's an empty string, set the default image
                return "https://unsplash.com/photos/yellow-wooden-house-on-body-of-water-surrounded-with-trees-L8Q0cd7bQ0U";
            } else {
                // Otherwise, return the provided string value
                return v;
            }
        }
    },
    price: Number,
    location: String,
    country: String,
});
const Listing= mongoose.model("Listing", listingSchema);
module.exports= Listing;
