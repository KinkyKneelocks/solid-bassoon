const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
mongoose.connect(process.env.DB)
.then(() => {
    console.log('DB connection is ok');
})
.catch((error) => {
    console.log('unable to connect to DB');
    console.error(error);
});


const express = require('express');

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');
const path = require('path');


const app = express();
app.use(express.json());

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;