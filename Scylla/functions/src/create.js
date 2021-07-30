const express = require('express')
const admin = require('firebase-admin')


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
    let doc = await docRef.get()
    if (!doc.exists){
        return code
    }
    else {
        createCode()
    }
}


const db = admin.firestore()
const router = express.Router()

const savedOwned = async (uids, docRef) => {
    uids.map(async (uid) => {
        let docRef = db.collection('Users').doc(uid)
        let usrCompleted = await (await docRef.get()).get('owned')
        usrCompleted.push(docRef)
        docRef.update({owned: usrCompleted})
    })
}

router.post('/create', async (req, res) => {
        const code =  await createCode()
        let docRef = db.collection('Document').doc(code)
        const data = {
            id: req.body.id,
            views: 0,
            completed: [''],
            emails: [''],
            time: 0,
            author: req.body.uid,
            perm: req.body.perm,
            time: req.body.name
        }
        const saved = await savedOwned(req.body.uid, docRef)
        const rest = await docRef.set(data)
        if (rest){res.send(code)}
    }

)


module.exports = router