const express = require('express')
const admin = require('firebase-admin')

const db = admin.firestore()
const router = express.Router()

router.post('/user/:uid', async (req, res) => {
    let usrRef = db.collection('Users').doc(req.params.uid)
    let task = await usrRef.set({completed: [''], viewed: [''], owned: ['']})
    res.send("Done")
})


module.exports = router