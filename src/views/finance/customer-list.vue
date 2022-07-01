<template>
  <div class="app-container">
    <!-- 顶部搜索条件 -->
    <div class="filter-container">
      <txt class="filter-item">注册时段</txt>
      <el-date-picker
        v-model="listQuery.dateRange"
        value-format="yyyy-MM-dd"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        clearable
        style="margin-left: 10px; vertical-align: top;"
      />
      <!-- 用户手机号 -->
      <txt class="filter-item">用户手机号</txt>
      <el-input
        v-model="listQuery.customer_phone"
        clearable
        placeholder="手机号"
        style="width: 200px;"
        class="filter-item"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        style="margin-left: 10px"
        @click="handleFilter"
      >
        查询
      </el-button>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        style="margin-left: 10px;"
        @click="handleDownload"
      >
        导出
      </el-button>
    </div>
    <!-- 搜索结果列表 -->
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
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
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { listCustomer } from '@/api/finance'

export default {
  name: 'CustomerList',
  components: { Pagination },
  filters: {},
  data() {
    return {
      tableKey: 0,
      list: null, // 表格数据
      total: 0, // 总条数
      listLoading: true, // 表格 loading 动画
      listQuery: {}, // 查询条件
      dateRange: '', // 查询时间范围 格式：[ "2021-12-01", "2022-01-03" ]
      /**
       * 表格相关设置参数
       */
      // 默认表头数据
      tableHead: [
        { field_name: 'customer_name', label: '微信名' },
        { field_name: 'register_time', label: '注册日期' },
        { field_name: 'customer_phone', label: '手机号' },
        { field_name: 'customer_plate', label: '车牌号' },
        { field_name: 'car_type', label: '车型' },
        { field_name: 'customer_tier', label: '用户等级' },
        { field_name: 'topup_rmb', label: '累计充值人民币总额' },
        { field_name: 'topup_coin', label: '累计充值洗车币总额' },
        { field_name: 'topup_coin_bonus', label: '累计附赠洗车币总额' },
        { field_name: 'cost_rmb', label: '累计消费人民币总额' },
        { field_name: 'cost_coin', label: '累计消费洗车币总额' },
        { field_name: 'balance_rmb', label: '人民币余额' },
        { field_name: 'balance_coin', label: '洗车币余额' }
      ]
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
     * 初始化查询条件对象
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
      listCustomer(this.listQuery).then(response => {
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
        path: '/finance/customer-list',
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
        const list = this.list
        // 解析、格式化表头与数据
        const data = this.formatJson(parseHeader, list)
        // 导出数据
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '',
          autoWidth: true,
          bookType: 'xlsx'
        })
        this.listLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    }
  }
}
</script>
