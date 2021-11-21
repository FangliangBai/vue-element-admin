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
                  <MDinput v-model="postForm.branch_uid" :maxlength="100" name="branch_uid" required>
                    网点编号
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
              <!-- 第 2 行 -->
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="60px" prop="longitude" label="经度" class="postInfo-container-item">
                    <el-input v-model="postForm.longitude" :rows="1" type="textarea" class="article-textarea" autosize placeholder="网点位置经度值" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label-width="60px" prop="latitude" label="纬度" class="postInfo-container-item">
                    <el-input v-model="postForm.latitude" :rows="1" type="textarea" class="article-textarea" autosize placeholder="网点位置纬度值" />
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 第 3 行 -->
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="60px" prop="zip_code" label="邮编" class="postInfo-container-item">
                    <el-input v-model="postForm.zip_code" :rows="1" type="textarea" class="article-textarea" autosize placeholder="网点所在地邮编" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label-width="60px" prop="city_code" label="区号" class="postInfo-container-item">
                    <el-input v-model="postForm.city_code" :rows="1" type="textarea" class="article-textarea" autosize placeholder="网点所在地区号" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label-width="60px" prop="address" label="地址" class="postInfo-container-item">
                    <el-input v-model="postForm.address" :rows="1" type="textarea" class="article-textarea" autosize placeholder="网点所在地址全称" />
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 第 4 行 -->
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="60px" prop="num_machines" label="数量" class="postInfo-container-item">
                    <el-input v-model="postForm.num_machines" :rows="1" type="textarea" class="article-textarea" autosize placeholder="洗车机台数" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label-width="60px" prop="manager_name" label="负责人" class="postInfo-container-item">
                    <el-input v-model="postForm.manager_name" :rows="1" type="textarea" class="article-textarea" autosize placeholder="网点负责人名称" />
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

/**
 * API 组件
 */
import { createBranch, getBranchById, updateBranch } from '@/api/branch'

const defaultForm = {
  branch_uid: '',
  branch_name: '',
  longitude: '',
  latitude: '',
  zip_code: '',
  city_code: '',
  address: '',
  num_machines: '',
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
        zip_code: [{ validator: validateRequire }],
        city_code: [{ validator: validateRequire }],
        address: [{ validator: validateRequire }],
        num_machines: [{ validator: validateRequire }],
        manager_name: [{ validator: validateRequire }]
      }
    }
  },
  computed: {},
  created() {
    if (this.isEdit) {
      const branch_uid = this.$route.params && this.$route.params.branch_uid
      this.getBranchData(branch_uid)
    }
  },
  methods: {
    setData(data) {
      const {
        branch_uid,
        branch_name,
        longitude,
        latitude,
        zip_code,
        city_code,
        address,
        num_machines,
        manager_name
      } = data
      this.postForm = {
        branch_uid,
        branch_name,
        longitude,
        latitude,
        zip_code,
        city_code,
        address,
        num_machines,
        manager_name
      }
    },
    submitForm() {
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          const branch = Object.assign({}, this.postForm)

          /**
           * 判断是添加新数据还是更新数据
           */
          if (!this.isEdit) { // 添加数据
            createBranch(branch).then(response => {
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
            updateBranch(branch).then(response => {
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
    getBranchData(branch_uid) {
      getBranchById(branch_uid).then(response => {
        this.setData(response.data)
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
