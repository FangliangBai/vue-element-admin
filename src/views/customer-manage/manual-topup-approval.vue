<template>
  <div class="app-container">
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
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="{ row }">
            <el-button size="mini" type="primary" @click="handleApproval(row)">确认</el-button>
            <el-button size="mini" type="danger" @click="handleCancel(row)">撤销</el-button>
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
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { approveManualTopup, cancelManualTopup, listManualTopup } from '@/api/customer-manage'

export default {
  name: 'ManualTopupApproval',
  components: { Pagination },
  data() {
    return {
      // 搜索条件
      listQuery: {},

      // 查询返回的列表数据
      list: null,
      total: 0,

      // 组件状态
      tableKey: 0, // 优化 Vue 渲染需要
      listLoading: true, // 表格 loading 动画

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

      // 添加状态
      this.listQuery.topupStatus = 0 // 非管理员充值等待审核
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

    // 确认充值申请
    handleApproval(row) {
      approveManualTopup(row).then(res => {
        this.$notify({
          title: '操作成功',
          message: res.msg,
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },

    // 撤销充值申请
    handleCancel(row) {
      cancelManualTopup(row).then(res => {
        this.$notify({
          title: '操作成功',
          message: res.msg,
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    }
  }
}
</script>

<style scoped>

</style>
