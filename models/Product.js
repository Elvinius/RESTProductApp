const mongoose = require("mongoose");

//to create a schema for our products
const ProductSchema = mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    date: {
        type: Date,
        default:Date.now
    }
});

module.exports = mongoose.model('products', ProductSchema); 