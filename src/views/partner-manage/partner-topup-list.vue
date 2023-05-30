<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- [按钮] 添加合作商 -->
      <el-button class="filter-item" icon="el-icon-plus" style="margin-left: 10px" @click="onClickCreate">
        添加
      </el-button>
    </div>

    <!-- [对话框] 添加合作商 -->
    <el-dialog title="充值引流合作商" :visible.sync="dialogVisible" width="70%">
      <el-form ref="createForm" :model="formPartner" :rules="rules" label-width="100px">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="合作商名称" prop="partner_name">
              <el-input
                v-model="formPartner.partner_name"
                placeholder="请填写合作商名称"
                :maxlength="32"
                show-word-limit
                clearable
                prefix-icon="el-icon-document"
                :style="{width: '100%'}"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider><i class="el-icon-money" /> 合作商充值选项设定（单位： 分） </el-divider>
        <el-row>
          <el-col :span="12">
            <el-form-item label="充值选项 1（单位：分）">
              <el-input-number v-model="formPartner.tariff_coin.opt1" placeholder="请输入充值金额" :step="1" :min="0" />
            </el-form-item>
            <el-form-item label="充值选项 2">
              <el-input-number v-model="formPartner.tariff_coin.opt2" placeholder="请输入充值金额" :step="1" :min="0" />
            </el-form-item>
            <el-form-item label="充值选项 3">
              <el-input-number v-model="formPartner.tariff_coin.opt3" placeholder="请输入充值金额" :step="1" :min="0" />
            </el-form-item>
            <el-form-item label="充值选项 4">
              <el-input-number v-model="formPartner.tariff_coin.opt4" placeholder="请输入充值金额" :step="1" :min="0" />
            </el-form-item>
            <el-form-item label="充值选项 5">
              <el-input-number v-model="formPartner.tariff_coin.opt5" placeholder="请输入充值金额" :step="1" :min="0" />
            </el-form-item>
            <el-form-item label="充值选项 6">
              <el-input-number v-model="formPartner.tariff_coin.opt6" placeholder="请输入充值金额" :step="1" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="赠送选项 1">
              <el-input-number v-model="formPartner.tariff_bonus.opt1" placeholder="请输入赠送金额" :step="1" :min="0" />
            </el-form-item>
            <el-form-item label="赠送选项 2">
              <el-input-number v-model="formPartner.tariff_bonus.opt2" placeholder="请输入赠送金额" :step="1" :min="0" />
            </el-form-item>
            <el-form-item label="赠送选项 3">
              <el-input-number v-model="formPartner.tariff_bonus.opt3" placeholder="请输入赠送金额" :step="1" :min="0" />
            </el-form-item>
            <el-form-item label="赠送选项 4">
              <el-input-number v-model="formPartner.tariff_bonus.opt4" placeholder="请输入赠送金额" :step="1" :min="0" />
            </el-form-item>
            <el-form-item label="赠送选项 5">
              <el-input-number v-model="formPartner.tariff_bonus.opt5" placeholder="请输入赠送金额" :step="1" :min="0" />
            </el-form-item>
            <el-form-item label="赠送选项 6">
              <el-input-number v-model="formPartner.tariff_bonus.opt6" placeholder="请输入赠送金额" :step="1" :min="0" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onClickCancel">取 消</el-button>
        <el-button type="primary" @click="onClickSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { UpsertPartnerTopup } from '@/api/partner-manage'

const resetForm = {
  partner_uid: '',
  partner_name: '',
  tariff_coin: {
    opt1: 0,
    opt2: 0,
    opt3: 0,
    opt4: 0,
    opt5: 0,
    opt6: 0
  },
  tariff_bonus: {
    opt1: 0,
    opt2: 0,
    opt3: 0,
    opt4: 0,
    opt5: 0,
    opt6: 0
  }
}

export default {
  name: 'PartnerTopupList',
  data() {
    return {
      // 组件状态
      dialogVisible: false,

      // 业务数据
      formPartner: {
        partner_uid: '',
        partner_name: '',
        tariff_coin: {
          opt1: 0,
          opt2: 0,
          opt3: 0,
          opt4: 0,
          opt5: 0,
          opt6: 0
        },
        tariff_bonus: {
          opt1: 0,
          opt2: 0,
          opt3: 0,
          opt4: 0,
          opt5: 0,
          opt6: 0
        }
      },

      rules: {
        partner_name: [
          { required: true, message: '请输入合作商名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onClickCreate() {
      this.dialogVisible = true
    },
    onClickSubmit() {
      this.$refs.createForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            UpsertPartnerTopup(this.formPartner)
              .then(() => {
                this.$message({
                  type: 'success',
                  message: '合作商创建成功'
                })
                this.formPartner = Object.assign({}, resetForm)
                this.dialogVisible = false
              })
              .catch(() => {
                this.$message({
                  type: 'error',
                  message: '提交失败'
                })
              })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消提交'
            })
          })
        } else {
          return false
        }
      })
    },
    onClickCancel() {
      this.formPartner = Object.assign({}, resetForm)
      this.dialogVisible = false
    }
  }
}
</script>
