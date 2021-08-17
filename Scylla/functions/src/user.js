const express = require('express')
const admin = require('firebase-admin')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const db = admin.firestore()
const router = express.Router()

const createSignedJWTToken = (uid) => {
    console.log(process.env.TOKEN_KEY)
    return jwt.sign({
        uid: uid
    },process.env.TOKEN_KEY,
    {
        expiresIn: "24h"
    })
}

const createSignedRefreshToken = (uid) => {
    return jwt.sign({
        uid: uid
    },process.env.TOKEN_KEY,
    {
        expiresIn: "7d"
    })
}

const savedRefreshToken = async (uid, token) => {
    let refreshTokensRef = db.collection("Default").doc("Tokens")
    let refreshTokens = await (await refreshTokensRef.get()).get('refresh')
    refreshTokens[uid] = token
    return await refreshTokensRef.update({refresh: refreshTokens})
}
router.post('/user/:uid', async (req, res) => {
    let usrRef = db.collection('Users').doc(req.params.uid)
    let task = await usrRef.set({completed: {}, viewed: {}, owned: {}})
    let tokens = [createSignedJWTToken(req.params.uid), createSignedRefreshToken(req.params.uid)]
    let save = await savedRefreshToken(req.params.uid, tokens[1])
    res.send(tokens)
})


module.exports = {router, createSignedJWTToken}