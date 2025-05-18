import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors'

import authRoutes from './routes/auth.routes.js'
import postRoutes from './routes/post.routes.js'

dotenv.config();
const app = express();

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}));

app.use(express.json());


// http://localhost:5000/api/auth
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes)



mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () => 
        console.log(`server is running on${process.env.PORT}`)
    )
})
.catch(err => console.error(err));