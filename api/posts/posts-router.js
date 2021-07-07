// implement your posts router here
const express = require('express');
const Post = require('./posts-model');

const router = express.Router();

router.get('/', async (req,res) => {
    const posts = await Post.find()
        try {
            res.status(200).json(posts);
        } catch (err) {
            res.status(500).json({
                message: 'Error retrieving posts'
            });
        }
});

router.get('/:id', async (req,res) => {
    const post = await Post.findById(req.params.id);
        try{
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({message: 'Does not exist'})
            }
        } catch(err) {
            res.status(500).json({message: 'Error retrieving post'});
        }
});

router.post('/', async (req,res) => {
    const { title, contents } = req.body
    if (!title || !contents ){
        res.status(400).json({
            message: 'A title and content are required for a post'
        })
    } else {
        Post.insert(req.body)
            .then(({id}) => {
                return Post.findById(id)
            })
            .then(post => {
                res.status(201).json(post)
            })
            .catch(err => {
                res.status(500).json({
                    message: "There was an error saving post to database",
                    error: err.message,
                })
            })
    }
});



module.exports = router;