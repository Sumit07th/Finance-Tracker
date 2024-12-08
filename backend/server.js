require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const groupRoutes  = require('./routes/groupRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const notifyRoutes = require('./routes/notifyRoutes')
const personalExpenseRoutes = require('./routes/personalExpenseRoutes');
const {MONGO_URI} = require('./config/config.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cors());

const connectDB = async () => {
    try{
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS:10000,
        });
        console.log('Connected to MongoDB');
    } catch(error) {
        console.error('Error connecting to MongoDB:',error.message);
        console.error('Stack Traces :',error.stack);
        process.exit(1);
    }
};

connectDB();

app.use('/api/auth',authRoutes);
app.use('/api/group',groupRoutes);
app.use('/api/expense',expenseRoutes);
app.use('/api/notify',notifyRoutes);
app.use('/api/personal',personalExpenseRoutes);

app.use((err, req, res, next) => {
    console.error('Unexpected error:', err.message);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});


app.listen(5000, () => {
    console.log('Server is running on port 5000');
});