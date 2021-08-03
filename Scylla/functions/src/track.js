const express = require('express')
const { auth } = require('firebase-admin')
const admin = require('firebase-admin')

const db = admin.firestore()
const router = express.Router()

router.post('/track/:id', async (req, res) => {
    const docRef = db.collection('Document').doc(req.params.id)
    const doc = await docRef.get()
    let perm = await doc.get('perm')
    let authors = await doc.get('author')
    let email = req.body.email
    if (perm == "Everyone"){
        res.send(await [doc.get('views'), doc.get('completed'), doc.get('time')])
    }
    else if (perm == "Only"){
        if (authors.includes(email)){
            res.send(await [doc.get('views'), doc.get('completed'), doc.get('time')])
        }
        else {
            res.send('This Document only allows the author to track it')
        }
    }
    
})

module.exports = router