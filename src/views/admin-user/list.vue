<template>
  <div class="app-container">
    <!-- 顶部搜索条件 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.username"
        clearable
        placeholder="管理员名称"
        style="width: 200px;"
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
      <template v-for="(item, index) in tableHead">
        <el-table-column :key="index" :prop="item.field_name" :label="item.label" align="center" :formatter="tableColumnFormatter" />
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
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="refresh" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { listAdminUser, deleteAdminUser } from '@/api/user'

export default {
  name: 'AdminUserList',
  components: { Pagination },
  filters: {},
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {},
      tableHead: [
        { field_name: 'admin_id', label: '编号' },
        { field_name: 'username', label: '管理员' },
        { field_name: 'password', label: '密码' },
        { field_name: 'admin_role', label: '权限' },
        { field_name: 'admin_status', label: '状态' }
      ],
      show_action: true
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
        path: '/admin-user/list',
        query: this.listQuery
      })
    },
    getList() {
      this.listLoading = true
      listAdminUser(this.listQuery).then(response => {
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
      this.$router.push(`/admin-user/edit/${row.admin_id}`)
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该管理员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAdminUser(row.admin_id).then(response => {
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
    // 处理 新增操作 的函数
    handleCreate() {
      this.$router.push(`/admin-user/create`)
    },
    // 表格内容替换
    tableColumnFormatter(row, column) {
      switch (column.property) {
        case 'admin_status':
          switch (row.admin_status) {
            case 1:
              return '活跃'
            case 2:
              return '禁用'
          }
          break
        case 'admin_role':
          switch (row.admin_role) {
            case 'admin':
              return '管理人员'
            case 'editor':
              return '工作人员'
          }
          break
        default:
          // 返回其他不需要处理的正常参数
          return row[column.property]
      }
    }
  }
}
</script>
