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
    console.log(req.body.code)
    const favourite = await user.get("favourite")

    if (req.body.type == "fav"){
        let title  = await getDocTitle(req.body.code)
        favourite[req.body.code] = title
    }
    else {
        console.log(req.body.code)
        delete favourite[req.body.code]
        console.log(favourite)
    }
    console.log(favourite)
    const update = await userRef.update({favourite: favourite})
    res.send("Done")

})

module.exports = router