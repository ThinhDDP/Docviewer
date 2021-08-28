const express = require('express')
const admin = require('firebase-admin')

const db = admin.firestore()
const router = express.Router()

const auth = require('../middlewares/auth')

const toEmail = async (uid) => {
    return (await admin.auth().getUser(uid)).email
}

const deleteViewed = async (id, usrRef) => {
    let viewedList = await (await usrRef.get()).get('viewed')
    delete viewedList[id]
    const update = await usrRef.update({viewed: viewedList})
}


const checkUser = async (doc, uid, time) => {
    let completedList = await doc.get('completed')
    if (!completedList.hasOwnProperty(uid)){
        completedList[await toEmail(uid)] = time
        return completedList
    }
    return null
}

const updateUserInfo = async (uid, docRef) => {
    let usrRef = db.collection('Users').doc(uid)
    let completedList = await (await usrRef.get()).get('completed')
    completedList[docRef.id] = await (await docRef.get()).get('title')
    const deleteId = await deleteViewed(docRef.id, usrRef)
    const update = await usrRef.update({completed: completedList})
}

router.post('/update', auth, async (req, res) => {
    const seconds = req.body.seconds
    const code = req.body.code
    const uid = req.body.uid
    if (!uid ){
        res.send("No account")
    }
    let docRef = db.collection('Document').doc(code)
    let currentCompletedList = await checkUser((await docRef.get()),uid, seconds)
    if (currentCompletedList != null){
        updateUserInfo(uid, docRef)
        console.log(currentCompletedList)
        let currentSecond = await (await docRef.get()).get('time')
        console.log([currentCompletedList, currentSecond])
        const update = await docRef.update({completed: currentCompletedList, time: currentSecond + seconds})
        if (update){res.send("Done")} 
    }
    res.send("This user has already completed this document")

})

module.exports = router