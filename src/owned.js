const express = require('express')
const admin = require('firebase-admin')

const db = admin.firestore()
const router = express.Router()


router.post('/owned/:uid', async (req, res) => {
    let uid = req.params.uid
    let doc = await db.collection('Users').doc(uid).get()
    let owned = await doc.get('owned')
    res.send([owned])
})

module.exports = router