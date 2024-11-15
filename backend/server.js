require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const {MONGO_URI} = require('./config/config.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cors({
    origin: "https://finance-tracker-app-sage.vercel.app",
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
}));

const connectDB = async () => {
    try{
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS:5000,
        });
        console.log('Connected to MongoDB');
    } catch(error) {
        console.error('Error connecting to MongoDB:',error.message);
        console.error('Stack Traces :',error.stack);
        process.exit(1);
    }
};

connectDB();

app.use('/auth',authRoutes);
app.use('/user',userRoutes);
app.use('/expense',expenseRoutes);

app.use((err, req, res, next) => {
    console.error('Unexpected error:', err.message);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});


app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
