<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <!-- 吸顶按钮组 -->
      <sticky :z-index="10" :class-name="'sub-navbar '+'published'">
        <el-button v-loading="loading" icon="el-icon-success" style="margin-left: 10px;" type="success" @click="submitForm">
          设定
        </el-button>
      </sticky>

      <!-- 表单项目 -->
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <aside>服务单价 (元/10秒)</aside>
            <el-row>
              <el-col :span="7">
                <el-form-item label="冲水：" prop="price_water" label-width="100px" style="margin-bottom: 20px; margin-right: 10px;">
                  <el-input v-model="postForm.price_water" />
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="打沫：" prop="price_froth" label-width="100px" style="margin-bottom: 20px; margin-right: 10px;">
                  <el-input v-model="postForm.price_froth" />
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="吸尘：" prop="price_hoover" label-width="100px" style="margin-bottom: 20px; margin-right: 10px;">
                  <el-input v-model="postForm.price_hoover" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="7">
                <el-form-item label="臭氧：" prop="price_ozone" label-width="100px" style="margin-bottom: 20px; margin-right: 10px;">
                  <el-input v-model="postForm.price_ozone" />
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="吹风：" prop="price_blower" label-width="100px" style="margin-bottom: 20px; margin-right: 10px;">
                  <el-input v-model="postForm.price_blower" />
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="热风：" prop="price_dryer" label-width="100px" style="margin-bottom: 20px; margin-right: 10px;">
                  <el-input v-model="postForm.price_dryer" />
                </el-form-item>
              </el-col>
            </el-row>
            <aside>暂停时长 / 单价 (元/10秒)</aside>
            <el-row>
              <el-col :span="7">
                <el-form-item label="暂停超时计费：" prop="price_pause" label-width="150px" style="margin-bottom: 20px; margin-right: 10px;">
                  <el-input v-model="postForm.price_pause" />
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="免费暂停时长 (秒)：" prop="free_pause_time" label-width="150px" style="margin-bottom: 20px; margin-right: 10px;">
                  <el-input v-model="postForm.free_pause_time" placeholder="秒" />
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
import Sticky from '@/components/Sticky'
import { getTariff, updateTariff } from '@/api/finance'

const defaultForm = {
  price_water: '',
  price_froth: '',
  price_hoover: '',
  price_ozone: '',
  price_blower: '',
  price_dryer: '',
  price_pause: '',
  free_pause_time: ''
}

export default {
  name: 'TariffEdit',
  components: { Sticky },
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
        price_water: [{ validator: validateRequire }],
        price_froth: [{ validator: validateRequire }],
        price_hoover: [{ validator: validateRequire }],
        price_ozone: [{ validator: validateRequire }],
        price_blower: [{ validator: validateRequire }],
        price_dryer: [{ validator: validateRequire }],
        price_pause: [{ validator: validateRequire }],
        free_pause_time: [{ validator: validateRequire }]
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    // 从数据库获取表单信息
    getData() {
      getTariff().then(response => {
        this.setData(response.data)
      })
    },
    // 数据库消息填入表单
    setData(data) {
      this.postForm = {
        price_water: data.price_water,
        price_froth: data.price_froth,
        price_hoover: data.price_hoover,
        price_ozone: data.price_ozone,
        price_blower: data.price_blower,
        price_dryer: data.price_dryer,
        price_pause: data.price_pause,
        free_pause_time: data.free_pause_time
      }
    },
    // 更新信息到数据库
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          const tariff = Object.assign({}, this.postForm)
          updateTariff(tariff).then(() => {
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
