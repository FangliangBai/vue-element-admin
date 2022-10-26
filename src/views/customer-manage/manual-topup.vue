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
      <!-- [按钮] 新建 -->
      <el-button
        class="filter-item"
        icon="el-icon-plus"
        style="margin-left: 10px"
        @click="onClickCreate"
      >
        添加
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
      <!-- 操作列 -->
      <template>
        <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="{ row }">
            <el-button size="mini" type="danger" @click="handleDelete(row)">撤销</el-button>
          </template>
        </el-table-column>
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

    <!-- [对话框] 新添充值记录 -->
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
import Pagination from '@/components/Pagination'
import { getCustomerList, listManualTopup, createManualTopup, deleteManualTopup } from '@/api/customer-manage'

export default {
  name: 'ManualTopup',
  components: { Pagination },
  data() {
    return {
      // 搜索条件
      listQuery: {},

      // 新记录表单
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
      customerList: [],

      // 查询返回的列表数据
      list: null,
      total: 0,

      // 组件状态
      tableKey: 0, // 优化 Vue 渲染需要
      listLoading: true, // 表格 loading 动画
      dialogVisible: false, // 对话框状态
      optionLoading: false, // 客户选项 loading 动画

      // 表头数据
      tableHead: [
        { field_name: 'topup_uid', label: '订单号' },
        { field_name: 'customer_phone', label: '用户手机号' },
        { field_name: 'topup_coin', label: '洗车币充值' },
        { field_name: 'topup_time', label: '充值时间' },
        { field_name: 'topup_note', label: '备注' }
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
      listManualTopup(this.listQuery).then(response => {
        const { data, total } = response
        this.list = data; this.total = total; this.listLoading = false
      })
    },

    // 发起 push 带参刷新 url
    refresh() {
      this.$router.push({
        path: '/customer-manage/manual-topup',
        query: this.listQuery
      })
    },

    // 查询条件变化后的处理函数
    handleFilter() {
      this.listQuery.page = 1
      this.refresh()
    },

    // 删除充值操作
    handleDelete(row) {
      deleteManualTopup(row).then(res => {
        if (res.msg === '用户余额不足，无法操作') {
          this.$notify({
            title: '操作失败',
            message: '用户余额不足，无法操作',
            type: 'warning',
            duration: 2000
          })
          this.getList()
        } else {
          this.$notify({
            title: '操作成功',
            message: res.msg,
            type: 'success',
            duration: 2000
          })
          this.getList()
        }
      })
    },

    // 点击新增充值记录
    onClickCreate() { this.dialogVisible = true },

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
    },

    // 点击确定添加按钮
    onClickSubmit() {
      this.$refs['createForm'].validate(valid => {
        if (!valid) return

        // 提交表单增加状态
        this.topupForm.topupStatus = 1 // 管理员充值直接加钱
        createManualTopup(this.topupForm).then(res => {
          if (res.code === 0) {
            this.$notify({
              title: '添加成功',
              message: '充值记录录入数据库',
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
    }
  }
}
</script>
