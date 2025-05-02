import { Router } from "express";
import {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost
} from '../controllers/post.controller.js'

import {requireAuth} from '../middleware/auth.middleware.js'

const router = Router();

 router.get('/', getAllPosts);
 router.post('/', requireAuth, createPost);
 router.get('/:id', getPostById);
 router.put('/:id', requireAuth, updatePost);
 router.delete('/:id', requireAuth, deletePost);

 export default router