
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
const owned = require('./src/owned')
const app = express()

app.use(cors({ origin: true }))
app.use(bodyParser.json())

app.use('/', create)
app.use('/', match)
app.use('/', update)
app.use('/', user)
app.use('/', track)
app.use('/', viewed)
app.use('/', owned)

app.listen((process.env.PORT || 5000), () => {
    console.log("Server setup")
})