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
              <el-col :span="8">
                <el-form-item style="margin-bottom: 40px; margin-right: 40px;" prop="machine_uid">
                  <MDinput v-model="postForm.machine_uid" :maxlength="100" name="machine_uid" required>
                    洗车机编号
                  </MDinput>
                </el-form-item>
              </el-col>
              <el-col :span="14">
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
                <el-col :span="8">
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
                <el-col :span="8">
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
                <el-col :span="8">
                  <el-form-item label-width="60px" prop="longitude" label="经度" class="postInfo-container-item">
                    <el-input v-model="postForm.longitude" placeholder="洗车机位置经度值" class="article-textarea" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label-width="60px" prop="latitude" label="纬度" class="postInfo-container-item">
                    <el-input v-model="postForm.latitude" placeholder="洗车机位置纬度值" class="article-textarea" />
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 第 4 行 -->
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="60px" prop="zip_code" label="邮编" class="postInfo-container-item">
                    <el-input v-model="postForm.zip_code" placeholder="洗车机所在地邮编" class="article-textarea" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label-width="60px" prop="city_code" label="区号" class="postInfo-container-item">
                    <el-input v-model="postForm.city_code" placeholder="洗车机所在地区号" class="article-textarea" />
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
import { createMachine, getMachineOptions, getMachineById, updateMachine } from '@/api/machine'

const defaultForm = {
  machine_uid: '',
  machine_name: '',
  branch_name: '',
  machine_status: '',
  longitude: '',
  latitude: '',
  zip_code: '',
  city_code: ''
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
        latitude: [{ validator: validateRequire }],
        zip_code: [{ validator: validateRequire }],
        city_code: [{ validator: validateRequire }]
      },
      /**
       * 表单项的下拉菜单选项
       */
      branchOptions: [],
      statusOptions: []
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
    getMachineData(machine_uid) {
      getMachineById(machine_uid).then(response => {
        this.setData(response.data)
      })
    },
    setData(data) {
      const {
        machine_uid,
        machine_name,
        branch_name,
        machine_status,
        longitude,
        latitude,
        zip_code,
        city_code
      } = data
      this.postForm = {
        machine_uid,
        machine_name,
        branch_name,
        machine_status,
        longitude,
        latitude,
        zip_code,
        city_code
      }
    },
    setOptions() {
      getMachineOptions().then(result => {
        [this.branchOptions, this.statusOptions] = result.data
      })
    },
    submitForm() {
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          const machine = Object.assign({}, this.postForm)

          // 判断是首次登记还是更新记录
          if (!this.isEdit) {
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
          } else {
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

