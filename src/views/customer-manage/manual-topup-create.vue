<template>
  <div class="createPost-container">

    <!-- 吸顶按钮组 -->
    <sticky :z-index="1" :class-name="'sub-navbar '+'published'">
      <el-button
        v-loading="loading"
        icon="el-icon-success"
        style="margin-left: 10px;"
        type="success"
        @click="onClickSubmit"
      >
        提交
      </el-button>
    </sticky>

    <div class="createPost-main-container">
      <aside>人工充值洗车币</aside>

      <!-- 手动充值 表单项目 -->
      <el-form
        ref="createForm"
        :model="topupForm"
        :rules="rules"
        size="medium"
        label-width="100px"
        label-position="top"
      >
        <el-row :gutter="40">
          <el-col :span="20">
            <el-form-item label="用户手机号" prop="openidList">
              <el-select
                v-model="topupForm.openidList"
                placeholder="请选择用户手机号"
                multiple
                filterable
                remote
                :remote-method="getSelectOptions"
                clearable
                :loading="optionLoading"
                :style="{width: '100%'}"
              >
                <el-option
                  v-for="(item, index) in customerList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="洗车币充值金额" prop="topupCoin">
              <el-input-number v-model="topupForm.topupCoin" placeholder="洗车币充值金额" :step="50" :min="1" :style="{width: '100%'}" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="24">
            <el-form-item label="充值备注" prop="topupNote">
              <el-input
                v-model="topupForm.topupNote"
                placeholder="请输入充值备注"
                :maxlength="200"
                show-word-limit
                clearable
                prefix-icon="el-icon-document"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
// 组件
import Sticky from '@/components/Sticky'
// API
import { createManualTopup, getCustomerList } from '@/api/customer-manage'

export default {
  name: 'ManualTopupCreate',
  components: { Sticky },
  data() {
    return {
      // 组件状态
      loading: false, // 提交按钮 loading 状态
      optionLoading: false, // 客户选项 loading 状态

      // 手动充值表单
      topupForm: {
        openidList: [],
        topupCoin: 50,
        topupNote: ''
      },

      // 新记录表单验证规则
      rules: {
        openidList: [{
          required: true,
          type: 'array',
          message: '请至少选择一个用户手机号',
          trigger: 'change'
        }],
        topupCoin: [{
          required: true,
          message: '洗车币充值金额',
          trigger: 'blur'
        }],
        topupNote: [{
          required: true,
          message: '请输入充值备注',
          trigger: 'blur'
        }]
      },

      // 手机号选择列表
      customerList: []
    }
  },
  create() {

  },
  methods: {
    // 提交手动充值记录
    onClickSubmit() {
      this.$refs['createForm'].validate(valid => {
        if (!valid) return

        // 提交表单增加状态
        this.topupForm.topupStatus = 0 // 非管理员充值等待审核
        createManualTopup(this.topupForm).then(res => {
          if (res.code === 0) {
            this.$notify({
              title: '操作成功',
              message: '充值申请已提交',
              type: 'success',
              duration: 2000
            })
            this.dialogVisible = false
            this.getList()
          } else {
            this.$message.error(res.msg)
          }
        })
      })
    },

    // 远程查询客户信息
    getSelectOptions(query) {
      if (query !== '') {
        this.optionLoading = true
        getCustomerList({ phone: query }).then(res => {
          this.customerList = res.data
          this.optionLoading = false
        })
      } else {
        this.customerList = []
      }
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
