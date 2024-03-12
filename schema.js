const Joi = require('joi');

module.exports.listingSchema= Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0), //Price shouldn't be negative
        image: Joi.string().allow("",null), //Allowing image to be empty field
        location: Joi.string().required(),
        country: Joi.string().required(),
    }).required(),
});

module.exports.reviewSchema= Joi.object({ //Creating Review Schema
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        Comment: Joi.number().required(),
    }).required(),
})