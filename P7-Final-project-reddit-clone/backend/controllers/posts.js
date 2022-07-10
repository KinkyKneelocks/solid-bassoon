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
        const myQuery = `SELECT Posts.postId, Posts.Title, Posts.Description, Posts.imgUrl, Posts.userName, Posts.createdOn, (SELECT COUNT(Comments.userName) FROM Comments WHERE Comments.postId = Posts.postId) AS commentCount, (SELECT COUNT(Likes.userName) FROM Likes WHERE Likes.postId = Posts.postId) AS likeCount, (SELECT COUNT(Dislikes.userName) FROM Dislikes WHERE Dislikes.postId = Posts.postId) AS DislikeCount,  Users.profilepic, EXISTS (SELECT Likes.likeId FROM Likes WHERE Likes.postId = Posts.postId AND Likes.userName = '${req.username}') AS liked, EXISTS (SELECT Dislikes.dislikeId FROM Dislikes WHERE Dislikes.postId = Posts.postId AND Dislikes.userName = '${req.username}') AS disliked
        FROM Posts 
        LEFT JOIN Comments ON Comments.postId = Posts.PostId 
        LEFT JOIN Users ON Users.userName = Posts.userName 
        LEFT JOIN Likes ON Likes.postId = Posts.PostId  
        LEFT JOIN Dislikes ON Dislikes.postId = Posts.PostId  
        GROUP BY Posts.postId 
        ORDER BY Posts.createdOn DESC;`;
        db.query(myQuery, (error, results, fields) => {
            if (error) {
                console.log(error)
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
    const myQuery = `SELECT Posts.postId, Posts.Title, Posts.Description, Posts.imgUrl, Posts.userName, Posts.createdOn, (SELECT COUNT(Comments.userName) FROM Comments WHERE Comments.postId = Posts.postId) AS commentCount, (SELECT COUNT(Likes.userName) FROM Likes WHERE Likes.postId = Posts.postId) AS likeCount, (SELECT COUNT(Dislikes.userName) FROM Dislikes WHERE Dislikes.postId = Posts.postId) AS DislikeCount,  Users.profilepic, EXISTS (SELECT Likes.likeId FROM Likes WHERE Likes.postId = Posts.postId AND Likes.userName = '${req.username}') AS liked, EXISTS (SELECT Dislikes.dislikeId FROM Dislikes WHERE Dislikes.postId = Posts.postId AND Dislikes.userName = '${req.username}') AS disliked
    FROM Posts 
    LEFT JOIN Comments ON Comments.postId = Posts.PostId 
    LEFT JOIN Users ON Users.userName = Posts.userName 
    LEFT JOIN Likes ON Likes.postId = Posts.PostId  
    LEFT JOIN Dislikes ON Dislikes.postId = Posts.PostId 
    WHERE Posts.postId = "${req.params.id}" 
    GROUP BY Posts.postId`;

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
        const myQuery = `INSERT INTO Posts (Title, Description, userName) VALUES ("${req.body.title}", "${req.body.desc}", "${req.body.userName}");`
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
            const myQuery = `INSERT INTO Posts (Title, Description, userName, ImgUrl) VALUES ("${req.body.title}", "${req.body.desc}", "${req.body.userName}", "${imageUrl}");`;
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
        const deleteLikes = `DELETE FROM Likes WHERE postId = "${req.params.id}";`;
        const deleteDislikes = `DELETE FROM Likes WHERE postId = "${req.params.id}";`;
        const deleteCommentsQuery = `DELETE FROM Dislikes WHERE postId = "${req.params.id}";`;
        db.query(selectQuery, (error, results, fields) => {
            if (error) {
                res.status(400).json({
                    error: error
                })
                return;
            }

            if (results[0].ImgUrl !== null) {
                const filename = results[0].ImgUrl.split('/images/')[1];
                console.log(filename)
                fs.unlink('images/' + filename, (error) => {
                    if (error) {
                        res.status(401).json({
                            error: error
                        })
                    }
                })
            }

            db.query(deleteCommentsQuery, (error, results, fields) => {
                if (error) {
                    res.status(402).json({
                        error: error
                    })
                    return;
                }
                db.query(deleteDislikes, (error, results, fields) => {
                    if (error) {
                        res.status(403).json({
                            error: error
                        })
                        return;
                    }
                    db.query(deleteLikes, (error, results, fields) => {
                        if (error) {
                            res.status(400).json({
                                error: error
                            })
                            return
                        }
                        db.query(deleteQuery, (error, results, fields) => {
                            if (error) {
                                res.status(400).json({
                                    error: error
                                })
                                return
                            }
                            res.status(200).json(results)
                        })
                    })
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
        const myQuery = `UPDATE Posts SET Title = "${req.body.title}", Description = "${req.body.desc}" WHERE postId = "${req.params.id}"`;
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
            const myQuery = `UPDATE Posts SET ImgUrl = "${imageUrl}", Title = "${req.body.title}", Description = "${req.body.desc}" WHERE postId = "${req.params.id}"`;
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
    
}

exports.getCommentsForPost = (req, res, next) => {
    try {
        const myQuery = `SELECT Comments.commentId, Comments.userName, Comments.PostId, Comments.commentText, Comments.createdOn, Users.profilepic FROM Comments
        LEFT JOIN Users ON Users.userName = Comments.userName
        WHERE Comments.postId = "${req.params.id}"
        GROUP BY Comments.commentId`
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

exports.reactToPost = (req, res, next) => {
    const addLike = `INSERT INTO Likes (userName, postId) VALUES ("${req.username}", "${req.body.postId}");`
    const addDislike = `INSERT INTO Dislikes (userName, postId) VALUES ("${req.username}", "${req.body.postId}");`
    const removeLike = `DELETE FROM Likes WHERE userName = "${req.username}" AND postId = "${req.body.postId}";`
    const removeDislike = `DELETE FROM Dislikes WHERE userName = "${req.username}" AND postId = "${req.body.postId}";`
    try {
        if (req.body.previous == 0 && req.body.desired == 1) {
            /* User wants to like */
            db.query(addLike, (error, results, fields) => {
                if (error) {
                    console.log(error)
                    res.status(400).json({
                        error: error
                    })
                    return
                }
                res.status(200).json(results)
            })
        }

        if (req.body.previous == 0 && req.body.desired == -1) {
            /* User wants to dislike */
            db.query(addDislike, (error, results, fields) => {
                if (error) {
                    res.status(400).json({
                        error: error
                    })
                    return
                }
                res.status(200).json(results)
            })
            
        }

        if (req.body.previous == 1 && req.body.desired == 0) {
            /* User wants to remove like */
            db.query(removeLike, (error, results, fields) => {
                if (error) {
                    res.status(400).json({
                        error: error
                    })
                    return
                }
                res.status(200).json(results)
            })
        }

        if (req.body.previous == -1 && req.body.desired == 0) {
            /* User wants to remove dislike */
            db.query(removeDislike, (error, results, fields) => {
                if (error) {
                    res.status(400).json({
                        error: error
                    })
                    return
                }
                res.status(200).json(results)
            })
        }

        if (req.body.previous == -1 && req.body.desired == 1) {
            /* User wants to remove dislike and add like */
            db.query(removeDislike, (error, results, fields) => {
                if (error) {
                    res.status(400).json({
                        error: error
                    })
                    return
                }
                db.query(addLike, (error, results, fields) => {
                    if (error) {
                        res.status(400).json({
                            error: error
                        })
                        return
                    }
                    res.status(200).json(results)
                })
            })
        }

        if (req.body.previous == 1 && req.body.desired == -1) {
            /* User wants to remove like and add dislike */
            db.query(removeLike, (error, results, fields) => {
                if (error) {
                    res.status(400).json({
                        error: error
                    })
                    return
                }
                db.query(addDislike, (error, results, fields) => {
                    if (error) {
                        res.status(400).json({
                            error: error
                        })
                        return
                    }
                    res.status(200).json(results)
                })
            })
        }


    } catch (error) {
        res.status(400).json({
            error: error
        })
    }
}



