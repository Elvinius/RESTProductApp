const express = require("express");
const router = express.Router(); 
const Category = require('../models/Category');

//Get back all the posts
router.get("/", async(req, res) => {
    try {
        const categories = await Category.find(); //this mongoose method enables us to get all the categories
        res.json(categories);
    } catch(err) {
        res.json({message: err});
    }
});

//Submit the category
router.post("/", async (req, res) => {
    if(!req.body.name) {
        res.sendStatus(400);
    }
    const category = new Category({
        name: req.body.name  
    });
    try {
        await category.save();
        res.sendStatus(200);
    } catch(err) {
        res.json({message : err});
    }
});

//to get a specific category
router.get('/:categoryId', async(req, res) => {
    try {
        const category = await Category.findById(req.params.categoryId);
        res.json(category);
    } catch(err) {
        res.json({message: err});
    } 
});

//Delete category
router.delete('/:categoryId', (req, res) => {
       Category.findById(req.params.categoryId, (err, category) => {
           if(err) res.sendStatus(400);
           category.remove();
           res.sendStatus(200);
       }); 
});

//Update category
router.patch('/:categoryId', async (req, res) => {
    try {
        await Category.updateOne({_id: req.params.categoryId}, {$set : {name : req.body.name}});
        res.sendStatus(200);
    } catch(err) {
        res.json({message: err});
    }
});

module.exports = router; //we export the router with the help of this line
