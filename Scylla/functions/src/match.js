const express = require('express')
const admin = require('firebase-admin')
const parseGoogleDocsJson = require("parse-google-docs-json");
require('dotenv').config()
const textract = require('textract')
const db = admin.firestore()
const router = express.Router()
const storage = admin.storage().bucket()
const fs = require('fs')

const checkIp =  async (email, doc) => {
    let emailsList = await doc.get('emails')
    console.log(emailsList)
    if (!emailsList.includes(email)){
        emailsList.push(email)
        return emailsList
    }
    return null
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

const getDocData = async(id) => {
    console.log(process.env.CLIENT_KEY)
    const parsed = await parseGoogleDocsJson({
        documentId:id,
        clientEmail: 'backend-account@docviewerapi.iam.gserviceaccount.com',
        privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC+xURGxZM4p6BK\nXiNfRlZNGzkKJFKS6rLmh1VtxCdyZ+cZZ3QA4n9qpcCuj3FYdlaGB6adfX2u3iR/\nCRb+QSFjr9E0jRxcHKGlKqWkNPwfTL9HeJct5mOrBuLd/wf5fsDfT1Dd93IIasEE\nKk51qdAGLBp6tbyAgasn8l8/+z4+x0twe690K5PM9TfQskzhAkGM0SkwkUCDRq0i\ndeBrLCcWJEIfB6mJOoa/JpPQNyjbnN4dOupf0s7GGVSmvuuYZaBw6tuhYqIU+7NN\nruBUEiV3ZDKINgcsxzU+yfygiUp4EHxnv2maLL/SpTNkOaKDXQLK12/tIYXf8Ca0\nKn6lPcwVAgMBAAECggEAHPJRUxzJIzxaJ9ajbuI9F5uVGtsalXTb2vt3hL2SD7vA\n1vu54CV+GHhYpZQZ6oagR9uS1kxTnQxThNwj+0X2M0pbB+qOflKQ238+XY11oSkz\nz/w2Ek6mWm3j0DQRqXOof+no1xlkGe9a5M8nkxaGfF1GUk7PsL8cMaZG+i4dCojP\nX7S8d+Fqh6PsfCMD0BtYxopNE/EQLq+LZQGjtSE4KtMqxIuesjyRgOIz3CI1n+fw\nVblZdTBNU9f3/EgNefJWAnZ9uyKWqkmfdxZ7uyCE/ilevOwbKWyuigm+d3QZemzo\nygHkzlXdM9Wjh0XXeU46kU2gH+7kGlB4DxLmZ9tGsQKBgQDnnpkRqkBfRp3Czoge\n+Wv26EFUUXWVtl6moUHilo4qxUf0gNKtwuTwjT2tU5cgRNKOMhSmU6vpn0/dqKTC\nHjZKQW23y/c61dnour858VoUZoM0YhfYZV/DvotBVlIuPGifOCpv1xtdAm/7V6zP\n18l3c71XXYqhzL65z1HGpp/mJQKBgQDS2eu5nvSwAjA/F/Gb9iQTuNBHAxS9Lmq+\nFJceLUEC/R1eGEXTj4UBq0DDXS8fTFuR+ooTP+i2E2NWloJgxj4WvUVwWmBo1ubl\ngLEVwXSE3lXC81lo87m/D353S9KSGwQNbm4WokXRcOPhHzK7yxZvHjrCh+4pGDEg\nSwEcX/YTMQKBgHVossT+nXTucegfE2dIHg9h+kPIqydB88bZtXErylMp/+iUKLeG\nNNEvd5VV6ySjXmxQPKF3hox9glmlNCdmczS+5+QkU2WSo8xSZb70diojMN0r4FSE\nRsAN5b8wB6aCXrJfITviOW+zXZp1/ha5ltmjZNZVh4GvLPs5eYWOTz21AoGBAKV3\nCnvCeDbfoMkCm0JPKQSpFhmEG3RSxsWgFu9BiDE2PSOoXLOnfzNOFya5K8+d9oZa\nXJy6nH62PFCpEGutZvAlXCbNZbcgXlZgZZezFyNl71tr6RBpo6yCFja8M+Ugek+o\nB5CPi8bOlqYF+6RPva05xdb/ITDyoSq8cYS48b0hAoGAO9lPYvRxwxkdMpId9nFP\npYegFbLMErkHVdK9BhRzAD0AmADsrDIQq7GJ5N6eC4kTW7gEtoYP0bvHARRkk8GW\n+cOA4l6LAHq32HgCqmkMc0JQ0uJwehkczyhFXc/r4Vtj4kUpPbti+6q87fnyac0P\nu//dsAKbtiwJ2qALzaydE18=\n-----END PRIVATE KEY-----\n'
    })
    return parsed.toMarkdown()
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