const express = require('express')
const admin = require('firebase-admin')

const db = admin.firestore()
const router = express.Router()



const checkUser = async (doc, uid, time) => {
    let completedList = await doc.get('completed')
    if (!completedList.hasOwnProperty(uid)){
        completedList[uid] = time
        return completedList
    }
    return null
}

const updateUserInfo = async (uid, docRef) => {
    let usrRef = db.collection('Users').doc(uid)
    let completedList = await (await usrRef.get()).get('completed')
    completedList[docRef.id] = await (await docRef.get()).get('title')
    console.log(completedList)
    const update = await usrRef.update({completed: completedList})
}

router.post('/update', async (req, res) => {
    const seconds = req.body.seconds
    const code = req.body.code
    const uid = req.body.uid
    let docRef = db.collection('Document').doc(code)
    let currentCompletedList = await checkUser((await docRef.get()),uid, seconds)
    console.log(currentCompletedList)
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