import Post from '../models/Post.models.js'
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const createPost = asyncHandler(async (req, res) => {
    const {title, content} = req.body;
    if (!title || !content) {
       throw new ApiError(400, "title and content is required")
    }

    const post = await Post.create({title, content, author : req.userId});
    if (!post) {
        throw new ApiError(500, "falied to post")
    }
    res
    .status(201)
    .json(
        new ApiResponse(200, post, "Create post to successfully")
    )
})

export const getAllPosts = async (req, res) => {
    const posts = await Post.find().populate('author', 'username');
    res
    .status(201)
    .json(
        new ApiResponse(200, posts, "Gets all posts succesfully")
    )
}

export const getPostById = async (req, res) => {
    const post = await Post.findById(req.params.id).populate('author', 'username');
    if (!post) {
        throw new ApiError(404, "post is not match")
    }
    res
    .status(201)
    .json(
        new ApiResponse(200, post, "get post id is successfully")
    )
}

export const updatePost  = async (req, res) => {
    const post = await Post.findById(req.params.id)
    if (!post || post.author.toString() !== req.userId) {
        throw new ApiError(401, "Unauthor user")
    }
    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, {new : true});
    res
    .status(201)
    .json(
        new ApiResponse(200, updated, "Updated post succefully")
    )
}

export const deletePost = async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post || post.author.toString() !== req.userId) {
       throw new ApiError(401, "Unauthor user")
    }
    await post.deleteOne();
    res
    .status(201)
    .json(
        new ApiResponse(201, {}, "mesage is delete successfully")
    )
}