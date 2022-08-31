<template>
  <div class="app-container">
    <!-- 顶部搜索条件 -->
    <div class="filter-container">
      <txt class="filter-item">区域</txt>
      <el-cascader
        v-model="listQuery.regionCode"
        :options="regions"
        class="filter-item"
        clearable
        placeholder="请选择统计区域"
      />

      <txt class="filter-item">充值时段</txt>
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
        style="margin-left: 10px"
        @click="handleDownload"
      >
        导出
      </el-button>
    </div>
    <!-- 搜索结果列表 -->
    <el-table :key="tableKey" v-loading="listLoading" :data="list" fit highlight-current-row show-summary style="width: 100%;">
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
// npm 包
import { regionDataPlus } from 'element-china-area-data'
// 组件
import Pagination from '@/components/Pagination'
// API
import { ListTopupOrder, ExportSummaryTopup } from '@/api/finance'

export default {
  name: 'TopupOrderList',
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

      // 区域下拉菜单选项
      regions: regionDataPlus,

      // 表头数据
      tableHead: [
        { field_name: 'branch_name', label: '网点名称' },
        { field_name: 'province', label: '省区' },
        { field_name: 'city', label: '市区' },
        { field_name: 'area', label: '县区' },
        { field_name: 'topup_rmb', label: '人民币充值' },
        { field_name: 'topup_coin', label: '洗车币充值' },
        { field_name: 'topup_coin_bonus', label: '赠送洗车币' },
        { field_name: 'topup_all', label: '总充值' }
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
      ListTopupOrder(this.listQuery).then(response => {
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
        path: '/finance/topup-order-list',
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

      ExportSummaryTopup(this.listQuery).then(response => {
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
            filename: '小微自助洗车-充值统计',
            autoWidth: true,
            bookType: 'xlsx'
          })
          this.listLoading = false
        })
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
