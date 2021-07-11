const express = require('express')
const admin = require('firebase-admin')

const db = admin.firestore()
const router = express.Router()

const checkIp =  (ip, doc) => {
    let ipsList = docRef.get('ips')
    if (!ipsList.includes(ip)){
        ipsList.push(ip)
        return ipsList
    }
    return null
}

router.post('/match/:id', async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    let docRef = db.collection('Document').doc(req.params.id)
    let doc = await doc.get()
    if (!doc.exists){
        res.send("Document not found")
    }
    const currentView = doc.get('views')
    let updatedIpsList = checkIp(ip, doc)
    if (updatedIpsList != null){const updateIps = await docRef.update({ips: updatedIpsList, views: currentView += 1})}
})

module.exports = router