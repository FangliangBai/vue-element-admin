<template>
  <div class="app-container">
    <!-- 顶部搜索条件 -->
    <div class="filter-container">
      <txt class="filter-item">统计分类</txt>
      <el-select
        v-model="listQuery.groupBy"
        placeholder="聚合类"
        clearable
        class="filter-item"
      >
        <el-option v-for="item in groupByOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <txt class="filter-item">运营时段</txt>
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
        type="info"
        icon="el-icon-plus"
        style="margin-left: 10px"
        @click="handleCreate"
      >
        新增
      </el-button>
    </div>
    <!-- 搜索结果列表 -->
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <template v-for="(item, index) in tableHead">
        <el-table-column :key="index" :prop="item.field_name" :label="item.label" align="center" />
      </template>
      <template v-if="show_action">
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template slot-scope="{ row }">
            <el-button type="text" icon="el-icon-edit" @click="handleUpdate(row)" />
            <el-button type="text" icon="el-icon-delete" style="margin-left:20px; color:#f56c6c" @click="handleDelete(row)" />
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
import { operationDefault, operationGroupByMachine, operationGroupByBranch } from './utils/table-config'
import { listOperation, deleteOperation } from '@/api/finance'

export default {
  name: 'OperationList',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null, // 表格数据
      total: 0, // 总条数
      listLoading: true, // 表格 loading 动画
      listQuery: {}, // 查询条件
      dateRange: '', // 查询时间范围 格式：[ "2021-12-01", "2022-01-03" ]
      groupBy: '', // 聚类字段
      groupByOptions: [
        {
          value: 'machine_name', // 和数据库字段名相一致
          label: '设备'
        },
        {
          value: 'branch_name',
          label: '网点'
        }
      ],
      /**
       * 表格相关设置参数
       */
      // 默认表头数据
      tableHead: operationDefault.tableHead,
      show_action: true // 显示操作栏
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
      listOperation(this.listQuery).then(response => {
        const {
          data,
          total
        } = response
        this.list = data
        this.total = total
        // 根据 listQuery 动态加载表头样式
        switch (this.listQuery.groupBy) {
          case 'machine_name':
            this.tableHead = operationGroupByMachine.tableHead
            this.show_action = false
            break
          case 'branch_name':
            this.tableHead = operationGroupByBranch.tableHead
            this.show_action = false
            break
          default:
            this.tableHead = operationDefault.tableHead
            this.show_action = true
            break
        }
        this.listLoading = false
      })
    },

    /**
     * 发起 push 带参刷新 url
     */
    refresh() {
      this.$router.push({
        path: '/finance/operation-list',
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
     * 处理 删除操作 的函数
     */
    handleDelete(row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteOperation(row.operation_uid).then(response => {
          this.$notify({
            title: '成功',
            message: response.msg || '删除成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      })
    },

    /**
     * 处理 新增操作 的函数
     */
    handleCreate() {
      this.$router.push(`/finance/operation-create`)
    },

    /**
     * 处理 更新操作 的函数
     */
    handleUpdate(row) {
      this.$router.push(`/finance/operation-edit/${row.operation_uid}`)
    }
  }
}
</script>
