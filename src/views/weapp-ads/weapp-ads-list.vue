<template>
  <div class="app-container">
    <el-button
      class="filter-item"
      icon="el-icon-plus"
      style="margin-left: 10px"
      @click="onClickCreate"
    >
      添加
    </el-button>

    <el-dialog
      title="手动添加记录"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-form
        ref="createForm"
        :model="topupForm"
        :rules="rules"
        size="medium"
        label-width="100px"
        label-position="top"
      >
        <el-row :gutter="40">
          <el-col :span="17">
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
          <el-col :span="7">
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
                :style="{width: '100%'}"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onClickSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'WeappAdsList',
  data() {
    return {
      dialogVisible: false,
      topupForm: {
        openidList: [],
        topupCoin: 0,
        topupNote: '',
      },
      rules: {
        openidList: [
          { required: true, message: '请选择用户手机号', trigger: 'change' },
        ],
        topupCoin: [
          { required: true, message: '请输入洗车币充值金额', trigger: 'change' },
        ],
      },
    }
  },
  methods:{
    onClickCreate() { this.dialogVisible = true },
  }
}
</script>

