<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <!-- 吸顶按钮组 -->
      <sticky :z-index="10" :class-name="'sub-navbar '+'published'">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          {{ isEdit ? '更新记录' : '添加管理员' }}
        </el-button>
      </sticky>

      <!-- 各表单项 -->
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <!-- 第 1 行 -->
            <el-row>
              <el-col :span="14">
                <el-form-item style="margin-bottom: 40px;" prop="username">
                  <MDinput v-model="postForm.username" :maxlength="100" name="username" required>
                    管理员名称名称
                  </MDinput>
                </el-form-item>
              </el-col>
            </el-row>
            <div class="postInfo-container">
              <!-- 第 2 行 -->
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="60px" prop="password" label="密码" class="postInfo-container-item">
                    <el-input v-model="postForm.password" :rows="1" class="article-textarea" autosize placeholder="管理员密码" show-password />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label-width="60px" prop="admin_role" label="权限" class="postInfo-container-item">
                    <el-select v-model="postForm.admin_role" placeholder="请选择">
                      <el-option
                        v-for="item in roleOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label-width="60px" prop="admin_status" label="状态" class="postInfo-container-item">
                    <el-select v-model="postForm.admin_status" placeholder="请选择">
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
import { createAdminUser, getAdminUserById, updateAdminUser } from '@/api/user'

const defaultForm = {
  admin_id: 0,
  username: '',
  password: '',
  admin_role: '',
  admin_status: ''
}

export default {
  name: 'AdminUserDetail',
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
        admin_id: [{ validator: validateRequire }],
        username: [{ validator: validateRequire }],
        password: [{ validator: validateRequire }],
        admin_role: [{ validator: validateRequire }],
        admin_status: [{ validator: validateRequire }]
      },
      /**
       * 表单项的下拉菜单选项
       */
      roleOptions: [
        {
          value: 'admin',
          label: '管理人员'
        }, {
          value: 'editor',
          label: '工作人员'
        },
        {
          value: 'manual-topup',
          label: '充值人员'
        }
      ],
      statusOptions: [
        {
          value: '1',
          label: '活跃'
        }, {
          value: '2',
          label: '禁用'
        }
      ]
    }
  },
  computed: {},
  created() {
    if (this.isEdit) {
      const admin_id = this.$route.params && this.$route.params.admin_id
      this.getAdminUserData(admin_id)
    }
  },
  methods: {
    getAdminUserData(admin_id) {
      getAdminUserById(admin_id).then(response => {
        this.setData(response.data)
      })
    },
    setData(data) {
      const {
        admin_id,
        username,
        password,
        admin_role,
        admin_status
      } = data
      this.postForm = {
        admin_id,
        username,
        password,
        admin_role,
        admin_status
      }
    },
    submitForm() {
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          const admin_user = Object.assign({}, this.postForm)

          // 判断是首次登记还是更新记录
          if (!this.isEdit) {
            createAdminUser(admin_user).then(() => {
              this.loading = false
              this.$notify({
                title: '创建成功',
                message: '管理人员添加入数据库',
                type: 'success',
                duration: 2000
              })
            }).catch(() => {
              this.loading = false
            })
          } else {
            updateAdminUser(admin_user).then(() => {
              this.loading = false
              this.$notify({
                title: '更新成功',
                message: '数据更新入数据库',
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

