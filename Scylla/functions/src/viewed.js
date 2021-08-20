const express = require('express')
const admin = require('firebase-admin')

const db = admin.firestore()
const router = express.Router()


router.post('/viewed/:uid', async (req, res) => {
    let uid = req.params.uid
    let doc = await db.collection('Users').doc(uid).get()
    console.log('********' + doc)
    let viewed = await doc.get('viewed')
    let completed = await doc.get('completed')
    let favourite = await doc.get('favourite')
    res.send([viewed, completed, favourite])
})

module.exports = router