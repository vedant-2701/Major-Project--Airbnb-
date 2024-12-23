const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().min(10).required(),
        image: Joi.object({
            url: Joi.string().uri().allow("", null).empty(["", null]),
        }),
        price: Joi.number().integer().min(0).required(),
        country: Joi.string().required(),
        location: Joi.string().required(),
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().integer().min(1).max(5).required(),
        comment: Joi.string().min(10).required(),
    }).required()
});