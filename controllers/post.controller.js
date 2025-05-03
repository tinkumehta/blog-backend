import Post from '../models/Post.models.js'

export const createPost = async (req, res) => {
    const {title, content} = req.body;
    if (!title || !content) {
        res.status(401).json({error : "title and content is required"})
    }

    const post = await Post.create({title, content, author : req.userId});
    if (!post) {
        res.status(401).json({error : "falied to post "})
    }
    res
    .status(201)
    .json(post)
};

export const getAllPosts = async (req, res) => {
    const posts = await Post.find().populate('author', 'username');
    res
    .status(201)
    .json(posts)
}

export const getPostById = async (req, res) => {
    const post = await Post.findById(req.params.id).populate('author', 'username');
    if (!post) return res.status(404).json({error : 'Post not found'});
    res
    .status(201)
    .json(post)
}

export const updatePost  = async (req, res) => {
    const post = await Post.findById(req.params.id)
    if (!post || post.author.toString() !== req.userId) {
        return res.status(403).json({error : 'Unauthorized'})
    }
    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, {new : true});
    res
    .status(201)
    .json(updated)
}

export const deletePost = async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post || post.author.toString() !== req.userId) {
        return 
        res.status(403).json({error : 'Unauthorized'})
    }
    await post.deleteOne();
    res
    .status(201)
    .json({message : 'Post deleted '})
}