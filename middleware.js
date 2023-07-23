const ExpressError = require('./utils/ExpressError');
const {campgroundSchema, reviewSchema} = require('./schemas.js');
const Campground = require('./models/campground');
const Review = require('./models/reviews');


module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl; 
        req.flash("error", "You must be signed in first!");
        return res.redirect("/login");
    }
    next();
}

//differente from colt code
module.exports.checkRoute = (req, res, next) => {
    // console.log("********Check Route**********");
    // console.log("originalUrl:", req.originalUrl);
    // console.log("SessionUrl", req.session.returnTo);
    // console.log("if", req.session.returnTo.includes("/reviews"));
    // console.log("********Check Route**********");
  if(req.session.returnTo.includes("/reviews")){
    res.locals.returnTo  = null;
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user.id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user.id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400)
    } else{
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400)
    } else{
        next();
    }
}