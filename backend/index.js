import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './models/dbConnection.js'; 
import userRoutes from './routes/userRoutes.js';
import claimRoutes from './routes/claimRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;


connectDB();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.set('trust proxy', true);


app.use('/api/user', userRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/', (req, res) => {
   res.send("I'm live!!");
});


app.listen(port, () => {
   console.log(`Server running on port ${port}`);
});
