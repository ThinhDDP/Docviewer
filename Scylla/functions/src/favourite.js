const express = require('express')
const admin = require('firebase-admin')
const auth = require('../middlewares/auth')

const db = admin.firestore()
const router = express.Router()

const getDocTitle = async (code) => {
    console.log(code)
    let docRef = db.collection('Document').doc(code)
    return await (await docRef.get()).get('title')
}

router.post('/fav/:uid', auth, async (req, res) => {
    const userRef = db.collection("Users").doc(req.params.uid)
    const user = await userRef.get()
    const favourite = await user.get("favourite")
    console.log(req.body.code)
    let title  = await getDocTitle(req.body.code)
    if (req.body.type == "fav"){
        favourite[title] = req.body.code
    }
    else {
        delete favourite[title]
        console.log(favourite)
    }
    const update = await userRef.update({favourite: favourite})
    res.send("Done")

})

module.exports = router