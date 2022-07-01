<template>
  <div class="createPost-container">

    <!-- 吸顶按钮组 -->
    <sticky :z-index="1" :class-name="'sub-navbar '+'published'">
      <el-button v-loading="loading" icon="el-icon-success" style="margin-left: 10px;" type="success" @click="submitForm">
        设定
      </el-button>
    </sticky>

    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <!-- 表单项目 -->
      <el-divider><i class="el-icon-s-tools" /> 网点选择 </el-divider>

      <!-- [选择器] 网点 -->
      <el-row>
        <el-col :span="8">
          <el-form-item label="网点：" prop="branch" label-width="80px" style="margin-bottom: 20px; margin-right: 10px;">
            <el-select
              v-model="selected_branch_uid[0]"
              placeholder="请选择网点"
              clearable
              filterable
              style="margin-left: 10px; width: 95%;"
              @change="getBranchTariff()"
              @clear="() => {selected_branch_uid.shift()}"
            >
              <el-option
                v-for="item in branchOptions"
                :key="item.branch_uid"
                :label="item.branch_name"
                :value="item.branch_uid"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="批量定价网点：" prop="branch-follow" label-width="120px" style="margin-bottom: 20px; margin-right: 10px;">
            <el-select
              v-model="selected_branch_uid"
              placeholder="请选择跟设网点"
              clearable
              filterable
              multiple
              style="margin-left: 10px; width: 95%;"
            >
              <el-option
                v-for="item in branchOptions"
                :key="item.branch_uid"
                :label="item.branch_name"
                :value="item.branch_uid"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider><i class="el-icon-s-tools" /> 服务单价设置 (元/10秒) </el-divider>
      <el-row>
        <el-col :span="7">
          <el-form-item label="冲水：" prop="price_water" label-width="80px" style="margin-bottom: 20px; margin-right: 10px;">
            <el-input v-model="postForm.price_water" />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="打沫：" prop="price_froth" label-width="80px" style="margin-bottom: 20px; margin-right: 10px;">
            <el-input v-model="postForm.price_froth" />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="吸尘：" prop="price_hoover" label-width="80px" style="margin-bottom: 20px; margin-right: 10px;">
            <el-input v-model="postForm.price_hoover" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7">
          <el-form-item label="臭氧：" prop="price_ozone" label-width="80px" style="margin-bottom: 20px; margin-right: 10px;">
            <el-input v-model="postForm.price_ozone" />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="吹风：" prop="price_blower" label-width="80px" style="margin-bottom: 20px; margin-right: 10px;">
            <el-input v-model="postForm.price_blower" />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="热风：" prop="price_dryer" label-width="80px" style="margin-bottom: 20px; margin-right: 10px;">
            <el-input v-model="postForm.price_dryer" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7">
          <el-form-item label="水龙头：" prop="price_tap" label-width="80px" style="margin-bottom: 20px; margin-right: 10px;">
            <el-input v-model="postForm.price_tap" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider><i class="el-icon-s-tools" /> 暂停设置 (元/10秒) </el-divider>

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

      <el-divider><i class="el-icon-s-tools" /> 服务次数设置 (次) </el-divider>

      <el-row style="margin: 20px;">
        说明：次数设置为 -1 时，表示不限制次数。
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="冲水：" prop="quantity_water" label-width="80px" style="margin-bottom: 20px; margin-right: 10px;">
            <el-input v-model="postForm.quantity_water" placeholder="次数" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="打沫：" prop="quantity_froth" label-width="80px" style="margin-bottom: 20px; margin-right: 10px;">
            <el-input v-model="postForm.quantity_froth" placeholder="次数" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="吸尘：" prop="quantity_hoover" label-width="80px" style="margin-bottom: 20px; margin-right: 10px;">
            <el-input v-model="postForm.quantity_hoover" placeholder="次数" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="臭氧：" prop="quantity_ozone" label-width="80px" style="margin-bottom: 20px; margin-right: 10px;">
            <el-input v-model="postForm.quantity_ozone" placeholder="次数" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="吹风：" prop="quantity_blower" label-width="80px" style="margin-bottom: 20px; margin-right: 10px;">
            <el-input v-model="postForm.quantity_blower" placeholder="次数" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="热风：" prop="quantity_dryer" label-width="80px" style="margin-bottom: 20px; margin-right: 10px;">
            <el-input v-model="postForm.quantity_dryer" placeholder="次数" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="水龙头：" prop="quantity_tap" label-width="80px" style="margin-bottom: 20px; margin-right: 10px;">
            <el-input v-model="postForm.quantity_tap" placeholder="次数" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="暂停：" prop="quantity_pause" label-width="80px" style="margin-bottom: 20px; margin-right: 10px;">
            <el-input v-model="postForm.quantity_pause" placeholder="次数" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider><i class="el-icon-s-tools" /> 单次服务时限设置 (秒) </el-divider>

      <el-row>
        <el-col :span="6">
          <el-form-item label="冲水：" prop="time_limit_water" label-width="80px" style="margin-bottom: 20px; margin-right: 10px;">
            <el-input v-model="postForm.time_limit_water" placeholder="秒" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="打沫：" prop="time_limit_froth" label-width="80px" style="margin-bottom: 20px; margin-right: 10px;">
            <el-input v-model="postForm.time_limit_froth" placeholder="秒" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="吸尘：" prop="time_limit_hoover" label-width="80px" style="margin-bottom: 20px; margin-right: 10px;">
            <el-input v-model="postForm.time_limit_hoover" placeholder="秒" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="臭氧：" prop="time_limit_ozone" label-width="80px" style="margin-bottom: 20px; margin-right: 10px;">
            <el-input v-model="postForm.time_limit_ozone" placeholder="秒" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="吹风：" prop="time_limit_blower" label-width="80px" style="margin-bottom: 20px; margin-right: 10px;">
            <el-input v-model="postForm.time_limit_blower" placeholder="秒" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="热风：" prop="time_limit_dryer" label-width="80px" style="margin-bottom: 20px; margin-right: 10px;">
            <el-input v-model="postForm.time_limit_dryer" placeholder="秒" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="水龙头：" prop="time_limit_tap" label-width="80px" style="margin-bottom: 20px; margin-right: 10px;">
            <el-input v-model="postForm.time_limit_tap" placeholder="秒" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="暂停：" prop="time_limit_pause" label-width="80px" style="margin-bottom: 20px; margin-right: 10px;">
            <el-input v-model="postForm.time_limit_pause" placeholder="秒" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

  </div>
