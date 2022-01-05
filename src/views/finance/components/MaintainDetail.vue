<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <!-- 吸顶按钮组 -->
      <sticky :z-index="10" :class-name="'sub-navbar '+'published'">
        <el-button
          v-loading="loading"
          style="margin-left: 10px;"
          icon="el-icon-success"
          type="success"
          @click="submitForm"
        >
          {{ isEdit ? '更新' : '添加' }}
        </el-button>
      </sticky>

      <!-- 表单项目 -->
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <aside>基本信息</aside>
            <el-row>
              <el-col :span="6">
                <el-form-item label="立项号" prop="maintain_uid" label-width="100px" style="margin-bottom: 20px; margin-right: 10px;">
                  <el-input v-model="postForm.maintain_uid" placeholder="系统自动生成" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="网点" prop="branch_name" label-width="100px" style="margin-bottom: 20px; margin-right: 10px;">
                  <el-select v-model="postForm.branch_name" placeholder="请选择">
                    <el-option
                      v-for="item in branchOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="设备" prop="machine_name" label-width="100px" style="margin-bottom: 20px; margin-right: 10px;">
                  <el-select v-model="postForm.machine_name" placeholder="请选择">
                    <el-option
                      v-for="item in machineOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="维护人" prop="maintainer_name" label-width="100px" style="margin-bottom: 20px; margin-right: 10px;">
                  <el-select v-model="postForm.maintainer_name" placeholder="请选择">
                    <el-option
                      v-for="item in maintainerOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="维护时间" prop="maintain_time" label-width="100px" style="margin-bottom: 20px; margin-right: 10px;">
                  <el-date-picker
                    v-model="postForm.maintain_time"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="date"
                    placeholder="选择日期"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <aside>费用信息</aside>
            <el-row>
              <el-col :span="6">
                <el-form-item label="人工" prop="cost_labour" label-width="100px" style="margin-bottom: 20px; margin-right: 10px;">
                  <el-input v-model="postForm.cost_labour" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="枪头" prop="cost_nozzle" label-width="100px" style="margin-bottom: 20px; margin-right: 10px;">
                  <el-input v-model="postForm.cost_nozzle" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="软管" prop="cost_tube" label-width="100px" style="margin-bottom: 20px; margin-right: 10px;">
                  <el-input v-model="postForm.cost_tube" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="水泵" prop="cost_pump" label-width="100px" style="margin-bottom: 20px; margin-right: 10px;">
                  <el-input v-model="postForm.cost_pump" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="吸尘器" prop="cost_hoover" label-width="100px" style="margin-bottom: 20px; margin-right: 10px;">
                  <el-input v-model="postForm.cost_hoover" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="按键" prop="cost_button" label-width="100px" style="margin-bottom: 20px; margin-right: 10px;">
                  <el-input v-model="postForm.cost_button" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="面板" prop="cost_panel" label-width="100px" style="margin-bottom: 20px; margin-right: 10px;">
                  <el-input v-model="postForm.cost_panel" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="其他" prop="cost_other_maintain" label-width="100px" style="margin-bottom: 20px; margin-right: 10px;">
                  <el-input v-model="postForm.cost_other_maintain" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky' // 粘性header组件
import { createMaintain, updateMaintain, getMaintainById, getMaintainOptions } from '@/api/finance'

const defaultForm = {
  maintain_uid: '',
  branch_name: '',
  machine_name: '',
  maintainer_name: '',
  maintain_time: '',
  cost_labour: '',
  cost_nozzle: '',
  cost_tube: '',
  cost_pump: '',
  cost_hoover: '',
  cost_button: '',
  cost_panel: '',
  cost_other_maintain: ''
}

export default {
  name: 'MaintainDetail',
  components: { Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    /**
     * 表单验证函数
     * @param rule
     * @param value
     * @param callback
     */
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('此为必填项, 不可为空'))
      } else {
        callback()
      }
    }

    /**
     * 定义组件数据
     */
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,

      /**
       * 表单项验证规则
       */
      rules: {
        branch_name: [{ validator: validateRequire }],
        machine_name: [{ validator: validateRequire }],
        maintainer_name: [{ validator: validateRequire }],
        maintain_time: [{ validator: validateRequire }],
        cost_labour: [{ validator: validateRequire }],
        cost_nozzle: [{ validator: validateRequire }],
        cost_tube: [{ validator: validateRequire }],
        cost_pump: [{ validator: validateRequire }],
        cost_hoover: [{ validator: validateRequire }],
        cost_button: [{ validator: validateRequire }],
        cost_panel: [{ validator: validateRequire }],
        cost_other_maintain: [{ validator: validateRequire }]
      },

      /**
       * 表单项的下拉菜单选项
       */
      branchOptions: [],
      machineOptions: [],
      maintainerOptions: []
    }
  },
  computed: {},
  created() {
    if (this.isEdit) {
      const maintain_uid = this.$route.params && this.$route.params.maintain_uid
      this.getData(maintain_uid)
    }
  },
  mounted() {
    // 数据库获取 operation 部分下拉形式表单项的数据
    this.setOptions()
  },
  methods: {
    getData(maintain_uid) {
      getMaintainById(maintain_uid).then(response => {
        this.setData(response.data)
      })
    },
    setData(data) {
      this.postForm = {
        maintain_uid: data.maintain_uid,
        branch_name: data.branch_name,
        machine_name: data.machine_name,
        maintainer_name: data.maintainer_name,
        maintain_time: data.maintain_time,
        cost_labour: data.cost_labour,
        cost_nozzle: data.cost_nozzle,
        cost_tube: data.cost_tube,
        cost_pump: data.cost_pump,
        cost_hoover: data.cost_hoover,
        cost_button: data.cost_button,
        cost_panel: data.cost_panel,
        cost_other_maintain: data.cost_other_maintain
      }
    },
    setOptions() {
      getMaintainOptions().then(result => {
        [this.branchOptions, this.machineOptions, this.maintainerOptions] = result.data
      })
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          const machine_maintain = Object.assign({}, this.postForm)

          /**
           * 判断是 添加数据 还是 更新数据
           */
          if (!this.isEdit) {
            createMaintain(machine_maintain).then(() => {
              this.loading = false
              this.$notify({
                title: '创建成功',
                message: '添入数据库',
                type: 'success',
                duration: 2000
              })
            }).catch(() => {
              this.loading = false
            })
          } else {
            updateMaintain(machine_maintain).then(() => {
              this.loading = false
              this.$notify({
                title: '更新成功',
                message: '更新入数据库',
                type: 'success',
                duration: 2000
              })
            }).catch(() => {
              this.loading = false
            })
          }
        } else {
          this.$notify({
            title: '格式错误',
            message: '请检查信息格式是否正确',
            type: 'error',
            duration: 2000
          })
          return false
        }
      })
    }
  }
}
</script>

