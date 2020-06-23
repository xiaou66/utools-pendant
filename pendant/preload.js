const WebSocket = require('faye-websocket');
const http = require('http');
const fs = require('fs')
const path = require('path')
window.pluginInfo = JSON.parse(fs.readFileSync(path.join(__dirname, 'plugin.json')));
console.log(window.pluginInfo);
window.services = {}
window.startService = () => {
    const server = http.createServer();
    server.on('upgrade', function (request, socket, body) {
        if (WebSocket.isWebSocket(request)) {
            var ws = new WebSocket(request, socket, body);
            console.log("request come...");
            console.log(socket);
            ws.on('message', function (event) {
                console.log(event.data);
                const msgObj = JSON.parse(event.data)
                console.log('收到', msgObj);
                if (msgObj.type === 'register') {
                    // 注册
                    const res = {
                        status: 200,
                        type: 'register',
                        message: 'ok'
                    }
                    // 获取当前是否注册,用户是否允许操作
                    if (window.hasPermissions(msgObj)) {
                        // 判断是否已经存在窗口
                        if (window.services[msgObj.code]) {
                            const res = {
                                status: 403,
                                type: 'register',
                                message: '已经创建过了'
                            }
                            ws.send(JSON.stringify(res))
                            return
                        }
                        // 判断是否创建 live2d 窗口
                        if (msgObj.mode !== 'none') {
                            // 创建 live2d 窗口
                            window.createLive2dWindow(msgObj)
                            window.services[msgObj.code] = { outWs: ws, default: false }
                        } else {
                            // 使用默认live2d
                            if (window.services['default']) {
                                window.services[msgObj.code] = { ws: window.services['default'].ws, outWs: ws, default: true }
                                ws.send(JSON.stringify(res))
                            } else {
                                // 默认live2d没有开启
                                const res = {
                                    status: 403,
                                    type: 'register',
                                    message: '默认live2d没有开启'
                                }
                                ws.send(JSON.stringify(res))
                            }
                        }
                    } else {
                        // 用户没有给与权限
                        res.status = 403
                        res.message = '需要用户在 live2D 控制面板打开这项功能'
                        ws.send(JSON.stringify(res))
                    }
                } else if (msgObj.type === 'message') {
                    if (!window.services[msgObj.code]) {
                        ws.send(JSON.stringify({
                            type: 'err',
                            message: '连接已经挂了，请重新申请'
                        }))
                        return
                    }
                    // 消息
                    if (window.services[msgObj.code].ws && window.services[msgObj.code].outWs) {
                        // 当需要的 ws 链接存在时
                        window.services[msgObj.code].ws.send(JSON.stringify(msgObj))
                    }

                } else if (msgObj.type === 'notice') {
                    // 通知
                    if (window.services[msgObj.code].ws && window.services[msgObj.code].outWs) {
                        // 当需要的 ws 链接存在时
                        const outWs = window.services[msgObj.code].outWs
                        msgObj.code = 200
                        outWs.send(JSON.stringify(msgObj))
                    }
                } else if (msgObj.type === 'death') {
                    // 死亡包
                    const ws = window.services[msgObj.code].ws
                    ws.send(JSON.stringify({
                        type: 'death'
                    }))
                    try {
                        window.services[msgObj.code].ws.close()
                    } catch (e) {
                        console.log(e);
                    }
                    delete window.services[msgObj.code]
                } else if (msgObj.type === 'love2d-death') {
                    // love2d 死亡包
                    try {
                        window.services[msgObj.code].ws.close()
                    } catch (e) {
                        console.log(e);
                    }
                    if (msgObj.code === 'default') {
                        delete window.services[msgObj.code]
                        scanWsServers()
                        return
                    }
                    const outWs = window.services[msgObj.code]?.outWs
                    if (outWs) {
                        outWs.send(JSON.stringify({
                            type: 'death'
                        }))
                    }
                    delete window.services[msgObj.code]
                }
                // 窗体
                if (msgObj.live2dWindow) {
                    console.log(ws);
                    window.services[msgObj.code] = { ...window.services[msgObj.code], ws: ws }
                    console.log(window.services)
                    return
                }
            });
            ws.on('close', function (event) {
                scanWsServers()
            });
        }
    });
    server.listen(44446);
    console.log('service start');
}
// 循环判断 ws 链接
const scanWsServers = () => {
    for (const key in window.services) {
        const item = window.services[key]
        if (!item.outWs) {
            continue
        }
        try {
            if (item.ws.readyState === 3) {
                throw 'close'
            }
            if (item.outWs.readyState !== 3) {
                outWs.send(JSON.stringify({
                    type: 'death'
                }))
            }
        } catch (e) {
            item.outWs.send(JSON.stringify({
                type: 'death'
            }))
            window.services[key].ws = undefined
        }
        try {
            if (item.outWs.readyState === 3) {
                throw 'close'
            }
        } catch (e) {
            if (!item.default) {
                item.ws.send(JSON.stringify({
                    type: 'death'
                }))
            }
            window.services[key].outWs = undefined
        }
        if (!window.services[key].outWs || !window.services[key].ws) {
            delete window.services[key]
        }
    }
}
// 创建默认 live2d 窗口
window.createDefaultLive2d = () => {
    if (window.services['default']) {
        return false
    }
    window.createLive2dWindow({
        code: 'default',
        type: 'default'
    })
    return true
}
// 创建live2d窗口
window.createLive2dWindow = (config = {
    code: 'default',
    type: 'default'
}) => {
    // const optional = {
    //     width: 800,
    //     height: 600,
    //     title: 'live2d',
    //     transparent: true,
    //     frame: false,
    //     maximizable: false,
    //     minimizable: false,
    //     // backgroundColor: '#00000000',
    //     webPreferences: {
    //         devTools: true,
    //         preload: './live2d/live2d-proload.js'
    //     },
    // }
    const optional = {
        width: 360,
        height: 440,
        title: 'live2d',
        transparent: true,
        frame: false,
        maximizable: false,
        minimizable: false,
        backgroundColor: '#00000000',
        webPreferences: {
            // devTools: true,
            preload: './live2d/live2d-proload.js'
        },
    }
    webContentsId = utools.createBrowserWindow("./live2d/index.html", optional);
    setTimeout(() => {
        require('electron').ipcRenderer.sendTo(webContentsId, 'config', config)
    }, 800)
};
// 创建更新窗口
// 创建更新窗口
window.createUpdateWindow = () => {
    const optional = {
        width: 800,
        height: 600,
        title: '更新说明',
        transparent: false,
        frame: true,
        alwaysOnTop: true,
    }
    const win = utools.createBrowserWindow("./README.html", optional);
};
// utools.onPluginReady(() => {

//     // window.createLive2dWindow()
// })