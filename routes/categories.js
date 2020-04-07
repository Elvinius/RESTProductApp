const express = require("express");
const router = express.Router(); 
const Category = require('../models/Category');
const mongoose = require("mongoose");

//Get back all the categories
router.get("/", async(req, res) => {
    try {
        const categories = await Category.find(); //this mongoose method enables us to get all the categories
        res.json(categories);
    } catch (err) {
        res.sendStatus(404);
    }
});

//Submit the category
router.post("/", async (req, res) => {
    if (!req.body.name) {
        res.sendStatus(400);
    }
    else {
        const category = new Category({
        name: req.body.name  
    });
    try {
        await category.save();
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(404);
    }
  }
});

//to get a specific category
router.get('/:categoryId', async(req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.categoryId)) {
        return res.status(404).send('Invalid id'); 
    } else {
        try {
            const category = await Category.findById(req.params.categoryId);
            res.json(category);
        } catch (err) {
            res.sendStatus(404);
        } 
    }  
});

//Delete category
router.delete('/:categoryId', (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.categoryId)) {
        return res.status(404).send('Invalid id'); 
    } else {
        Category.findById(req.params.categoryId, (err, category) => {
            if (err) {
                res.sendStatus(400);
             } else {
                 category.remove();
                 res.sendStatus(200);
             }
        }); 
    }     
});

//Update category
router.patch('/:categoryId', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.categoryId) ) {
        res.status(404).send('Invalid id'); 
    } else if (!req.body.name || req.body.name === '') {
        res.sendStatus(400);
    } else {
        try {
            await Category.updateOne({_id: req.params.categoryId}, {$set : {name : req.body.name}});
            res.sendStatus(200);
        } catch (err) {
            res.sendStatus(404);
        }
    }
});

module.exports = router; //we export the router with the help of this line
