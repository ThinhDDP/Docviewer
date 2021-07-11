const functions = require('firebase-functions')
const express = require('express')
const admin = require('firebase-admin')

require('dotenv')
const cors = require('cors')
const bodyParser = require('body-parser')

admin.initializeApp({
    credential: admin.credential.applicationDefault()
})

const create = require('./create/restful/create')


const app = express()

app.use(cors({ origin: true }))
app.use(bodyParser.json())

app.use('/', create)



exports.api = functions
                .region('asia-east2')
                .https.onRequest(app)