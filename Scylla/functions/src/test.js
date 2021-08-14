const textract = require('textract')

textract.fromFileWithPath('doc/500.docx',
(error, text) => {
    if (error){
        console.log(error)
    }
    else {
        console.log(text)
        // res.send([text, "office"])
    }
})