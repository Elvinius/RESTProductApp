const express = require("express");
const router = express.Router(); 
const Category = require('../models/Category');
const Product = require('../models/Product');

//Get back all the products inside the specific category
router.get("/:categoryId/products", async(req, res) => {
    try {
        const category = await Category.findById(req.params.categoryId);
        const products = await Product.find({_id : {$in: category.products}});
        res.json(products);  
    } catch(err) {
        res.json({message: err});
    }
});

 //Submit/create the product
router.post("/:categoryId/products/", async(req, res) => {
    try {
        const category = await Category.findById(req.params.categoryId);
        const product = new Product({
            name: req.body.name,
        });
        const savedProduct = await product.save();
        category.products.push(savedProduct);
        category.save();
        res.sendStatus(200);
        
    } catch(err) {
        res.json({message: err});
    }  
});

// Delete a product
router.delete('/:categoryId/products/:productId', async(req, res) => {
    try {
        await Category.findById(req.params.categoryId, async function(err) {
            if(err) console.log(err);
            await Category.update( {_id: req.params.categoryId}, {$pull: {products: req.params.productId}});
            await Product.findByIdAndDelete({_id: req.params.productId});
            res.sendStatus(200);
        });
        
    } catch(err) {
        res.json({message: err});
    }
});

// Update a product
router.patch('/:categoryId/products/:productId', async (req, res) => {
    try{
        await Product.updateOne({_id: req.params.productId}, {$set : {name : req.body.name}});
        res.sendStatus(200);
    } catch(err) {
        res.json({message: err});
    }
});

module.exports = router;