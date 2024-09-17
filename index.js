// dotenv file configuration.
require('dotenv').config();

// import necessary packages.
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

// import all the routes
const userRouter = require('./routes/userRoutes');
const taskRouter = require('./routes/taskRoutes')

// initialize the express application.
const app = express();

app.get("/", (req, res) => {
    res.status(200).json({
        message: "NODE/EXPRESS SERVER IS RUNNING!"
    })
})

// add all the necessary middleware.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());
app.use('/api/v1/auth', userRouter);
app.use('/api/v1/task', taskRouter)

// get all the necessary env file for the database connection and running express.
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 9090;

// connect the express server to mongodb database.
mongoose.connect(MONGO_URI)
.then(() => {
    if (mongoose.connection) {
        console.log('DATABASE CONNECTED!');
        app.listen(PORT, () => console.log(`SERVER IS RUNNING ON PORT ${PORT}`));
    }
}).catch((err) => console.log(err));
