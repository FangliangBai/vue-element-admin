<template>
  <div class="app-container">
    <!-- 顶部搜索条件 -->
    <div class="filter-container">
      <txt class="filter-item">统计分类</txt>
      <el-select
        v-model="listQuery.groupBy"
        placeholder="统计分类"
        class="filter-item"
      >
        <el-option v-for="item in groupByOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <txt class="filter-item">消费时段</txt>
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
    <!-- 结果列表 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="handleSortChange"
    >
      <el-table-column
        type="expand"
      >
        <template slot-scope="props">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="冲水时长: ">
                  <span>{{ props.row.service_time.water }} 秒</span>
                </el-form-item>
                <el-form-item label="打沫时长: ">
                  <span>{{ props.row.service_time.froth }} 秒</span>
                </el-form-item>
                <el-form-item label="吸尘时长: ">
                  <span>{{ props.row.service_time.hoover }} 秒</span>
                </el-form-item>
                <el-form-item label="臭氧时长: ">
                  <span>{{ props.row.service_time.ozone }} 秒</span>
                </el-form-item>
                <el-form-item label="吹风时长: ">
                  <span>{{ props.row.service_time.blower }} 秒</span>
                </el-form-item>
                <el-form-item label="热风时长: ">
                  <span>{{ props.row.service_time.dryer }} 秒</span>
                </el-form-item>
                <el-form-item label="暂停时长: ">
                  <span>{{ props.row.service_time.pause }} 秒</span>
                </el-form-item>
                <el-form-item label="水龙头时长: ">
                  <span>{{ props.row.service_time.tap }} 秒</span>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="12">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="冲水消费: ">
                  <span>{{ props.row.service_cost.water }} 元</span>
                </el-form-item>
                <el-form-item label="打沫消费: ">
                  <span>{{ props.row.service_cost.froth }} 元</span>
                </el-form-item>
                <el-form-item label="吸尘消费: ">
                  <span>{{ props.row.service_cost.hoover }} 元</span>
                </el-form-item>
                <el-form-item label="臭氧消费: ">
                  <span>{{ props.row.service_cost.ozone }} 元</span>
                </el-form-item>
                <el-form-item label="吹风消费: ">
                  <span>{{ props.row.service_cost.blower }} 元</span>
                </el-form-item>
                <el-form-item label="热风消费: ">
                  <span>{{ props.row.service_cost.dryer }} 元</span>
                </el-form-item>
                <el-form-item label="暂停消费: ">
                  <span>{{ props.row.service_cost.pause }} 元</span>
                </el-form-item>
                <el-form-item label="水龙头消费: ">
                  <span>{{ props.row.service_cost.tap }} 元</span>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <template v-for="(item, index) in tableHead">
        <el-table-column
          :key="index"
          :prop="item.field_name"
          :label="item.label"
          :sortable="item.field_name === 'count'?'custom':false"
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
import { washedNumGroupByMachine, washedNumGroupByBranch, washedNumGroupByCityCode, washedAll } from './utils/table-config'
import { listWashedOrder } from '@/api/finance'

export default {
  name: 'WashedOrderList',
  components: { Pagination },
  filters: {},
  data() {
    return {
      custom: false,
      tableKey: 0,
      list: null, // 表格数据
      total: 0, // 总条数
      listLoading: true, // 表格 loading 动画
      // 查询条件
      listQuery: {
        groupBy: 'machine_uid'
      },
      dateRange: '', // 查询时间范围 格式：[ "2021-12-01", "2022-01-03" ]
      groupByOptions: [
        {
          value: 'machine_uid', // 和数据库字段名相一致
          label: '设备'
        },
        {
          value: 'branch_name',
          label: '网点'
        },
        {
          value: 'city_code',
          label: '区号'
        },
        {
          value: 'all',
          label: '全部'
        }
      ],
      /**
       * 表格相关设置参数
       */
      // 默认表头数据
      tableHead: washedNumGroupByMachine.tableHead
    }
  },
  created() {
    // 设置查询条件
    this.parseQuery()
  },
  mounted() {
    // 向后台请求数据并展示
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
     * 设置查询条件对象
     */
    parseQuery() {
      // 初始化 默认条件
      let listQuery = {
        groupBy: 'machine_uid',
        order: 'desc',
        page: 1,
        pageSize: 20
      }
      // push route 带的条件
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
      listWashedOrder(this.listQuery).then(response => {
        const {
          data,
          total
        } = response
        this.list = data
        this.total = total
        // 根据 listQuery 动态加载表格样式
        switch (this.listQuery.groupBy) {
          case 'machine_uid':
            this.tableHead = washedNumGroupByMachine.tableHead
            break
          case 'branch_name':
            this.tableHead = washedNumGroupByBranch.tableHead
            break
          case 'city_code':
            this.tableHead = washedNumGroupByCityCode.tableHead
            break
          case 'all':
            this.tableHead = washedAll.tableHead
            break
          default:
            this.tableHead = washedNumGroupByMachine.tableHead
        }
        this.listLoading = false
      })
    },

    /**
     * router push 带参刷新 url
     */
    refresh() {
      this.$router.push({
        path: '/finance/washed-order-list',
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
     * 排序条件变化后处理函数
     */
    handleSortChange(column) {
      console.log(column.prop + '-' + column.order)
      if (column.order === 'descending') {
        this.listQuery.order = 'DESC'
      } else {
        this.listQuery.order = 'ASC'
      }
      this.getList()
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

<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
