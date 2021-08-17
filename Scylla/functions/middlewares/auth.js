const jwt = require('jsonwebtoken')
require('dotenv').config()

const verifyToken = (req, res, next) => {
    const token =  req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token){
        return res.status(403).send("No token found")
    }
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY)
        // req.user = decoded //Add decoded JWTs as a variable in the request
    }catch(error){
        return res.status(401).send("Authorization failed")
    }
    return next()
}

module.exports = verifyToken