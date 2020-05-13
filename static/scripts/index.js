const {ipcRenderer, dialog} = require('electron')
const fs = require('fs')

ipcRenderer.on('open', (event, args) => {
    fs.readFile(args['filepath'], (err, data) => {
        if(err) throw err
        document.getElementById('content').innerText = data.toString()
    })
})

ipcRenderer.on('save', (event, args) => {
    let data = document.getElementById('content').innerText
    fs.writeFile(args['filepath'], data, (err) => {
        if(err) throw err;
        if(!args['new']) {
            ipcRenderer.send('save_done', {})
        }
    })
})

document.getElementById('content').addEventListener('paste', (event) => {
    event.preventDefault()
    var text = event.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
})