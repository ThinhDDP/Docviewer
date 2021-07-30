const express = require('express')
const admin = require('firebase-admin')

const db = admin.firestore()
const router = express.Router()

const removeDupes = (arr) => {
    return ([... new Set(arr)])
}

router.post('/viewed/:uid', async (req, res) => {
    let uid = req.params.uid
    let viewed = []
    let completed = []
    let doc = await db.collection('Users').doc(uid).get()
    let docViewed = await doc.get('viewed')
    let docCompleted = await doc.get('completed')
    docViewed.map(async (docRef) => {
        viewed.push(await docRef.get())
    })
    docCompleted.map(docRef => {
        completed.push()
    })
    res.send([removeDupes(viewed), removeDupes(completed)])
})

module.exports = router