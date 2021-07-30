const functions = require('firebase-functions')
const express = require('express')
const admin = require('firebase-admin')

require('dotenv')
const cors = require('cors')
const bodyParser = require('body-parser')

admin.initializeApp({
    credential: admin.credential.applicationDefault()
})

const create = require('./src/create')
const match = require('./src/match')
const user = require('./src/user')
const update = require('./src/update')
const track = require('./src/track')
const viewed = require('./src/viewed')
const app = express()

app.use(cors({ origin: true }))
app.use(bodyParser.json())

app.use('/', create)
app.use('/', match)
app.use('/', update)
app.use('/', user)
app.use('/', track)
app.use('/', viewed)


exports.api = functions
                .region('asia-east2')
                .https.onRequest(app)