const {app, BrowserWindow, Menu, dialog, ipcMain} = require('electron')
const path = require('path')

app.on('ready', () => {
    const modalPath = path.join('file://', __dirname, 'static/index.html')
    let win = new BrowserWindow({width: 800, height: 600, webPreferences: {
        nodeIntegration: true
    }})
    win.loadURL(modalPath)
    win.show()

    let filepath = null
    let menu = Menu.buildFromTemplate([
        {
            "label": "File",
            "submenu": [
                {
                    "label": 'Open',
                    "accelerator": "Ctrl+O",
                    click: () => {
                        dialog.showOpenDialog({properties: ['openfile']}).then(result => {
                            filepath = result.filePaths[0]
                            win.webContents.send('open', {"filepath" : result.filePaths[0]})
                        })
                    }
                },
                {
                    "label": "New",
                    "accelerator": "Ctrl+N",
                    click: () => {
                        dialog.showSaveDialog().then(result => {
                            win.webContents.send('save', {"filepath": result.filePath, "new": true})
                            filepath = result.filePath
                            win.webContents.send('open', {"filepath" : result.filePath})
                        })
                    }
                },
                {
                    'role': 'toggleDevTools'
                },
                {
                    "type": "separator"
                },
                {
                    "label": "Save",
                    "accelerator": "Ctrl+S",
                    click: () => {
                        if (filepath) {
                            win.webContents.send('save', {"filepath": filepath, "new": false})
                            filepath = null
                        }
                        else {
                            dialog.showSaveDialog().then(result => {
                                win.webContents.send('save', {"filepath": result.filePath, "new": false})
                            })
                        }
                    }
                },
                {
                    "label": "Save As",
                    "accelerator": "Ctrl+Shift+S",
                    click: () => {
                        dialog.showSaveDialog().then(result => {
                            win.webContents.send('save', {"filepath": result.filePath, "new": false})
                        })
                    }
                },
                {
                "type": "separator"
                },
                {
                    "label": "Exit",
                    click() {
                        app.exit()
                    }
                }
            ]
        },
        {
            "label": "Edit",
            "submenu": [
                {
                    "role": "undo"
                },
                {
                    "role": "redo"
                },
                {
                    "type": "separator"
                },
                {
                    "role": "cut"
                },
                {
                    "role": "copy"
                },
                {
                    "role": "paste"
                }
            ]
        }
    ])
    win.setMenu(menu)

    ipcMain.on('save_done', (event, args) => {
        dialog.showMessageBox({"type": "info", "buttons": ['Ok'], "message": "File Saved!", "title": "Crate" })
    })
})
