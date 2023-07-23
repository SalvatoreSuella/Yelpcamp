const mongoose = require("mongoose");
const Campground = require("../models/campground");
const Review = require("../models/reviews");
const User = require("../models/user");
const cities = require('./cities');
const citiesOfItaly = require('./italy_geo');
const { places, descriptors } = require('./seedHelpers');



mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
.then(() =>{
    console.log("connected to mongoDb");
})
.catch( err => {
    console.log("Error:", err);
})

const sample = array => array[Math.floor(Math.random() * array.length)];
const randomPrice = () => Math.floor(Math.random() * 20) +10;



const emptyCampgroundDb = async () =>{
    await Campground.deleteMany({});
}
const emptyReviewDb = async () =>{
    await Review.deleteMany({});
}
const emptyUserDb = async () =>{
    await User.deleteMany({});
}

const emptyAllDb = async () =>{
    await emptyCampgroundDb();
    await emptyReviewDb({});
    await emptyUserDb({});
}

const seedDb = async () =>{

    await emptyCampgroundDb();
    await emptyReviewDb({});
    

    for(let i = 0; i < 400; i++){

        const city = sample(citiesOfItaly);
        const newCamp = new Campground({
            geometry: { type: 'Point', coordinates: [ city.lng, city.lat ] },
            location: `${city.comune}, Italy`,
            title: `${sample(descriptors)} ${sample(places)}`,
            price: `${randomPrice()}`,
            images: [
                {
                  url: 'https://res.cloudinary.com/dkggpsviw/image/upload/v1689944454/YelpCamp/hx4pwdfg6ad2zrfhw45a.jpg',
                  filename: 'YelpCamp/hx4pwdfg6ad2zrfhw45a'
                },
                {
                  url: 'https://res.cloudinary.com/dkggpsviw/image/upload/v1689944457/YelpCamp/fwkezlxp0pifrov3pvxy.jpg',
                  filename: 'YelpCamp/fwkezlxp0pifrov3pvxy'
                }
              ],
            description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam aliquid, voluptatum porro blanditiis amet nemo neque ipsum earum eos odit. Dolore minus maiores tempore eaque repellendus explicabo aliquam soluta aut.",
            author: "64b92f4c8eceaa76d90fc427",
            reviews: []
        });

        await newCamp.save();
    } 
}


// emptyDb().then(() => {
//     mongoose.connection.close();
// })

seedDb().then(() => {
    mongoose.connection.close();
})