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
                <el-form-item label="立项号" prop="operation_uid" label-width="100px">
                  <el-input v-model="postForm.operation_uid" placeholder="系统自动生成" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="网点" prop="branch_name" label-width="100px">
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
                <el-form-item label="设备" prop="machine_name" label-width="100px">
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
                <el-form-item label="负责人" prop="manager_name" label-width="100px">
                  <el-select v-model="postForm.manager_name" placeholder="请选择">
                    <el-option
                      v-for="item in managerOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="创建时间" prop="operation_time" label-width="100px">
                  <el-date-picker
                    v-model="postForm.operation_time"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="date"
                    placeholder="选择日期"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <aside>人工费用</aside>
            <el-row>
              <el-col :span="6">
                <el-form-item label="人工" prop="cost_labour" label-width="80px">
                  <el-input v-model="postForm.cost_labour" placeholder="元" />
                </el-form-item>
              </el-col>
            </el-row>
            <aside>耗材费用</aside>
            <el-row>
              <el-col :span="6">
                <el-form-item label="拖把" prop="cost_mop" label-width="80px">
                  <el-input v-model="postForm.cost_mop" placeholder="元" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="水桶" prop="cost_bucket" label-width="80px">
                  <el-input v-model="postForm.cost_bucket" placeholder="元" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="毛巾" prop="cost_towel" label-width="80px">
                  <el-input v-model="postForm.cost_towel" placeholder="元" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="滤网" prop="cost_filter" label-width="80px">
                  <el-input v-model="postForm.cost_filter" placeholder="元" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="泡沫" prop="cost_foam" label-width="80px">
                  <el-input v-model="postForm.cost_foam" placeholder="元" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="其他耗材" prop="cost_other_consumable" label-width="100px">
                  <el-input v-model="postForm.cost_other_consumable" placeholder="元" />
                </el-form-item>
              </el-col>
            </el-row>
            <aside>营销费用</aside>
            <el-row>
              <el-col :span="6">
                <el-form-item label="宣传" prop="cost_promotion" label-width="80px">
                  <el-input v-model="postForm.cost_promotion" placeholder="元" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="赠品" prop="cost_freebie" label-width="80px">
                  <el-input v-model="postForm.cost_freebie" placeholder="元" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="广告" prop="cost_ad" label-width="80px">
                  <el-input v-model="postForm.cost_ad" placeholder="元" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="其他营销费" prop="cost_other_marketing" label-width="100px">
                  <el-input v-model="postForm.cost_other_marketing" placeholder="元" />
                </el-form-item>
              </el-col>
            </el-row>
            <aside>建设费用</aside>
            <el-row>
              <el-col :span="6">
                <el-form-item label="设备" prop="cost_device" label-width="80px">
                  <el-input v-model="postForm.cost_device" placeholder="元" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="施工" prop="cost_build" label-width="80px">
                  <el-input v-model="postForm.cost_build" placeholder="元" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="围挡" prop="cost_fence" label-width="80px">
                  <el-input v-model="postForm.cost_fence" placeholder="元" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="其他建设费" prop="cost_other_construction" label-width="100px">
                  <el-input v-model="postForm.cost_other_construction" placeholder="元" />
                </el-form-item>
              </el-col>
            </el-row>
            <aside>运营费用</aside>
            <el-row>
              <el-col :span="6">
                <el-form-item label="水费" prop="cost_water" label-width="80px">
                  <el-input v-model="postForm.cost_water" placeholder="元" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="电费" prop="cost_electric" label-width="80px">
                  <el-input v-model="postForm.cost_electric" placeholder="元" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="物业费" prop="cost_manage" label-width="80px">
                  <el-input v-model="postForm.cost_manage" placeholder="元" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="取暖费" prop="cost_heating" label-width="80px">
                  <el-input v-model="postForm.cost_heating" placeholder="元" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="租赁费" prop="cost_lease" label-width="80px">
                  <el-input v-model="postForm.cost_lease" placeholder="元" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="其他运营费" prop="cost_other_operation" label-width="100px">
                  <el-input v-model="postForm.cost_other_operation" placeholder="元" />
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
import { createOperation, updateOperation, getOperationById, getOperationOptions } from '@/api/finance'

