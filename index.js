import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import classroutes from "./Routes/Classroutes.js";
import cartroutes from "./Routes/Cartroutes.js";
import userroutes from "./Routes/Userroutes.js";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 8000;


// Middleware setup
const corsOptions = {
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST','PUT','DELETE','PATCH'], 
    allowedHeaders: ['Content-Type', 'authorization'], 
    credentials: true, 
  };
  
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use('/class', classroutes);
app.use('/cart', cartroutes);
app.use('/user', userroutes);

// MongoDB connection
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongoDB server successfully");
    } catch (error) {
        console.log("MongoDB connection error: ", error);
    }
};
connect();

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
