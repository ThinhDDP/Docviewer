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

const checkURL = async (url) => {
    const domain = new URL(url).hostname
    const whitelistRef = await db.collection('Default').doc('identifier').get()
    const allowed = whitelistRef.get('allowedUrls')
    return(allowed.includes(domain))
}

const db = admin.firestore()
const router = express.Router()

router.post('/create', async (req, res) => {
    if (await checkURL(req.body.link)){
        const code =  await createCode()
        const data = {
            link: req.body.link,
            title: req.body.title,
            views: 0,
            completed: 0,
            ips: [''],
            time: 0
        }
        const rest = db.collection('Document').doc(code).set(data)
        res.send(code)
    }
    res.send("Invalid")
})


module.exports = router