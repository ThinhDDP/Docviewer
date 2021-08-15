const express = require('express')
const jwt = require('jsonwebtoken')
const admin = require('firebase-admin')
require('dotenv').config()

const router = express.Router()
const db = admin.firestore()
const createSignedJWTToken = require('./user').createSignedJWTToken

const refreshToken = async (token, uid) => {
    let refreshTokensRef = db.collection("Default").doc("Tokens")
    let refreshTokens = await (await refreshTokensRef.get()).get('refresh')
    return refreshTokens[uid] == token
}

router.post('/refresh', (req, res) => {
    const token =  req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token){
        return res.status(403).send("No token found")
    }
    try {
        let payload = jwt.verify(token, process.env.TOKEN_KEY)
        if (refreshToken(token, payload.uid)){
            res.send(createSignedJWTToken(payload.uid))
        }
        else {
            res.status(401).send("Refresh token not found")
        }
    }catch(error){
        console.log(error)
        res.status(401).send("Authorization failed")
    }
})

module.exports = router