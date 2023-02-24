<template>
  <div class="createPost-container">
    <el-container>
      <el-main>
        <aside>设定范围</aside>
        <el-form ref="branchForm" :model="branchData" :rules="branchRules">
          <el-row>
            <el-col :span="23">
              <el-form-item label="设定网点" prop="branchList" label-width="100px" style="margin-right: 10px;">
                <el-select
                  v-model="branchData.branchList"
                  placeholder="请选择设定网点"
                  clearable
                  filterable
                  multiple
                  style="margin-left: 10px; width: 100%;"
                >
                  <el-option
                    v-for="item in branchListOptions"
                    :key="item.branch_uid"
                    :label="item.branch_name"
                    :value="item.branch_uid"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-main>
      <el-footer>
        <aside>设定项目</aside>
        <el-tabs v-model="activeTab" type="border-card">
          <el-tab-pane label="状态管理" name="状态管理">
            <el-form ref="branchStatusForm" :model="branchStatusData" :rules="branchStatusRules" label-width="100px">
              <el-form-item label="下拉选择" prop="branchStatus">
                <el-select
                  v-model="branchStatusData.branchStatus"
                  placeholder="请选择下拉选择"
                  clearable
                  :style="{width: '100%'}"
                >
                  <el-option
                    v-for="(item, index) in branchStatusOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item size="large">
                <el-button type="primary" @click="submitBranchStatus">设定</el-button>
                <el-button @click="resetBranchStatus">重置</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { getBranchOptions } from '@/api/finance'
import { setBranchSettings } from '@/api/branch'

export default {
  name: 'BatchSetting',
  data() {
    return {
      // --== 组件状态 ==--
      activeTab: '状态管理',
      loadingStatus: false,

      // --== 表单数据 ==--

      // 网点选择表单
      branchData: {
        branchList: undefined
      },
      branchRules: {
        branchList: [{
          required: true,
          message: '请选择至少一个网点',
          trigger: 'change'
        }]
      },
      branchListOptions: [],

      // 网点状态表单
      branchStatusData: {
        branchStatus: undefined
      },
      branchStatusRules: {
        branchStatus: [{
          required: true,
          message: '请选择网点状态',
          trigger: 'change'
        }]
      },
      branchStatusOptions: [{
        'label': '正常营业',
        'value': '正常营业'
      }, {
        'label': '冬季营业',
        'value': '冬季营业'
      },
      {
        'label': '内部测试',
        'value': '内部测试'
      }, {
        'label': '停止营业',
        'value': '停止营业'
      }]
    }
  },
  created() {
    // 获取网点列表选项
    this.getBranchOptions()
  },
  methods: {
    // 获取网点列表
    getBranchOptions() {
      getBranchOptions().then(res => {
        this.branchListOptions = res.data
      })
    },

    // 设定网点状态
    submitBranchStatus() {
      this.$refs['branchStatusForm'].validate(valid => {
        if (!valid) {
          this.$notify({ title: '格式错误', message: '请检查信息格式是否正确', type: 'error', duration: 2000 })
        } else {
          if (this.branchData.branchList.length > 0) {
            this.loadingStatus = true
            const branchSettings = Object.assign({}, this.branchData)
            branchSettings.branchStatus = this.branchStatusData.branchStatus
            console.log(branchSettings)

            setBranchSettings(branchSettings)
              .then(() => {
                this.loadingStatus = false
                this.$notify({ title: '设定成功', message: '网点状态已更新', type: 'success', duration: 2000 })
              })
              .catch(() => { this.loadingStatus = false })
          }
        }
      })
    },
    resetBranchStatus() {
      this.$refs['branchStatusForm'].resetFields()
    }
  }
}
</script>
