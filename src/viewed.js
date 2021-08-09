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
    res.send([viewed, completed])
})

module.exports = router