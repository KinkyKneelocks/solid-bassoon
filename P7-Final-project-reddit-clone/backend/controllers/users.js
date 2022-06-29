const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { json } = require('express');
const dayjs = require('dayjs');
const cookieparser = require('cookie-parser');

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


exports.signup = (req, res, next) => {
    
    bcrypt.hash(req.body.password, 10).then((hash) => {
        const password = hash;
        const myQuery = `INSERT INTO Users VALUES ("${req.body.username}", "${password}", NULL);`;
        db.query(myQuery, (error, results, fields) => {
            if (error) {
                if (error.errno === 1062) {
                    res.status(409).json({
                        message: "Username alrady taken"
                    })
                    return;
                } else {
                    res.status(400).json({
                        error: error
                    })
                    return;
                }
            }
            res.status(200).json(results)
        })

    }).catch((error) => {
        res.status(500).json({
            error: error
        })
    })

}


exports.login = (req, res, next) => {
    
    const findUser = `SELECT password from Users WHERE userName = "${req.body.username}"`;
    try {
        db.query(findUser, (error, results, fields) => {
            if (error) {
                res.status(400).json({
                    error: error
                })
                return;
            }
            
            if (results.length === 0) {
                res.status(402).json({
                    message: "user is not registered"
                })
                return;
            }
            
            bcrypt.compare(req.body.password, results[0].password).then(
                (valid) => {
                    if (!valid) {
                        return res.status(401).json({
                            error: 'Incorrect password!'
                          })
                    }
                    const token = jwt.sign(
                        {username: req.body.username},
                        process.env.TOKEN_SECRET,
                        {expiresIn: '24h'}
                    )
                    res.cookie("authorization", JSON.stringify(token), {
                        httpOnly: true,
                        expires: dayjs().add(1, "days").toDate()
                    })
                    res.status(200).json({
                        username: req.body.username
                    })
                }
            ).catch((error) => {
                return res.status(500).json({
                    error: error
                })
            })
            
        })
    } catch (error) {
        res.status(400).json({
            error: error
        })
    }    
}

exports.logout = (req, res, next) => {
    try {
        if (!req.cookies.authorization) {
            res.status(400).json({
                error: 'user is not logged in'
            })
            return;
        }
        res.clearCookie("authorization")
        res.status(200).json({
            message: "user logged out successfully"
        })
    } catch (error) {
        res.status(400).json({
            error: error
        })
    }
}

exports.amILoggedIn = (req, res, next) => {
    try { 
        if (!req.cookies.authorization) {
            res.status(400).json({
                error: 'user is not authorized'
            })
            return;
        }
        const token = req.cookies.authorization.slice(1, -1)    
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);        
        
        res.status(200).json({
            username: decodedToken.username
        })
    } catch {
        res.status(401).json({
            error: new Error('Invalid Request')
        })
    }
}

exports.deleteUser = (req, res, next) => {
    const updatePosts = `UPDATE Posts SET userName = "<deleted user>" WHERE userName = "${req.body.username}"`
    const updateComments = `UPDATE Comments SET userName = "<deleted user>" WHERE userName = "${req.body.username}"`
    const deleteUser = `DELETE FROM Users WHERE userName = "${req.body.username}"`

    try {
        db.query(updateComments, (error, results, fields) => {
            if (error) {
                res.status(400).json({
                    error: error
                })
                return
            }
            db.query(updatePosts, (error, results, fields) => {
                if (error) {
                    res.status(400).json({
                        error: error
                    })
                    return
                }
                db.query(deleteUser, (error, results, fields) => {
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
    } catch (error) {
        res.status(400).json({
            error: error
        })
    }
}

exports.getUserData = (req, res, next) => {
    try {
        const findUser = `SELECT userName, profilepic from Users WHERE userName = "${req.body.username}"`;        
        db.query(findUser, (error, results, fields) => {
            if (error) {
                res.status(400).json({
                    error: error
                })
                return
            }
            res.status(200).json(results)
        })
    } catch (error) {
        res.stats(400).json({
            error: error
        })
    }
}

exports.changePassword = (req, res, next) => {
    try {
        const findUser = `SELECT password FROM Users WHERE userName = "${req.body.username}"`
        db.query(findUser, (error, results, fields) => {
            if (error) {
                console.log(error)
                res.status(400).json({
                    error: error
                })
                return
            }
            let oldPassword = results[0].password
            bcrypt.compare(req.body.oldpw, oldPassword)
            .then((valid) => {
                if (!valid) {
                    res.status(401).json({
                        error: 'Incorrect password!'
                      })
                      throw Error('Incorrect password!')
                } else {
                    return bcrypt.hash(req.body.password, 10)
                }
            })
            .then((hash) => {
                const password = hash
                const updatePw = `UPDATE Users SET password = "${password}" WHERE userName = "${req.body.username}"`
                db.query(updatePw, (error, results, fields) => {
                    if (error) {
                        console.log(error)
                        res.status(400).json({
                            error: error
                        })
                        throw Error('Password change is not available')
                    }
                    res.status(200).json(results)
                })
            })
            .catch((error) => {
                console.log(error)
            })
        })
    } catch (error) {
        res.status(400).json({
            error: error
        })
    }
}


exports.changeUsername = (req, res, next) => {
    try {
        const findDuplicate = `SELECT * FROM Users WHERE userName = "${req.body.username}"`
        db.query(findDuplicate, (error, results, fields) => {            
            if (error) {
                res.status(400).json({
                    error: error
                })
                return  
            }

            /*if (results[0]) {
                res.status(409).json({
                    message: "Username alrady taken"
                })
                return
            }
            */

            const olduser = results            
            const createNewUser = `INSERT INTO Users VALUES ("${req.body.newusername}", "${olduser[0].password}", "${olduser[0].profilepic}")`
            db.query(createNewUser, (error, results, fields) => {
                if (error) {
                    res.status(400).json({
                        error: error
                    })
                    return  
                }
                const updateComments = `UPDATE Comments SET userName = "${req.body.newusername}" WHERE userName = "${olduser[0].userName}"`
                db.query(updateComments, (error, results, fields) => {
                    if (error) {
                        res.status(400).json({
                            error: error
                        })
                        return
                    }
                    const updatePosts = `UPDATE Posts SET userName = "${req.body.newusername}" WHERE userName = "${olduser[0].userName}"`
                    db.query(updatePosts, (error, results, fields) => {
                        if (error) {
                            res.status(400).json({
                                error: error
                            })
                            return
                        }
                        const deleteUser = `DELETE FROM Users WHERE userName = "${olduser[0].userName}"`
                        db.query(deleteUser, (error, results, fields) => {
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

exports.changeProfilepic = (req, res, next) => {
    try {
        const url = req.protocol + '://' + req.get('host');
        const imageUrl = url + '/images/' + req.file.filename;
        const updatePic = `UPDATE Users SET profilepic = "${imageUrl}" WHERE userName = "${req.body.username}"`
        db.query(updatePic, (error, results, fields) => {
            if (error) {
                console.log(error)
                res.status(401).json({
                    error: error
                })
                return
            }
            res.status(200).json(results)
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            error: error
        })
    }
}
