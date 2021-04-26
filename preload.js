const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('aplikasiku', {
    open: display => {
        ipcRenderer.send('open')
        ipcRenderer.once('open', (ev, path, content) => {
            display(path, content)
        })
    },
    save: (path, content) => {
        ipcRenderer.send('save', path, content)
    }
})