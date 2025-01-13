import express from 'express';
import {Signup ,Login, Logout, updateProfile, checkAuth} from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
// Step 2: Create a route
const router = express.Router();
router.post('/signup', Signup);
router.post('/login' , Login);
router.post('/logout', Logout);
router.put('/updateProfile',protectRoute, updateProfile);
router.get('/check' , protectRoute , checkAuth);

export default router