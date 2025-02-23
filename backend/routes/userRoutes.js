import express from 'express';
import { signin,signup,updateProfile,getProfile} from '../controllers/userController.js';
import { verifyToken } from '../middlewares/authmiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);

export default router;
