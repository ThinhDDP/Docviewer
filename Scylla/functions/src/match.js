const express = require('express')
const admin = require('firebase-admin')

const db = admin.firestore()
const router = express.Router()

const checkIp =  async (email, doc) => {
    let emailsList = await doc.get('emails')
    console.log(emailsList)
    if (!emailsList.includes(email)){
        emailsList.push(email)
        return emailsList
    }
    return null
}

router.post('/match/:id', async (req, res) => {
    try {
        const email = req.body.email
        let docRef = db.collection('Document').doc(req.params.id)
        let doc = await docRef.get()
        if (!doc.exists){
            res.send("Document not found")
        }
        const currentView = doc.get('views')
        let updatedIpsList = await checkIp(email, doc)
        if (updatedIpsList != null){
            console.log([updatedIpsList, currentView])
            docRef.update({emails: updatedIpsList, views: currentView + 1})
            let returnId = await doc.get('id')
            res.sendStatus(returnId)
        }
        else {
            let returnId = await doc.get('id')
            res.sendStatus(returnId)
        }

    }
    catch(e){
        console.log(e)
    }
})

module.exports = router