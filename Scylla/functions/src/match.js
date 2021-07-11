const express = require('express')
const admin = require('firebase-admin')

const db = admin.firestore()
const router = express.Router()

const checkIp =  (ip, doc) => {
    let ipsList = doc.get('ips')
    if (!ipsList.includes(ip)){
        ipsList.push(ip)
        return ipsList
    }
    return null
}

router.post('/match/:id', async (req, res) => {
    try {
        const ip = req.body.ip
        let docRef = db.collection('Document').doc(req.params.id)
        let doc = await docRef.get()
        if (!doc.exists){
            res.send("Document not found")
        }
        const currentView = doc.get('views')
        let updatedIpsList = checkIp(ip, doc)
    
        if (updatedIpsList != null){let updateIps = await docRef.update({ips: updatedIpsList, views: currentView + 1})}
        res.send([doc.get('link'), doc.get('title'), doc.get('ips'), doc.get('views')])
    }
    catch (e){
        console.log(e)
    }
})

module.exports = router