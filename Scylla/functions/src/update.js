const express = require('express')
const admin = require('firebase-admin')

const db = admin.firestore()
const router = express.Router()

const updateUserInfo = async (uid, docRef) => {
    let usrRef = db.collection('Users').doc(uid)
    let completedList = await (await usrRef.get()).get('completed')
    completedList.push(docRef)
    console.log(completedList)
    const update = await usrRef.update({completed: completedList})
}

router.post('/update', async (req, res) => {
    const seconds = req.body.seconds
    const code = req.body.code
    const uid = req.body.uid
    let docRef = db.collection('Document').doc(code)
    let currentCompletedList = await (await docRef.get()).get('completed')
    updateUserInfo(uid, docRef)
    let currentSecond = await (await docRef.get()).get('time')
    currentCompletedList.push(uid)
    const update = await docRef.update({completed: currentCompletedList, time: currentSecond + seconds})
    if (update){res.send("Done")} 
})

module.exports = router