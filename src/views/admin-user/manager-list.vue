<template>
  <div class="app-container">
    <!-- 顶部搜索条件 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.manager_name"
        clearable
        placeholder="名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
      />
      <el-input
        v-model="listQuery.manager_phone"
        clearable
        placeholder="手机号"
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
      <el-table-column align="center" label="编号">
        <template slot-scope="scope">
          <span>{{ scope.row.manager_uid }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.manager_name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系电话">
        <template slot-scope="scope">
          <span>{{ scope.row.manager_phone }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" fixed="right">
        <template slot-scope="{ row }">
          <el-button type="text" icon="el-icon-edit" @click="handleUpdate(row)" />
          <el-button type="text" icon="el-icon-delete" style="margin-left:20px; color:#f56c6c" @click="handleDelete(row)" />
        </template>
      </el-table-column>
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
import { listManager, deleteManager } from '@/api/user'
import Pagination from '@/components/Pagination'

export default {
  name: 'ManagerList',
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
      listManager(this.listQuery).then(response => {
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
        path: '/admin-user/manager-list',
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
     * 处理 更新操作 的函数
     */
    handleUpdate(row) {
      this.$router.push(`/admin-user/manager-edit/${row.manager_uid}`)
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
        deleteManager(row.manager_uid).then(response => {
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
      this.$router.push(`/admin-user/manager-create`)
    }
  }
}
</script>
