const parseGoogleDocsJson = require("parse-google-docs-json");
require('dotenv').config()

console.log(process.env.CLIENT_KEY)
const getDocData = async(id) => {
    const parsed = await parseGoogleDocsJson({
        documentId:"1vtgCZ_6Dm09p5LNyaeU-8a_Z976yBMoPQLjAiU4TL68",
        clientEmail: 'backend-account@docviewerapi.iam.gserviceaccount.com',
        privateKey: process.env.CLIENT_KEY
    })
    console.log(parsed.toJson())
    console.log(parsed.toMarkdown())
}

getDocData()