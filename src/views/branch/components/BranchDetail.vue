<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <!-- 吸顶按钮组 -->
      <sticky :z-index="10" :class-name="'sub-navbar '+'published'">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          {{ isEdit ? '更新网点' : '添加网点' }}
        </el-button>
      </sticky>

      <!-- 表单项目 -->
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <!-- 第 1 行 -->
            <el-row>
              <el-col :span="8">
                <el-form-item style="margin-bottom: 40px; margin-right: 40px;" prop="branch_uid">
                  <MDinput v-model="postForm.branch_uid" :maxlength="100" name="branch_uid" required disabled>
                    网点编号 (系统设定)
                  </MDinput>
                </el-form-item>
              </el-col>
              <el-col :span="14">
                <el-form-item style="margin-bottom: 40px;" prop="branch_name">
                  <MDinput v-model="postForm.branch_name" :maxlength="100" name="branch_name" required>
                    网点名称
                  </MDinput>
                </el-form-item>
              </el-col>
            </el-row>
            <div class="postInfo-container">
              <!-- 第 2 行 经度 纬度 -->
              <el-row>
                <el-col :span="10">
                  <el-form-item label-width="60px" prop="longitude" label="经度" class="postInfo-container-item">
                    <el-input v-model="postForm.longitude" :rows="1" class="article-textarea" autosize placeholder="网点位置经度值" />
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label-width="60px" prop="latitude" label="纬度" class="postInfo-container-item">
                    <el-input v-model="postForm.latitude" :rows="1" class="article-textarea" autosize placeholder="网点位置纬度值" />
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 第 3 行 行政区 -->
              <el-row>
                <el-col :span="10">
                  <el-form-item
                    label-width="60px"
                    prop="region"
                    label="地区"
                    class="postInfo-container-item"
                  >
                    <el-cascader
                      v-model="selectedRegionsCode"
                      :options="regions"
                      style="width: 100%;"
                      @change="handleRegionSelect"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label-width="60px" prop="address" label="地址" class="postInfo-container-item">
                    <el-input v-model="postForm.address" :rows="1" class="article-textarea" autosize placeholder="网点所在地址全称" />
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 第 4 行 -->
              <el-row>
                <el-col :span="10">
                  <el-form-item label-width="60px" prop="manager_name" label="负责人" class="postInfo-container-item">
                    <el-select v-model="postForm.manager_name" placeholder="请选择" style="width: 100%;">
                      <el-option
                        v-for="item in managerOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
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
/**
 * 第三方包
 */
import { v1 as uuid_v1 } from 'uuid'
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'

/**
 * 组件
 */
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件

/**
 * API
 */
import { createBranch, getBranchById, updateBranch, getBranchOptions } from '@/api/branch'

const defaultForm = {
  branch_uid: '',
  branch_name: '',
  longitude: '',
  latitude: '',
  address: '',
  manager_name: ''
}

export default {
  name: 'BranchDetail',
  components: { MDinput, Sticky },
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
        callback(new Error('必填项不可为空'))
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
        branch_uid: [{ validator: validateRequire }],
        branch_name: [{ validator: validateRequire }],
        longitude: [{ validator: validateRequire }],
        latitude: [{ validator: validateRequire }],
        address: [{ validator: validateRequire }],
        manager_name: [{ validator: validateRequire }]
      },
      /**
       * 表单项的下拉菜单选项
       */
      managerOptions: [],

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
      const branch_uid = this.$route.params && this.$route.params.branch_uid
      this.getBranchData(branch_uid)
    }
  },
  mounted() {
    // 数据库获取 operation 部分下拉形式表单项的数据
    this.setOptions()
    if (!this.isEdit) { // [创建模式] 页面数据初始化
      this.postForm.branch_uid = uuid_v1()
    }
  },
  methods: {
    getBranchData(branch_uid) {
      getBranchById(branch_uid).then(response => {
        this.setData(response.data)
      })
    },
    setData(data) {
      const {
        branch_uid,
        branch_name,
        longitude,
        latitude,
        address,
        manager_name
      } = data
      this.postForm = {
        branch_uid,
        branch_name,
        longitude,
        latitude,
        address,
        manager_name
      }

      // 设置省市区的下拉菜单选项
      this.selectedRegionsCode = [
        TextToCode[data.province].code,
        TextToCode[data.province][data.city].code,
        TextToCode[data.province][data.city][data.area].code
      ]
    },
    setOptions() {
      getBranchOptions().then(result => {
        [this.managerOptions] = result.data
      })
    },
    submitForm() {
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          /**
           * Assemble branch data
           */
          const branch = Object.assign({}, this.postForm)
          branch['region'] = this.selectedRegionsText
          console.log(branch)

          /**
           * 判断是添加新数据还是更新数据
           */
          if (!this.isEdit) { // 添加数据
            createBranch(branch).then(() => {
              this.loading = false
              this.$notify({
                title: '创建成功',
                message: '网点添加入数据库',
                type: 'success',
                duration: 2000
              })
            }).catch(() => {
              this.loading = false
            })
          } else { // 更新数据
            updateBranch(branch).then(() => {
              this.loading = false
              this.$notify({
                title: '更新成功',
                message: '网点数据更新入数据库',
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
