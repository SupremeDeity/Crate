const {ipcRenderer, dialog} = require('electron')
const fs = require('fs')
const loader = require('monaco-loader')

let g_editor
let g_monaco

ipcRenderer.on('open', (event, args) => {
    fs.readFile(args['filepath'], (err, data) => {
        if(err) throw err
        let extension = args['filepath'].split('.').pop();
        const model = g_monaco.editor.createModel(
            data.toString(),
            undefined, // language
            g_monaco.Uri.file(args['filepath'])
          )
          
          g_editor.setModel(model)
    })
})

ipcRenderer.on('save', (event, args) => {
    const model = g_editor.getModel();
    let data = '';

    for(let x = 1; x <= model.getLineCount(); x++) {
        data += model.getLineContent(x) + model.getEOL()
    }

    fs.writeFile(args['filepath'], data, (err) => {
        if(err) throw err;
        if(!args['new']) {
            ipcRenderer.send('save_done', {})
        }
    })
})

console.log('Load')
loader().then((monaco) => {
    g_editor = monaco.editor.create(document.getElementById('container'), {
        language: "plaintext",
        theme: 'vs-dark',
        automaticLayout: true
    })
    g_monaco = monaco
})