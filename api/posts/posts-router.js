// implement your posts router here
const express = require('express');
const Post = require('./posts-model');

const router = express.Router();

router.get('/', async (req,res) => {
    const posts = await Post.find()
        try {
            res.status(200).json(posts)
        } catch (err) {
            res.status(500).json({
                message: 'Error retrieving posts'
            })
        }
})

module.exports = router;