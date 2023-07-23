const Campground = require('../models/campground');
const Review = require('../models/reviews');

module.exports.createReview = async(req, res, next) => {;
    const campground = await Campground.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user.id;
    campground.reviews.push(newReview);
    await newReview.save();
    await campground.save();
    req.flash('success', 'Created new review!');
    
    res.redirect(`/campgrounds/${campground.id}`);
};

module.exports.deleteReview = async(req, res, next) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: {reviews: reviewId} } );
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/campgrounds/${id}`);
};