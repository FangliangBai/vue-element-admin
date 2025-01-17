<template>
  <div class="app-container">
    <!-- 顶部搜索条件 -->
    <div class="filter-container">
      <!--[输入框] 订单号-->
      <el-input
        v-model="listQuery.topup_uid"
        placeholder="请输入订单号"
        prefix-icon="el-icon-s-order"
        clearable
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
      />
      <!--[时间选择器] 退款时段-->
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
      <!--[按钮] 查询-->
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        style="margin-left: 10px"
        @click="handleFilter"
      >
        查询
      </el-button>
      <!--[按钮] 导出-->
      <el-button
        class="filter-item"
        icon="el-icon-download"
        style="margin-left: 10px"
        @click="handleDownload"
      >
        导出
      </el-button>
    </div>
    <!-- 搜索结果列表 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      :summary-method="getSummaries"
      fit
      stripe
      highlight-current-row
      show-summary
      style="width: 100%;"
    >
      <template v-for="(item, index) in tableHead">
        <el-table-column
          :key="index"
          :prop="item.field_name"
          :label="item.label"
          align="center"
        />
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
import { ExportOrderRefund, ListOrderRefund } from '@/api/order-manage'

export default {
  name: 'OrderRefund',
  components: { Pagination },
  filters: {},
  data() {
    return {
      /**
       * 查询条件
       */

      /**
       * 表格属性
       */
      tableKey: 0, // 优化 Vue 渲染需要
      // 表头数据
      tableHead: [
        { field_name: 'topup_uid', label: '订单号' },
        { field_name: 'customer_name', label: '用户名称' },
        { field_name: 'topup_type', label: '充值类型' },
        { field_name: 'refund_time', label: '退款时间' },
        { field_name: 'topup_rmb', label: '订单金额 (元)' },
        { field_name: 'refund_rmb', label: '实退金额 (元)' }
      ],
      listLoading: true, // 表格 loading 动画

      /**
       * 业务数据
       */
      listQuery: {}, // 查询条件
      list: null, // 列表数据
      total: 0 // 总条数

    }
  },
  created() {
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
     * 请求表格数据, 赋值给组件 data
     */
    getList() {
      this.listLoading = true
      ListOrderRefund(this.listQuery).then(response => {
        const {
          data,
          total
        } = response
        console.log(data)
        this.list = data
        this.total = total
        this.listLoading = false
      })
    },

    /**
     * 更新查询条件后, 发起 push 带参刷新 url
     */
    refresh() {
      this.$router.push({
        path: '/order-manage/order-refund',
        query: this.listQuery
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
     * Excel 导出数据
     */
    handleDownload() {
      this.listLoading = true

      ExportOrderRefund(this.listQuery).then(response => {
        const { data: list } = response

        import('@/vendor/Export2Excel').then(excel => {
          // Excel 显示表头
          const tHeader = []
          this.tableHead.forEach(item => {
            tHeader.push(item.label)
          })
          // 数据解析表头
          const parseHeader = []
          this.tableHead.forEach(item => {
            parseHeader.push(item.field_name)
          })
          // 解析、格式化表头与数据
          const data = this.formatJson(parseHeader, list)
          // 导出数据
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '小微自助洗车-退款记录',
            autoWidth: true,
            bookType: 'xlsx'
          })
          this.listLoading = false
        })
      })
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(
        v => filterVal.map(j => {
          return v[j]
        })
      )
    },

    /**
     * 表格合计函数
     */
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] += ' 元'
        } else {
          sums[index] = '-'
        }
      })
      return sums
    }
  }
}
</script>
