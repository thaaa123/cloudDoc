const { app, Menu, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const template = require('./src/menuTemplate')
const AppWindow = require('./src/AppWindow')
const path = require('path')

let mainWindow, settingWindow;

app.on('ready', () => {

    const urlLocation = isDev ? 'http://localhost:3000/' : `file://${path.join(__dirname, './index.html')}`;
    mainWindow = new AppWindow({
        width: 1024,
        height: 680,
    }, urlLocation)

    mainWindow.on('closed', () => {
        mainWindow = null
    })

    ipcMain.on('open-settings-window', () => {
        const settingFileLocation = `file://${path.join(__dirname, './settings/settings.html')}`
        settingWindow = new AppWindow({
            width: 500,
            height: 400,
            parent: mainWindow,
        }, settingFileLocation)

        settingWindow.on('closed', () => {
            settingWindow = null
        })
    })

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
})
