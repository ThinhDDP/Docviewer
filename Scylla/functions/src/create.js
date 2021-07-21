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

router.post('/create', async (req, res) => {
        const code =  await createCode()
        const data = {
            id: req.body.id,
            views: 0,
            completed: [''],
            emails: [''],
            time: 0,
            author: req.body.uid ? req.body.uid : null
        }
        if (req.body.uid){
            data.ownerId = req.body.uid
        }
        const rest = await db.collection('Document').doc(code).set(data)
        if (rest){res.send(code)}
    }

)


module.exports = router