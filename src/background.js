'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import { autoUpdater } from 'electron-updater'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])
//更新配置
autoUpdater.autoDownload = false
async function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    transparent: true,
    backgroundColor: '#00000000',
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })
  //平台信息
  ipcMain.on('process', (e) => {
    e.sender.send('process', process.platform)
  })
  // 最小化
  ipcMain.on('minApp', () => {
    win.minimize()
  })
  // 退出
  ipcMain.on('closeApp', () => {
    win.close();
    app.exit()
  })
  //更新
  ipcMain.on('check-update', () => {
    autoUpdater.checkForUpdates().catch(err => {
      win.webContents.send('console', err)
    })
  })
  //立即下载更新
  ipcMain.on('updateNow', () => {
    autoUpdater.downloadUpdate().catch((err) => {
      win.webContents.send('console', err)
    })
  })
  //立即下载更新
  ipcMain.on('installNow', () => {
    autoUpdater.quitAndInstall()
  })
  autoUpdater.on('update-available', (info) => {
    win.webContents.send('console', info)
    win.webContents.send('update-available', info)
  })
  autoUpdater.on('download-progress', (progressObj) => {
    win.webContents.send('download-progress', progressObj)
  })
  autoUpdater.on('error', (error) => {
    win.webContents.send('console', error)
  })
  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName, releaseDate, updateUrl) => {
    win.webContents.send('update-downloaded', {
      event,
      releaseNotes,
      releaseName,
      releaseDate,
      updateUrl
    })

  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    win.loadURL('app://./index.html')
  }
  win.once('ready-to-show', () => {
    win.show()
  })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('ready', async () => {
  createWindow()
})

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
