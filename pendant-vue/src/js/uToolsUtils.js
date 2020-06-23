import store from '../store/index'
const pre = 'xiaou-gj-'
// 更新兼容
// 同步用户
// 普通用户
const comKey = ['live2d']

function uToolsUtils () {}
uToolsUtils.save = (...keys) => {
  keys.map((key) => {
    const data = store.state[key]
    update(key, data)
  })
}
uToolsUtils.readAll = () => {
  console.log('load....')
  uToolsUtils.read(...comKey)
}
uToolsUtils.read = (...keys) => {
  keys.map((key) => {
    const data = read(key)
    console.log(key)
    console.log(data)
    if (data) {
      store.state[key] = data
    }
  })
}
/**
 * 删除 key
 */
// eslint-disable-next-line no-unused-vars
function deleteItem (key) {
  // eslint-disable-next-line no-undef
  utools.db.remove(`${pre}${key}`)
}
/**
 * 获得 数据
 */
function read (key, onlyData = true) {
  // eslint-disable-next-line no-undef
  const data = utools.db.get(`${pre}${key}`)
  console.log(data)
  if (!data) {
    return false
  }
  if (onlyData) {
    return data.data
  } else {
    return data
  }
}
/**
 * 更新数据
 */
function update (key, data) {
  const readData = read(key, false)
  let res
  if (!readData) {
    // eslint-disable-next-line no-undef
    res = utools.db.put({
      _id: `${pre}${key}`,
      data: data,
      _rev: readData._rev
    })
  } else {
    // eslint-disable-next-line no-undef
    res = utools.db.put({
      _id: `${pre}${key}`,
      data: data,
      _rev: readData._rev
    })
  }
  console.log('update' + res.toString())
}

uToolsUtils.saveALL = () => {
  // store.state.setting.volume = store.state.player.player.volume
  // this.setting.volume = this.player.player.volume
  console.log('保存')
  uToolsUtils.save(...comKey)
}
uToolsUtils.isNewVersion = () => {
  // 当前版本
  const pluginInfo = window.pluginInfo
  // utools 自动更新数据处理
  let version = read('version')
  console.log('version', version)
  if (version !== pluginInfo.version) {
    version = pluginInfo.version
    // 是否需要更新数据
    // if (window.pluginInfo.update) {
    //   console.log('更新数据')
    //   uToolsUtils.save(...updateKey)
    // }
    update('version', version)
    // 打开更新信息窗口
    window.createUpdateWindow()
    return true
  } else {
    console.log('false')
    return false
  }
}
export default uToolsUtils
