<template>
  <div class="app-container">
    <!-- 搜索条件 -->
    <div class="filter-container">
      <!-- [输入框] 手机号 -->
      <el-input
        v-model="listQuery.customerPhone"
        placeholder="请输入手机号"
        prefix-icon="el-icon-phone"
        clearable
        style="width: 180px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
      />

      <!-- [时间选择器] 充值时段 -->
      <el-date-picker
        v-model="listQuery.dateRange"
        value-format="yyyy-MM-dd"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        clearable
        class="filter-item"
      />

      <!-- [按钮] 查询 -->
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        style="margin-left: 10px"
        @click="handleFilter"
      >
        查询
      </el-button>

      <!-- [按钮] 账户清空 -->
      <el-button
        class="filter-item"
        type="danger"
        icon="el-icon-delete"
        style="margin-left: 10px"
        @click="dialogVisible = true"
      >
        一代清零
      </el-button>
    </div>

    <!-- 搜索结果列表 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      fit
      stripe
      highlight-current-row
      style="width: 100%;"
    >
      <!-- 数据列 -->
      <template v-for="(item, index) in tableHead">
        <el-table-column :key="index" :prop="item.field_name" :label="item.label" align="center" />
      </template>
    </el-table>

    <!-- 分页组件 -->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="refresh"
    />

    <!-- [对话框] 清空一代账户 -->
    <el-dialog
      title="清空一代账户"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-form
        ref="resetForm"
        :model="resetForm"
        :rules="rules"
        size="medium"
        label-width="100px"
        label-position="top"
      >
        <el-row :gutter="40">
          <el-col :span="24">
            <el-form-item label="一代账户手机号" prop="mobile">
              <el-input
                v-model="resetForm.mobile"
                placeholder="请输入一代账户手机号"
                :maxlength="11"
                show-word-limit
                clearable
                prefix-icon="el-icon-phone"
                :style="{width: '100%'}"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="resetLoading" @click="onClickSubmit">确定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import Pagination from '@/components/Pagination/index.vue'
import { listHwdTransfer, resetHwdAccount } from '@/api/customer-manage'

export default {
  name: 'HwdTransfer',
  components: { Pagination },
  data() {
    return {
      // 搜索条件
      listQuery: {},

      // 一代清空表单
      resetForm: { mobile: '' },

      // 新记录表单验证规则
      rules: {
        mobile: [{
          required: true,
          message: '请输入一代账户手机号',
          trigger: 'blur'
        }]
      },

      // 查询返回的列表数据
      list: null,
      total: 0,

      // 组件状态
      tableKey: 0, // 优化 Vue 渲染需要
      listLoading: true, // 表格 loading 动画
      resetLoading: false, // 一代清空 loading 动画
      dialogVisible: false, // 对话框状态

      // 表头数据
      tableHead: [
        { field_name: 'mobile', label: '用户手机号' },
        { field_name: 'balance_rmb', label: '迁移人民币余额' },
        { field_name: 'balance_coin', label: '迁移洗车币余额' },
        { field_name: 'donation_coin', label: '迁移附赠洗车币' }
      ]
    }
  },
  created() { this.parseQuery() },
  mounted() { this.getList() },
  // 初始化查询条件
  beforeRouteUpdate(to, from, next) {
    if (to.path === from.path) {
      const newQuery = Object.assign({}, to.query)
      const oldQuery = Object.assign({}, from.query)
      if (JSON.stringify(newQuery) !== JSON.stringify(oldQuery)) {
        this.getList()
      }
    }
    next()
  },
  methods: {
    // 初始化查询条件
    parseQuery() {
      let listQuery = {
        page: 1,
        pageSize: 20
      }
      const query = Object.assign({}, this.$route.query)
      if (query) {
        query.page && (query.page = Number(query.page))
        query.pageSize && (query.pageSize = Number(query.pageSize))
        listQuery = {
          ...listQuery,
          ...query
        }
      }
      this.listQuery = listQuery
    },

    // 请求表格数据, 赋值给组件 data
    getList() {
      this.listLoading = true
      listHwdTransfer(this.listQuery).then(response => {
        const { data, total } = response
        this.list = data; this.total = total; this.listLoading = false
      })
    },

    // 发起 push 带参刷新 url
    refresh() {
      this.$router.push({
        path: '/customer-manage/hwd-transfer',
        query: this.listQuery
      })
    },

    // 查询条件变化后的处理函数
    handleFilter() {
      this.listQuery.page = 1
      this.refresh()
    },

    // 点击确定清空按钮
    onClickSubmit() {
      this.$refs['resetForm'].validate(valid => {
        if (!valid) return

        // 提交表单增加状态
        this.resetLoading = true
        resetHwdAccount(this.resetForm).then(res => {
          if (res.code === 0) {
            this.$notify({
              title: '操作成功',
              message: '一代账户余额已清空',
              type: 'success',
              duration: 2000
            })
            this.resetLoading = false
            this.dialogVisible = false
          } else {
            this.$message.error(res.msg)
          }
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
