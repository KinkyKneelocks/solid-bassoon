const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        if (!req.cookies.authorization) {
        res.status(400).json({
            error: 'user is not authorized'
        })
        return;
    }
    const token = req.cookies.authorization.slice(1, -1)
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
            res.status(400).json({
                error: 'user is not authorized'
            })
            return;
        }
        if (decoded) { 
            req.username = decoded.username         
            next()
        }
    })

    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
          });
    }
}