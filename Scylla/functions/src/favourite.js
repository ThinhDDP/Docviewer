const express = require('express')
const admin = require('firebase-admin')
const auth = require('../middlewares/auth')

const db = admin.firestore()
const router = express.Router()

router.post('/fav/:uid', auth, async (req, res) => {
    const userRef = db.collection("Users").doc(req.params.uid)
    const user = await userRef.get()
    const favourite = await user.get("favourite")
    favourite[req.body.title] = req.body.code
    const update = await userRef.update({favourite: favourite})
    res.send("Done")
})

module.exports = router