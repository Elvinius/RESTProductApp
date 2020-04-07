const mongoose = require("mongoose");
const Product = require("./Product");

//to create a schema for our categories
const CategorySchema = mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    products: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Product",
        }],
    date: {
        type: Date,
        default:Date.now
    }
});

CategorySchema.pre('remove',  async function() {
   try {
        await Product.deleteMany({
            "_id": {
                $in: this.products
            }
        });
    
   } catch(err) {
       res.json({message: err});
   }
});

module.exports = mongoose.model('categories', CategorySchema); //we give the Categories the schema to use 
