<template>
  <div style="padding: 10px 20px">
    <el-row type="flex" justify="space-between">
      <el-col :span="4">
        <el-button size="mini" @click="$router.back()">返回</el-button>
      </el-col>
      <el-col :span="5">
        <el-button size="mini" @click="createDefaultLive2d">启动默认 live2d 窗口</el-button>
      </el-col>
    </el-row>
    <el-table
      :data="live2d.data"
      style="width: 100%">
      <el-table-column
        label="序号"
        width="90"
        type="index">
      </el-table-column>
      <el-table-column
        label="live2d 模式"
        width="180">
        <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.mode === 'none'">不创建</el-tag>
          <el-tag type="success" v-else>创建</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="作者"
        width="150">
        <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.author }}</el-tag>
            </div>
        </template>
      </el-table-column>
      <el-table-column
        label="描述"
        width="160">
        <template slot-scope="scope">
          <span>{{scope.row.desc}}</span>
        </template>
      </el-table-column>
      <el-table-column label="开关" >
        <template slot-scope="scope">
          <el-switch
            v-model="live2d.data[scope.$index].switch"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="deleteHandle(scope.$index, scope.row)" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import uToolsUtils from '../js/uToolsUtils'
export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapState(['live2d'])
  },
  created () {
  },
  methods: {
    createDefaultLive2d () {
      window.createDefaultLive2d()
    },
    deleteHandle (index, item) {
      this.live2d.data.splice(index, 1)
      uToolsUtils.saveALL()
    }
  }
}
</script>
