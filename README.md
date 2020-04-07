# RESTProductApp
Product app API created as a part of the internship test task 

## Setup
The project has been made by using Node.js. The main language used in the project is JavaScript. The REST protocol has been applied to create routes. <br>

Used frameworks and technologies:
* [Express.js](https://expressjs.com/)
* [Mongoose](https://mongoosejs.com/)
* [Mocha](https://www.npmjs.com/package/mocha)
* [Chai](https://www.chaijs.com/)
* [Supertest](https://www.npmjs.com/package/supertest)

Database:
* [MongoDB](https://www.mongodb.com/) - as a main database
* [Mockgoose](https://www.npmjs.com/package/mockgoose) - for unit tests

### Schemas 

1. Category

```const mongoose = require("mongoose");
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
```
---
2. Product
```const mongoose = require("mongoose");

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
```

### Deployment

On your local machine terminal run the following code to clone the project from the repository: <br>
```git clone https://github.com/Elvinius/RESTProductApp.git``` <br>
After opening the project in one of the code editors (for example, Visual Studio Code) type the following command to run the server:<br>
```npm start``` <br>
In order to run the unit tests type the following command: <br>
```npm test``` <br>
You can use Postman application to verify the routes and implement various requests.
