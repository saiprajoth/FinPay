import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { success } from 'zod';
const accountRouter = express.Router();

accountRouter.get('/balance',authMiddleware,(req,res)=>{
    try {
        const token = req.token;
        
        
    } catch (error) {
        console.error('error occured while fetching user balance : ',error);
        return res.status(500).json({
            success:false,
            message:'error occured while fetching user balance'
        })
    }
})