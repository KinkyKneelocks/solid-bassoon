const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { json } = require('express');

const sql = require('mysql');
const { type } = require('os');
const sqlConfig = {
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME
};

const db = sql.createConnection(sqlConfig);

exports.getAllPosts = (req, res, next) => {
    try {
        const myQuery = `SELECT Posts.postId, Posts.Title, Posts.Description, Posts.imgUrl, Posts.userName, Posts.createdOn, COUNT(Comments.userName) AS commentCount FROM Posts LEFT JOIN Comments ON Comments.postId = Posts.PostId GROUP BY Posts.postId;`
        db.query(myQuery, (error, results, fields) => {
            if (error) {
                res.status(400).json({
                    error: error
                })
                return;
            }
            res.status(200).json(results);
        }) 
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: error
        })
    }
};

exports.getOnePost = (req, res, next) => {
    const myQuery = `SELECT Posts.postId, Posts.Title, Posts.Description, Posts.imgUrl, Posts.userName, Posts.createdOn, COUNT(Comments.userName) AS commentCount FROM Posts LEFT JOIN Comments ON Comments.postId = Posts.PostId WHERE Posts.postId = "${req.params.id}" GROUP BY Posts.postId;`;
    try {        
        db.query(myQuery, (error, results, fields) => {
            if (error) {
                res.status(400).json({
                    error: error
                })
                return;
            }
            res.status(200).json(results);
        }

        )

    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: error
        })
    }
};

exports.addPost = (req, res, next) => {  
    try {
        if (!req.file) {
        const myQuery = `INSERT INTO Posts (Title, Description, userName) VALUES ("${req.body.post.title}", "${req.body.post.desc}", "${req.body.post.userName}");`
        db.query(myQuery, (error, results, fields) => {
            if (error) {
                res.status(400).json({
                    error: error
                })
                return;
            }
            res.status(200).json(results)
        })
    } else {
        const url = req.protocol + '://' + req.get('host');
        const imageUrl = url + '/images/' + req.file.filename;
        const myQuery = `INSERT INTO Posts (Title, Description, userName, ImgUrl) VALUES ("${req.body.post.title}", "${req.body.post.desc}", "${req.body.post.userName}", "${imageUrl}");`;
        db.query(myQuery, (error, results, fields) => {
            if (error) {
                res.status(400).json({
                    error: error
                })
                return;
            }
            res.status(200).json(results)
        })
    }
        
    } catch (error) {
        console.error(error)
        res.status(400).json({
            error: error
        })
   }
};


exports.deletePost = (req, res, next) => {
    try {
        const selectQuery = `SELECT ImgUrl FROM Posts WHERE postId = "${req.params.id}";`
        const deleteQuery = `DELETE FROM Posts WHERE postId = "${req.params.id}";`;
        const deleteCommentsQuery = `DELETE FROM Comments WHERE postId = "${req.params.id}";`;
        db.query(selectQuery, (error, results, fields) => {
            if (error) {
                res.status(400).json({
                    error: error
                })
                return;
            }
            console.log(results.ImgUrl);
            if (results.ImgUrl !== undefined) {
                const filename = json(results).ImgUrl.split('/images/')[1];
                fs.unlink('images/' + filename, (error) => {
                    if (error) {
                        res.status(400).json({
                            error: error
                        })
                    }
                })
            }

            db.query(deleteCommentsQuery, (error, results, fields) => {
                if (error) {
                    res.status(400).json({
                        error: error
                    })
                    return;
                }
                db.query(deleteQuery, (error, results, fields) => {
                    if (error) {
                        res.status(400).json({
                            error: error
                        })
                        return;
                    }
                    res.status(200).json(results)
                })
            })
        })

    } catch (error) {
        res.status(400).json({
            error: error
        })
    }
}

exports.updatePost = (req, res, next) => {
    try {
        if (!req.file) {
        const myQuery = `UPDATE Posts SET ImgUrl = NULL, Title = "${req.body.post.title}", Description = "${req.body.post.desc}" WHERE postId = "${req.params.id}"`;
        db.query(myQuery, (error, results, fields) => {
            if (error) {
                res.status(400).json({
                    error: error
                })
                return;
            }
            res.status(200).json(results)
        })
    } else {
        const url = req.protocol + '://' + req.get('host');
        req.body.sauce = JSON.parse(req.body.sauce);
        const imageUrl = url + '/images/' + req.file.filename
        const myQuery = `UPDATE Posts SET ImgUrl = "${imageUrl}", Title = "${req.body.post.title}", Description = "${req.body.post.desc}" WHERE postId = "${req.params.id}"`;
        db.query(myQuery, (error, results, fields) => {
            if (error) {
                res.status(400).json({
                    error: error
                })
                return;
            }
            res.status(200).json(results)
        })
    }
    } catch (error) {
        res.status(400).json({
            error: error
        })
    }
}

exports.getCommentsForPost = (req, res, next) => {
    try {
        const myQuery = `SELECT * FROM Comments WHERE PostId = "${req.params.id}" `;
        db.query(myQuery, (error, results, fields) => {
            if (error) {
                req.status(400).json({
                    error: error
                })
                return;
            }
            res.status(200).json(results)
        })
    } catch (error) {
        res.status(400).json({
            error: error
        })
    }
}

exports.addComment = (req, res, next) => {
    try {
        const myQuery = `INSERT INTO Comments (userName, PostId, commentText) VALUES ("${req.body.userName}", "${req.body.postId}", "${req.body.commentText}");`;
        db.query(myQuery, (error, results, fields) =>{
            if (error) {
                res.status(400).json({
                    error: error
                })
                return;
            }
            res.status(200).json(results)
        })
    } catch (error) {
        res.status(400).json({
            error: error
        })
    }
}

exports.deleteComment = (req, res, next) => {
    try {
        const myQuery = `DELETE FROM Comments WHERE CommentId = "${req.params.id}"`;
        db.query(myQuery, (error, results, fields) => {
            if (error) {
                res.status(400).json({
                    error: error
                })
                return;
            }
            res.status(200).json(results)
        })
    } catch (error) {
        res.status(400).json({
            error: error
        })
    }
}



