const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
app.use(express.json());

const cookieparser = require('cookie-parser')
app.use(cookieparser())

const sql = require('mysql');
const sqlConfig = {
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME
};

const db = sql.createConnection(sqlConfig);
db.connect((err) => {
    if (err) {
        console.log(err.message);
        return;
    }
    console.log("database connected");
});





let myQuery = `SELECT * FROM Dislikes`;

db.query(myQuery, 
    (error, results, fields) => {
        if (error) {
            throw error;
            return;
        }
        console.log(results);   
}) 





const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const path = require('path');


app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));




module.exports = app;