const campground = require('../models/campground');
const Campground = require('../models/campground');
const {cloudinary} = require("../cloudinary");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocoder = mbxGeocoding({accessToken: process.env.MAPBOX_TOKEN});

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {campgrounds});
};

module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {

    // Naples                
    // { type: 'Point', coordinates: [ 14.248783, 40.835934 ] };

    const geoData = await geocoder.forwardGeocode({
                        query: req.body.campground.location,
                        limit:1
                    }).send();
           
    const campground = new Campground(req.body.campground);
    if(geoData.body.features.length > 0){campground.geometry = geoData.body.features[0].geometry;}
    else{campground.geometry = { type: 'Point', coordinates: [ 14.248783, 40.835934 ] }}


    campground.author = req.user.id;
    campground.images = req.files.map( img => ({url: img.path, filename: img.filename}) )
    await campground.save();
    //console.log(campground);
    req.flash("success", "Successfully made a new campground!");
    res.redirect(`/campgrounds/${campground.id}`);
};

module.exports.showCampground = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: "reviews",
        populate:{ path: "author"}
        }).populate("author");

    if (!campground) {
         req.flash('error', 'Cannot find that campground!');
         return res.redirect('/campgrounds');
     }
    res.render("campgrounds/show", {campground});
};

module.exports.renderEditForm = async (req, res, next) => {
    
    const campground = await Campground.findById(req.params.id);

    if (!campground) {
         req.flash('error', 'Cannot find that campground!');
         return res.redirect('/campgrounds');
    }
    res.render("campgrounds/edit", {campground});
};

module.exports.updateCampground = async (req, res, next) => {

    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit:1
    }).send()

    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    const imgs = req.files.map( img => ({url: img.path, filename: img.filename}));
    campground.images.push(...imgs);

    if(geoData.body.features.length > 0){campground.geometry = geoData.body.features[0].geometry;}
    else{campground.geometry = { type: 'Point', coordinates: [ 14.248783, 40.835934 ] }}

    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteCampground = async (req, res, next) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect(`/campgrounds`);
};