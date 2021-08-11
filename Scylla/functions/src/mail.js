const express = require('express')
const admin = require('firebase-admin')
const nodemailer = require("nodemailer");

const db = admin.firestore()
const router = express.Router()

const sendMail = async (code, emails, author) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'docviewerdemo@gmail.com',
            pass: 'Testing123!'
        }
    })
    console.log(author)
    const mailOptions = {
        from: 'docviewer@gmail.com',
        to: emails,
        subject: 'Docviewer invite code',
        html: `<h3>User ${author} has invite you to view his document</h3>
        <p>Click on the link below to view the document</p></br>
                <p><a href="localhost:3000/open?code=${code}">localhost:3000/open?code=${code}</a></p>
        `
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error){
            console.log(error)
        }
        else {
            console.log(`Email sent ${info.response}`)
        }
    })
}

router.post('/mail/:code', async (req, res) => {
    let emails = req.body.email
    let code = req.params.code
    let author = req.body.author
    sendMail(code, emails, author).then(() => {
        res.send('Done')
    }).catch((e) => {
        console.log(e)
        res.send("Unknown error has occured")
    })

})

module.exports = router