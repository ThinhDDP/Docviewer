const express = require('express')
const admin = require('firebase-admin')

const auth = require('../middlewares/auth')

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

const createCode = async () => {
    let code = makeid(4)
    let docRef = db.collection('Document').doc(code)
    let returnCode = await db.runTransaction((transaction) => {
        return transaction.get(docRef).then((docRef) => {
            if (!docRef.exists){
                return docRef.id
            }
            else {
                createCode()
            }
        })
    })
    return returnCode
}


const db = admin.firestore()
const router = express.Router()

const toUid = async (email) => {
    let userRecord = await admin.auth().getUserByEmail(email)
    return userRecord.uid
}

const savedOwned = async (emails, docRef, title) => {
    for (let i = 0; i < emails.length; ++i){
        let uid = await toUid(emails[i])
        console.log(uid)
        let usrRef = db.collection('Users').doc(uid)
        let usrCompleted = await (await usrRef.get()).get('owned')
        usrCompleted[docRef.id] = title
        console.log(usrCompleted)
        usrRef.update({owned: usrCompleted})
    }
}

router.post('/create', auth, async (req, res) => {
        const code =  await createCode()
        let docRef = db.collection('Document').doc(code)
        const data = {
            id: req.body.id,
            views: 0,
            completed: {},
            emails: [''],
            time: 0,
            author: req.body.uid,
            perm: req.body.perm,
            title: req.body.name,
            type: req.body.type
        }
        const saved = await savedOwned(req.body.uid, docRef, req.body.name)
        const rest = await docRef.set(data)
        if (rest){res.send(code)}
    }

)


module.exports = router