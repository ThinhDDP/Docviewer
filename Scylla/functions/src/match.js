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
        let updateIps
        const ip = req.body.ip
        let docRef = db.collection('Document').doc(req.params.id)
        let doc = await docRef.get()
        if (!doc.exists){
            res.send("Document not found")
        }
        const currentView = doc.get('views')
        let updatedIpsList = checkIp(ip, doc)
    
        if (updatedIpsList != null){
                docRef.update({ips: updatedIpsList, views: currentView + 1}).then((result) => {
                console.log('Successfully executed write at: ', result);
                res.send([doc.get('views') + 1])
            })
        }
        else {
            res.send([doc.get('views')])
        }

    }
    catch (e){
        res.send(e)
    }
})

module.exports = router