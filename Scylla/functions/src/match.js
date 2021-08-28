const express = require('express')
const admin = require('firebase-admin')
require('dotenv').config()
const textract = require('textract')
const db = admin.firestore()
const router = express.Router()
const storage = admin.storage().bucket()
const fs = require('fs')
const {google} = require('googleapis');




const auth = new google.auth.GoogleAuth({
    keyFile: "../firebase-service-account.json",
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });

const drive = google.drive({
    version: 'v3',
    auth: auth
})

const checkIp =  async (email, doc) => {
    let emailsList = await doc.get('emails')
    console.log(emailsList)
    if (!emailsList.includes(email)){
        emailsList.push(email)
        return emailsList
    }
    return null
}

const getDocData = async (fileId) => {
    const response = await drive.files.export({
        fileId: fileId,
        mimeType: "text/html"
    })
    console.log(response)
    return response
}
const savedViewed = async(uid, docRef) => {
    let usrRef = db.collection('Users').doc(uid)
    let usr = await usrRef.get()
    let usrData = await usr.get('viewed')
    let doc = await docRef.get()
    let title = await doc.get('title')
    usrData[docRef.id] = await (await docRef.get()).get('title')
    usrRef.update({viewed: usrData})
    let email = (await admin.auth().getUser(uid)).email
    return (await checkIp(email, await docRef.get()))
}




router.post('/match/:id', async (req, res) => {
    try {
        const uid = req.body.uid

        let docRef = db.collection('Document').doc(req.params.id)
        let doc = await docRef.get()
        if (!doc.exists){
            res.send("Document not found")
        }
        if(!uid){
            let returnId = await doc.get('id')
            res.send(await getDocData(returnId))
        }
        const currentView = doc.get('views')
        let updatedIpsList = await savedViewed(uid, docRef)

        if (updatedIpsList != null){
            console.log([updatedIpsList, currentView])
            docRef.update({emails: updatedIpsList, views: currentView + 1})
            let type = await doc.get('type')
            if ( type == "google"){
                console.log("WHAT")
                let returnId = await doc.get('id')
                res.send([await getDocData(returnId), "google"])
            }
            else {
                let path = await doc.get('id')
                let name = path.split('/')[2]
                storage.file(path).download({
                    destination: `src/doc/${name}`
                }).then(() => {
                    console.log("File transfer done")
                    textract.fromFileWithPath(`src/doc/${name}`,
                    (error, text) => {
                        if (error){
                            console.log(error)
                        }
                        else {
                            fs.unlink(`src/doc/${name}`,(err) => {
                                if (error) console.log(error);
                                else console.log(`File at src/doc/${name} was deleted`)
                            })
                            res.send([text, "office"])
                        }
                    })
                })
            }
        }

        else {
            let type = await doc.get('type')
            if ( type == "google"){
                console.log("WHAT")
                let returnId = await doc.get('id')
                res.send([await getDocData(returnId), "google"])
            }
            else {
                let path = await doc.get('id')
                let name = path.split('/')[2]
                storage.file(path).download({
                    destination: `src/doc/${name}`
                }).then(() => {
                    console.log("File transfer done")
                    textract.fromFileWithPath(`src/doc/${name}`,
                    (error, text) => {
                        if (error){
                            console.log(error)
                        }
                        else {
                            fs.unlink(`src/doc/${name}`,(err) => {
                                if (error) console.log(error);
                                else console.log(`File at src/doc/${name} was deleted`)
                            })
                            res.send([text, "office"])
                        }
                    })
                })
            }
        }
    }
        
    catch(e){
        console.log(e)
    }
})

module.exports = router