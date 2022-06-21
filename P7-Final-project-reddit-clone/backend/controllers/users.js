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
        const myQuery = `INSERT INTO Users VALUES ("${req.body.username}", "${password}");`;
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
        console.log(token)    
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log(decodedToken)
        
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
        db.query(updatePosts, (error, results, fields) => {
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
                db.query(updateComments, (error, results, fields) => {
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
