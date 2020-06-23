const {
    remote,
    app
} = require('electron')
// 歌词默认 600*60
const win = remote.getCurrentWindow()
const wsCommand = 'xiaou-'
// 开启调试工具
remote.getCurrentWebContents().openDevTools()