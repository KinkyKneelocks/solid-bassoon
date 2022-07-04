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






let myQuery = `SELECT Posts.postId, Posts.Title, Posts.Description, Posts.imgUrl, Posts.userName, Posts.createdOn, COUNT(Comments.userName) AS commentCount, COUNT(Likes.userName) AS likeCount, COUNT(Dislikes.userName) AS DislikeCount,  Users.profilepic, EXISTS (SELECT Likes.likeId FROM Likes WHERE Likes.postId = Posts.postId AND Likes.userName = 'admin') AS liked, EXISTS (SELECT Dislikes.dislikeId FROM Dislikes WHERE Dislikes.userName = Posts.userName AND Likes.userName = 'admin') AS disliked
FROM Posts 
LEFT JOIN Comments ON Comments.postId = Posts.PostId 
LEFT JOIN Users ON Users.userName = Posts.userName 
LEFT JOIN Likes ON Likes.postId = Posts.PostId  
LEFT JOIN Dislikes ON Dislikes.userName = Posts.PostId  
GROUP BY Posts.postId 
ORDER BY Posts.createdOn DESC;`;

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