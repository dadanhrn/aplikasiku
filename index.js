const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')

app.whenReady().then(() => {
    const win = new BrowserWindow({
        width : 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    win.loadFile('index.html')
})

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        app.quit()
    }
})

ipcMain.on('open', (ev) => {
    dialog.showOpenDialog({
        title: 'Buka file',
        buttonLabel: 'OK',
        properties: ['openFile', 'promptToCreate']
    })
    .then(result => {
        if (!result.canceled && result.filePaths.length > 0) {
            let path = result.filePaths[0]
            let content = fs.readFileSync(path).toString()
            ev.reply('open', result.filePaths[0], content)
        }
    })
    .catch(err => {
        console.log(err)
        dialog.showMessageBox({
            message: err.message,
            type: 'error'
        })
    })
})

ipcMain.on('save', (ev, path, content) => {
    if (path === '') {
        path = dialog.showSaveDialogSync({
            title: 'Simpan sebagai file',
            buttonLabel: 'Simpan'
        })

        if (path === undefined) {
            return
        }
    }

    fs.writeFile(path, content, (err) => {
        if (err) {
            console.log(err)
            dialog.showMessageBox({
                message: err.message,
                type: 'error'
            })
        } else {
            dialog.showMessageBox({
                message: 'Sukses menyimpan file',
                type: 'info'
            })
            ev.reply('open', path, content)
        }
    })
})