const defaultForm = {
  operation_uid: '',
  branch_name: '',
  machine_name: '',
  manager_name: '',
  operation_time: '',
  cost_labour: '',
  cost_mop: '',
  cost_bucket: '',
  cost_towel: '',
  cost_filter: '',
  cost_foam: '',
  cost_other_consumable: '',
  cost_promotion: '',
  cost_freebie: '',
  cost_ad: '',
  cost_other_marketing: '',
  cost_device: '',
  cost_build: '',
  cost_fence: '',
  cost_other_construction: '',
  cost_water: '',
  cost_electric: '',
  cost_manage: '',
  cost_heating: '',
  cost_lease: '',
  cost_other_operation: ''
}

export default {
  name: 'OperationDetail',
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
        manager_name: [{ validator: validateRequire }],
        operation_time: [{ validator: validateRequire }],
        cost_labour: [{ validator: validateRequire }],
        cost_mop: [{ validator: validateRequire }],
        cost_bucket: [{ validator: validateRequire }],
        cost_towel: [{ validator: validateRequire }],
        cost_filter: [{ validator: validateRequire }],
        cost_foam: [{ validator: validateRequire }],
        cost_other_consumable: [{ validator: validateRequire }],
        cost_promotion: [{ validator: validateRequire }],
        cost_freebie: [{ validator: validateRequire }],
        cost_ad: [{ validator: validateRequire }],
        cost_other_marketing: [{ validator: validateRequire }],
        cost_device: [{ validator: validateRequire }],
        cost_build: [{ validator: validateRequire }],
        cost_fence: [{ validator: validateRequire }],
        cost_other_construction: [{ validator: validateRequire }],
        cost_water: [{ validator: validateRequire }],
        cost_electric: [{ validator: validateRequire }],
        cost_manage: [{ validator: validateRequire }],
        cost_heating: [{ validator: validateRequire }],
        cost_lease: [{ validator: validateRequire }],
        cost_other_operation: [{ validator: validateRequire }]
      },

      /**
       * 表单项的下拉菜单选项
       */
      branchOptions: [],
      machineOptions: [],
      managerOptions: []
    }
  },
  created() {
    // 数据库获取 operation 信息, 填入 form
    if (this.isEdit) {
      const operation_uid = this.$route.params && this.$route.params.operation_uid
      this.getData(operation_uid)
    }
  },
  mounted() {
    // 数据库获取 operation 部分下拉形式表单项的数据
    this.setOptions()
  },
  methods: {
    getData(operation_uid) {
      getOperationById(operation_uid).then(response => {
        console.log(response.data.operation_time)
        this.setData(response.data)
      })
    },
    setData(data) {
      this.postForm = {
        operation_uid: data.operation_uid,
        branch_name: data.branch_name,
        machine_name: data.machine_name,
        manager_name: data.manager_name,
        operation_time: data.operation_time,
        cost_labour: data.cost_labour,
        cost_mop: data.cost_mop,
        cost_bucket: data.cost_bucket,
        cost_towel: data.cost_towel,
        cost_filter: data.cost_filter,
        cost_foam: data.cost_foam,
        cost_other_consumable: data.cost_other_consumable,
        cost_promotion: data.cost_promotion,
        cost_freebie: data.cost_freebie,
        cost_ad: data.cost_ad,
        cost_other_marketing: data.cost_other_marketing,
        cost_device: data.cost_device,
        cost_build: data.cost_build,
        cost_fence: data.cost_fence,
        cost_other_construction: data.cost_other_construction,
        cost_water: data.cost_water,
        cost_electric: data.cost_electric,
        cost_manage: data.cost_manage,
        cost_heating: data.cost_heating,
        cost_lease: data.cost_lease,
        cost_other_operation: data.cost_other_operation
      }
    },
    setOptions() {
      getOperationOptions().then(result => {
        [this.branchOptions, this.machineOptions, this.managerOptions] = result.data
      })
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          const machine_operation = Object.assign({}, this.postForm)

          /**
           * 判断是 添加数据 还是 更新数据
           */
          if (!this.isEdit) {
            createOperation(machine_operation).then(() => {
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
            updateOperation(machine_operation).then(() => {
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

