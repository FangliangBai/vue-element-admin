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
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
      />
      <!--[输入框] 手机号-->
      <el-input
        v-model="listQuery.customer_phone"
        placeholder="请输入手机号"
        prefix-icon="el-icon-phone"
        clearable
        style="width: 160px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
      />
      <!--[选择器] 充值类型-->
      <el-select
        v-model="listQuery.topup_type"
        placeholder="请选择充值类型"
        class="filter-item"
      >
        <el-option
          v-for="item in topupTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <!--[时间选择器] 充值时段-->
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
            <div v-if="row.topup_type === '洗车币'">
              <!-- eslint-disable-next-line -->
              <el-popconfirm iconColor="red" title="确定退款吗？" @onConfirm="handleRefund(row)">
                <el-button slot="reference" size="mini" type="danger" plain>退款</el-button>
              </el-popconfirm>
            </div>
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
import { ExportOrderTopup, ListOrderTopup, refundTopup } from '@/api/order-manage'

export default {
  name: 'OrderTopup',
  components: { Pagination },
  filters: {},
  data() {
    return {
      /**
       * 查询条件
       */
      // [选择器] 充值类型
      topupTypeOptions: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '人民币',
          value: 'rmb'
        },
        {
          label: '洗车币',
          value: 'coin'
        }
      ],

      /**
       * 表格属性
       */
      tableKey: 0, // 优化 Vue 渲染需要
      // 表头数据
      tableHead: [
        { field_name: 'topup_uid', label: '订单号' },
        { field_name: 'customer_name', label: '用户名称' },
        { field_name: 'topup_type', label: '充值类型' },
        { field_name: 'topup_time', label: '充值时间' },
        { field_name: 'topup_rmb', label: '人民币充值 (元)' },
        { field_name: 'topup_coin', label: '洗车币充值 (元)' },
        { field_name: 'topup_coin_bonus', label: '赠送洗车币赠送 (元)' }
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
      ListOrderTopup(this.listQuery).then(response => {
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
     * 发起 push 带参刷新 url
     */
    refresh() {
      this.$router.push({
        path: '/order-manage/order-topup',
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

      ExportOrderTopup(this.listQuery).then(response => {
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
            filename: '小微自助洗车-充值记录',
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
    },

    /**
     * 格式化表格内容
     * 暂时不用
     */
    tableFormatter(row, column) {
      if (column.property === 'topup_type') {
        if (row.topup_type === 'rmb') {
          return '人民币充值'
        } else {
          return '洗车币充值'
        }
      } else {
        return row[column.property]
      }
    },

    // 充值退款
    handleRefund(row) {
      refundTopup(row).then(res => {
        if (res.msg === '退款成功') {
          this.$notify({ title: '操作成功', message: res.msg, type: 'success' })
        } else if (res.msg === '退款失败') {
          this.$notify({ title: '无法退款', message: res.data, type: 'error' })
        } else {
          this.$notify({ title: '操作失败', message: '抱歉，无法进行操作', type: 'warning' })
        }
        this.getList()
      })
    }
  }
}
</script>
