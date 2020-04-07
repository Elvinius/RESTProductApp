const express = require("express");
const router = express.Router(); 
const Category = require('../models/Category');
const Product = require('../models/Product');
const mongoose = require("mongoose");

//Get back all the products inside the specific category
router.get("/:categoryId/products", async(req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.categoryId)) {
        return res.status(404).send('Invalid id'); 
    } else {
        try {
            const category = await Category.findById(req.params.categoryId);
            const products = await Product.find({_id : {$in: category.products}});
            res.json(products);  
        } catch(err) {
            res.sendStatus(404);
        }
    }     
});

 //Submit/create the product
router.post("/:categoryId/products/", async(req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.categoryId)) {
        return res.status(404).send('Invalid id'); 
    } else {
        try {
            const category = await Category.findById(req.params.categoryId);
            const product = new Product({
                name: req.body.name,
            });
            const savedProduct = await product.save();
            category.products.push(savedProduct);
            category.save();
            res.sendStatus(200);
        } catch (err) {
            res.sendStatus(404);
        }  
    }
});

// Delete a product
router.delete('/:categoryId/products/:productId', async(req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).send('Invalid id'); 
    } else {
        try {
            await Category.findById(req.params.categoryId, async function() {
            await Category.update( {_id: req.params.categoryId}, {$pull: {products: req.params.productId}});
            await Product.findByIdAndDelete({_id: req.params.productId});
            res.sendStatus(200);
          });
        } catch (err) {
            res.sendStatus(404);
        }
    }  
});

// Update a product
router.patch('/:categoryId/products/:productId', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id) && req.body.name) {
        return res.status(404).send('Invalid id'); 
    } else if (!req.body.name || req.body.name === '') {
        res.sendStatus(400);
    } else {
        try{
            await Product.updateOne({_id: req.params.productId}, {$set : {name : req.body.name}});
            res.sendStatus(200);
        } catch (err) {
            res.sendStatus(404);
        }
    }  
});

module.exports = router;