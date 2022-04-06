<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <!-- 吸顶按钮组 -->
      <sticky :z-index="10" :class-name="'sub-navbar '+'published'">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          {{ isEdit ? '更新记录' : '添加洗车机' }}
        </el-button>
      </sticky>
      <!-- 各表单项 -->
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <!-- 第 1 行 -->
            <el-row>
              <el-col :span="12">
                <el-form-item style="margin-bottom: 40px; margin-right: 40px;" prop="machine_uid">
                  <MDinput v-model="postForm.machine_uid" :maxlength="100" name="machine_uid" required>
                    洗车机编号
                  </MDinput>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item style="margin-bottom: 40px;" prop="machine_name">
                  <MDinput v-model="postForm.machine_name" :maxlength="100" name="machine_name" required>
                    洗车机名称
                  </MDinput>
                </el-form-item>
              </el-col>
            </el-row>
            <div class="postInfo-container">
              <!-- 第 2 行 -->
              <el-row>
                <el-col :span="12">
                  <el-form-item label-width="60px" prop="branch_name" label="网点" class="postInfo-container-item">
                    <el-select v-model="postForm.branch_name" placeholder="请选择" style="width:100%">
                      <el-option
                        v-for="item in branchOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label-width="60px" prop="machine_status" label="状态" class="postInfo-container-item">
                    <el-select v-model="postForm.machine_status" placeholder="请选择" style="width:100%">
                      <el-option
                        v-for="item in statusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 第 3 行 -->
              <el-row>
                <el-col :span="12">
                  <el-form-item label-width="60px" prop="longitude" label="经度" class="postInfo-container-item">
                    <el-input v-model="postForm.longitude" placeholder="洗车机位置经度值" class="article-textarea" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label-width="60px" prop="latitude" label="纬度" class="postInfo-container-item">
                    <el-input v-model="postForm.latitude" placeholder="洗车机位置纬度值" class="article-textarea" />
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 第 4 行 -->
              <el-row>
                <el-col :span="12">
                  <el-form-item label-width="60px" prop="region" label="地区" class="postInfo-container-item">
                    <el-cascader
                      v-model="selectedRegionsCode"
                      :options="regions"
                      style="width: 100%;"
                      @change="handleRegionSelect"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label-width="60px" prop="address" label="地址" class="postInfo-container-item">
                    <el-input v-model="postForm.address" placeholder="洗车机详细地址" class="article-textarea" />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
/**
 * API 组件
 */
import { createMachine, getMachineOptions, getMachineById, updateMachine } from '@/api/machine'

const defaultForm = {
  machine_uid: '',
  machine_name: '',
  branch_name: '',
  machine_status: '',
  longitude: '',
  latitude: '',
  address: ''
}

export default {
  name: 'MachineDetail',
  components: { MDinput, Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('必填项不可为空'))
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        machine_uid: [{ validator: validateRequire }],
        machine_name: [{ validator: validateRequire }],
        branch_name: [{ validator: validateRequire }],
        longitude: [{ validator: validateRequire }],
        latitude: [{ validator: validateRequire }]
      },
      /**
       * 表单项的下拉菜单选项
       */
      branchOptions: [],
      statusOptions: [],
      /**
       * 省市区的下拉菜单选项
       */
      regions: regionData,
      selectedRegionsCode: [],
      regionKey: ['province', 'city', 'area'],
      selectedRegionsText: {}
    }
  },
  computed: {},
  created() {
    if (this.isEdit) {
      const machine_uid = this.$route.params && this.$route.params.machine_uid
      this.getMachineData(machine_uid)
    }
  },
  mounted() {
    // 数据库获取 operation 部分下拉形式表单项的数据
    this.setOptions()
  },
  methods: {
    /**
     * 获取洗车机数据
     * @param {String} machine_uid 洗车机唯一标识
     */
    getMachineData(machine_uid) {
      getMachineById(machine_uid).then(response => {
        this.setFormData(response.data)
      })
    },

    /**
     * 将获取到的洗车机数据填充到表单项
     */
    setFormData(data) {
      this.postForm = {
        machine_uid: data.machine_uid,
        machine_name: data.machine_name,
        branch_name: data.branch_name,
        machine_status: data.machine_status,
        longitude: data.longitude,
        latitude: data.latitude,
        address: data.address
      }
      // 单独设置省市区的下拉菜单选项
      this.selectedRegionsCode = [
        TextToCode[data.province].code,
        TextToCode[data.province][data.city].code,
        TextToCode[data.province][data.city][data.area].code
      ]
    },

    /**
     * 设置表单项的下拉菜单选项
     */
    setOptions() {
      getMachineOptions().then(result => {
        [this.branchOptions, this.statusOptions] = result.data
      })
    },

    /**
     * 提交表单
     */
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          const machine = Object.assign({}, this.postForm)
          machine['region'] = this.selectedRegionsText

          // 判断是首次登记还是更新记录
          if (!this.isEdit) { // 首次登记
            createMachine(machine).then(() => {
              this.loading = false
              this.$notify({
                title: '创建成功',
                message: '洗车机添加入数据库',
                type: 'success',
                duration: 2000
              })
            }).catch(() => {
              this.loading = false
            })
          } else { // 更新记录
            updateMachine(machine).then(() => {
              this.loading = false
              this.$notify({
                title: '更新成功',
                message: '洗车机数据更新入数据库',
                type: 'success',
                duration: 2000
              })
            }).catch(() => {
              this.loading = false
            })
          }
        } else {
          this.$notify({
            title: '创建失败',
            message: '请检查信息是否正确',
            type: 'error',
            duration: 2000
          })
          return false
        }
      })
    },

    // 省市区的下拉菜单选项 Code 转 Text
    handleRegionSelect(value) {
      this.selectedRegionsText = {}
      value.forEach((element, index) => {
        this.selectedRegionsText[this.regionKey[index]] = CodeToText[element]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .preview-img {
      width: 200px;
      height: 270px;
    }

    .contents-wrapper {
      padding: 5px 0;
    }
  }
}
</style>

