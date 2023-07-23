const catchAsync = require('../utils/catchAsync');
const {validateCampground, isLoggedIn, isAuthor} = require("../middleware");
const campgroundController = require("../controllers/campgrounds");


const express = require("express");
const router = express.Router();
const multer = require("multer");
const {storage} = require("../cloudinary");


                                    
const upload = multer({storage: storage });

const Campground = require("../models/campground");

router.route("/")
    .get(catchAsync(campgroundController.index))
    .post(isLoggedIn, upload.array("image"), validateCampground, catchAsync(campgroundController.createCampground));
  

router.get("/new", isLoggedIn, campgroundController.renderNewForm);

router.route("/:id")
    .get( catchAsync(campgroundController.showCampground))
    .put(isLoggedIn, isAuthor, upload.array("image"), validateCampground, catchAsync(campgroundController.updateCampground))
    .delete( isAuthor, catchAsync(campgroundController.deleteCampground));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgroundController.renderEditForm));

module.exports = router;