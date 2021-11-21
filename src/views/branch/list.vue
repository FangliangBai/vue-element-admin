<template>
  <div class="app-container">
    <!-- 顶部搜索条件 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.branch_uid"
        clearable
        placeholder="网点编号"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
      />
      <el-input
        v-model="listQuery.zip_code"
        clearable
        placeholder="邮编"
        style="width: 200px; margin-left: 10px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
      />
      <el-input
        v-model="listQuery.city_code"
        clearable
        placeholder="区号"
        style="width: 200px; margin-left: 10px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
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
    </div>
    <!-- 搜索结果列表 -->
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">

      <el-table-column width="120px" align="center" label="编号">
        <template slot-scope="scope">
          <span>{{ scope.row.branch_uid }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="180px" align="center" label="名称">
        <template slot-scope="scope">
          <span>{{ scope.row.branch_name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="经度">
        <template slot-scope="scope">
          <span>{{ scope.row.longitude }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="纬度">
        <template slot-scope="scope">
          <span>{{ scope.row.latitude }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="邮编">
        <template slot-scope="scope">
          <span>{{ scope.row.zip_code }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" align="center" label="区号">
        <template slot-scope="scope">
          <span>{{ scope.row.city_code }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100" align="center" label="地址">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100" align="center" label="洗车机数量">
        <template slot-scope="scope">
          <span>{{ scope.row.num_machines }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100" align="center" label="负责人">
        <template slot-scope="scope">
          <span>{{ scope.row.manager_name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120" align="center" label="操作" fixed="right">
        <template slot-scope="{ row }">
          <el-button type="text" icon="el-icon-edit" @click="handleUpdate(row)" />
          <el-button type="text" icon="el-icon-delete" style="margin-left:20px; color:#f56c6c" @click="handleDelete(row)" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="refresh" />
  </div>
</template>

<script>
import { listBranch, deleteBranch } from '@/api/branch'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'BranchList',
  components: { Pagination },
  filters: {},
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {}
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
    parseQuery() {
      // 收集查询条件
      const query = Object.assign({}, this.$route.query)
      let listQuery = {
        page: 1,
        pageSize: 20
      }
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
    refresh() {
      this.$router.push({
        path: '/branch/list',
        query: this.listQuery
      })
    },
    getList() {
      this.listLoading = true
      listBranch(this.listQuery).then(response => {
        const {
          data,
          total
        } = response
        this.list = data
        this.total = total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.refresh()
    },
    forceRefresh() {
      window.location.reload()
    },
    handleUpdate(row) {
      this.$router.push(`/branch/edit/${row.branch_uid}`)
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该网点, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteBranch(row.branch_uid).then(response => {
          this.$notify({
            title: '成功',
            message: response.msg || '删除成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      })
    }
  }
}
</script>
