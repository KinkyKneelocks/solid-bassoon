const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://BCsuka:lCb0re7S1nKxKtLT@cluster0.2yezc.mongodb.net/Cluster0?retryWrites=true&w=majority')
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