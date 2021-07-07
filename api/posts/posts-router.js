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

router.post('/', (req,res) => {
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

router.put('/:id', (req, res) => {
    const { title, contents } = req.body
    if (!title || !contents ) {
        res.status(400).json({
            message: 'Provide title and contents'
        })
    } else {
        Post.findById(req.params.id)
            .then(posts => {
                if (!posts) {
                    res.status(404).json({
                        message: `Post with ID ${req.params.id} does not exist`
                    })
                } else {
                    return Post.update(req.params.id, req.body)
                }
            })
            .then(data => {
                if (data) {
                    return Post.findById(req.params.id)
                }
            })
            .then(post => {
                if (post) {
                    res.json(post)
                }
            })
            .catch(err => {
                res.status(500).json({
                    message: 'The post could not be updated',
                    error: err.message,
                })
            })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            res.status(404).json({
                message: `The post with ID ${req.params.id} does not exist`
            })
        } else {
            await Post.remove(req.params.id)
            res.json(post)
        }
    } catch (err) {
        res.status(500).json({
            message: 'Post could not be deleted',
            error: err.message,
        })
    }
})

module.exports = router;