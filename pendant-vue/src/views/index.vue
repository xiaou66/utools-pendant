<template>
  <div style="padding: 10px 20px">
    <template>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="挂件名"
          >
        </el-table-column>
        <el-table-column
          prop="desc"
          label="描述"
          >
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="enterHandle( scope.row)">进入</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import uToolsUtils from '../js/uToolsUtils'
export default {
  data () {
    return {
      tableData: [{
        name: 'live2d',
        address: 'live2d',
        desc: 'live2d 挂件',
        router: { name: 'live2d' }
      }]
    }
  },
  computed: {
    ...mapState(['live2d'])
  },
  created () {
    // eslint-disable-next-line no-undef
    utools.onPluginReady(() => {
      console.log('插件装配完成，已准备好')
      // 开启 websocket 服务
      uToolsUtils.isNewVersion()
      window.startService()
      uToolsUtils.readAll()
    })
    // eslint-disable-next-line no-undef
    utools.onPluginOut(() => {
      console.log('用户退出插件')
      uToolsUtils.saveALL()
    })
    window.hasPermissions = (msgObj) => {
      const index = this.live2d.data.findIndex(i => i.code === msgObj.code)
      console.log(index)
      if (index !== -1) {
        console.log('-----------------')
        const newData = [...this.live2d.data]
        newData[index] = { ...newData[index], ...msgObj }
        console.log(this.live2d.data[index])
        this.live2d.data = newData
        console.log(this.live2d.data[index])
        return this.live2d.data[index].switch
      } else {
        msgObj.switch = false
        msgObj.status = false
        this.live2d.data.push(msgObj)
        console.log(msgObj)
        return false
      }
    }
  },
  methods: {
    enterHandle (item) {
      this.$router.push(item.router)
    }
  }
}
</script>
