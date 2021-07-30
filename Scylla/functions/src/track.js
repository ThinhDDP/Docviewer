const express = require('express')
const { auth } = require('firebase-admin')
const admin = require('firebase-admin')

const db = admin.firestore()
const router = express.Router()

router.post('/track/:id', async (req, res) => {
    const docRef = db.collection('Document').doc(req.params.id)
    const doc = await docRef.get()
    let uid = req.body.uid
    const authorUid = await doc.get('author')
    
    if (!authorUid || authorUid == uid){
        res.send([doc.get('views'), doc.get('completed'), doc.get('time')])
    }
    res.send('This Document only allows the author to track it')
})

module.exports = router