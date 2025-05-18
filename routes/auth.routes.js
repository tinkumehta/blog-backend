import { Router } from "express";
import {register, login, changePassword} from "../controllers/auth.controllers.js"
import { requireAuth } from "../middleware/auth.middleware.js";

    const router = Router();

router.post('/register', register);
router.post('/login', login);

router.post('/change-password', requireAuth, changePassword)

router.post('/logout', (req, res)=> {
    res.json({message : 'Logged out(client should discard the token)'})
})

export default router;