<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <!-- 吸顶按钮组 -->
      <sticky :z-index="10" :class-name="'sub-navbar '+'published'">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          {{ isEdit ? '更新' : '添加' }}
        </el-button>
      </sticky>

      <!-- 表单项目 -->
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <!-- 第 1 行 -->
            <el-row>
              <el-col :span="10">
                <el-form-item style="margin-bottom: 40px; margin-right: 40px;" prop="manager_name">
                  <MDinput v-model="postForm.manager_name" :maxlength="100" name="manager_name" required>
                    负责人名称
                  </MDinput>
                </el-form-item>
              </el-col>
              <el-col :span="14">
                <el-form-item style="margin-bottom: 40px;" prop="manager_phone">
                  <MDinput v-model="postForm.manager_phone" :maxlength="100" name="manager_phone" required>
                    负责人手机号
                  </MDinput>
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
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件

/**
 * API 组件
 */
import { createManager, updateManager, getManagerById } from '@/api/user'

const defaultForm = {
  manager_uid: '',
  manager_name: '',
  manager_phone: ''
}

export default {
  name: 'ManagerDetail',
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
        manager_name: [{ validator: validateRequire }],
        manager_phone: [{ validator: validateRequire }]
      }
    }
  },
  computed: {},
  created() {
    if (this.isEdit) {
      const manager_uid = this.$route.params && this.$route.params.manager_uid
      this.getManagerData(manager_uid)
    }
  },
  methods: {
    setData(data) {
      this.postForm = {
        manager_uid: data.manager_uid,
        manager_name: data.manager_name,
        manager_phone: data.manager_phone
      }
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          const manager = Object.assign({}, this.postForm)

          /**
           * 判断是 添加数据 还是 更新数据
           */
          if (!this.isEdit) {
            createManager(manager).then(() => {
              this.loading = false
              this.$notify({
                title: '创建成功',
                message: '负责人添入数据库',
                type: 'success',
                duration: 2000
              })
            }).catch(() => {
              this.loading = false
            })
          } else {
            updateManager(manager).then(() => {
              this.loading = false
              this.$notify({
                title: '更新成功',
                message: '负责人数据更新入数据库',
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
    },

    getManagerData(manager_uid) {
      getManagerById(manager_uid).then(response => {
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
