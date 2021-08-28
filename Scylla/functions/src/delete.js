const express = require('express')
const admin = require('firebase-admin')
const auth = require('../middlewares/auth')

const db = admin.firestore()
const savedOwned = async (uid, title) => {
    let usrOwnedRef = db.collection("Users").doc(uid)
    let usrOwned = await (await usrOwnedRef.get()).get('owned')
    delete usrOwned[title]
    await usrOwnedRef.update({owned: usrOwned})
}
const router = express.Router()

router.post("/delete/:code", auth, async (req, res) => {
    let docRef = db.collection("Document").doc(req.params.code)
    await savedOwned(req.body.uid, req.params.code)
    await docRef.delete()
    res.send("done")
})

module.exports = router