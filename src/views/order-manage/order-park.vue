<template>
  <div class="app-container">
    <!-- 顶部搜索条件 -->
    <div class="filter-container">
      <!--[输入框] 手机号-->
      <el-input
        v-model="listQuery.customer_phone"
        placeholder="请输入要查询的手机号"
        prefix-icon="el-icon-phone"
        clearable
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
      />
      <!--[按钮] 查询-->
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        style="margin-left: 20px"
        @click="handleFilter"
      >
        查询
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
        <el-table-column
          :key="index"
          :prop="item.field_name"
          :label="item.label"
          align="center"
        />
      </template>
      <!-- 操作列 -->
      <template>
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="{ row }">
            <!-- eslint-disable-next-line -->
            <el-popconfirm iconColor="red" title="确定消单吗？" @onConfirm="handleDelete(row)">
              <el-button slot="reference" size="mini" type="danger" plain>消单</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="refresh" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { deleteOrderPark, ListOrderPark } from '@/api/order-manage'
export default {
  name: 'OrderPark',
  components: { Pagination },
  data() {
    return {
      // 业务数据
      listQuery: {}, // 查询条件
      list: null, // 列表数据
      total: 0, // 总条数

      // 组件数据
      branchOptions: [],
      selected_branch_uid: '',
      // 表头数据
      tableHead: [
        { field_name: 'branch_name', label: '网点名称' },
        { field_name: 'machine_address', label: '网点地址' },
        { field_name: 'customer_phone', label: '用户手机号' },
        { field_name: 'order_time', label: '停车开始时间' },
        { field_name: 'order_status', label: '停车单状态' }
      ],

      // 表格属性
      tableKey: 0, // 优化 Vue 渲染需要的 key
      listLoading: true // 表格 loading 动画
    }
  },
  created() {
    // 初始化查询条件
    this.parseQuery()
  },
  mounted() {
    this.getList()
  },
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
    /**
     * 初始化查询条件
     */
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

    /**
     * 请求表格数据
     */
    getList() {
      this.listLoading = true
      ListOrderPark(this.listQuery)
        .then(response => {
          const {
            data,
            total
          } = response
          this.list = data
          this.total = total
          this.listLoading = false
        })
    },

    /**
     * 查询条件变化后的处理函数
     */
    handleFilter() {
      this.listQuery.page = 1
      this.refresh()
    },

    /**
     * 发起 push 带参刷新 url
     */
    refresh() {
      this.$router.push({
        path: '/order-manage/order-park',
        query: this.listQuery
      })
    },

    // 消单
    handleDelete: async function(row) {
      const res = await deleteOrderPark(row)
      console.log(res.msg)
      if (res.msg === '操作成功') {
        this.$notify({ title: '操作成功', message: '此停车单已取消', type: 'success' })
      } else if (res.msg === '操作失败') {
        this.$notify({ title: '无法消单', message: '此订单无法取消', type: 'error' })
      } else {
        this.$notify({ title: '操作失败', message: '抱歉，无法进行该操作', type: 'warning' })
      }
      this.getList()
    }
  }
}
</script>
