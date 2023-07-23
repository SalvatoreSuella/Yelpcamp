const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ReviewsSchema = new Schema({
    body:{
        type:String
    },
    rating:{
        type: Number,
        min: 1,
        max: 5
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model("Review",  ReviewsSchema);