</template>

<script>
// 组件
import Sticky from '@/components/Sticky'
// API
import { getTariff, updateTariff, getBranchOptions } from '@/api/finance'

const defaultForm = {
  price_water: '',
  price_froth: '',
  price_hoover: '',
  price_ozone: '',
  price_blower: '',
  price_dryer: '',
  price_tap: '',
  price_pause: '',
  free_pause_time: '',
  quantity_water: '',
  quantity_froth: '',
  quantity_hoover: '',
  quantity_ozone: '',
  quantity_blower: '',
  quantity_dryer: '',
  quantity_tap: '',
  quantity_pause: '',
  time_limit_water: '',
  time_limit_froth: '',
  time_limit_hoover: '',
  time_limit_ozone: '',
  time_limit_blower: '',
  time_limit_dryer: '',
  time_limit_tap: '',
  time_limit_pause: ''
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
        price_tap: [{ validator: validateRequire }],
        free_pause_time: [{ validator: validateRequire }]
      },

      // 网点选择器
      branchOptions: [],
      selected_branch_uid: []

    }
  },
  created() {
    // 获取网点选项
    this.getBranchOptions()
  },
  methods: {
    // 获取网点列表
    getBranchOptions() {
      getBranchOptions().then(res => {
        this.branchOptions = res.data
      })
    },

    // 从数据库获取表单信息
    getBranchTariff() {
      if (this.selected_branch_uid.length > 0) {
        getTariff(this.selected_branch_uid[0]).then(response => {
          if (response.data) {
            this.setData(response.data)
            this.$notify({
              title: '加载成功',
              message: '已查询到本网点单价',
              type: 'success',
              duration: 2000
            })
          } else {
            this.$notify({
              title: '暂无价格',
              message: '请设置此网点的服务价格',
              type: 'success',
              duration: 2000
            })
          }
        })
      }
    },

    // 数据库信息填入表单
    setData(data) {
      this.postForm = {
        price_water: data.price_water,
        price_froth: data.price_froth,
        price_hoover: data.price_hoover,
        price_ozone: data.price_ozone,
        price_blower: data.price_blower,
        price_dryer: data.price_dryer,
        price_tap: data.price_tap,
        price_pause: data.price_pause,
        free_pause_time: data.free_pause_time,
        quantity_water: data.quantity_water,
        quantity_froth: data.quantity_froth,
        quantity_hoover: data.quantity_hoover,
        quantity_ozone: data.quantity_ozone,
        quantity_blower: data.quantity_blower,
        quantity_dryer: data.quantity_dryer,
        quantity_tap: data.quantity_tap,
        quantity_pause: data.quantity_pause,
        time_limit_water: data.time_limit_water,
        time_limit_froth: data.time_limit_froth,
        time_limit_hoover: data.time_limit_hoover,
        time_limit_ozone: data.time_limit_ozone,
        time_limit_blower: data.time_limit_blower,
        time_limit_dryer: data.time_limit_dryer,
        time_limit_tap: data.time_limit_tap,
        time_limit_pause: data.time_limit_pause
      }
    },

    // 更新信息到数据库
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          const tariff = Object.assign({}, this.postForm)

          // 更新前 Tariff 加上 branch_uid
          tariff.branch_uid = this.selected_branch_uid

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
