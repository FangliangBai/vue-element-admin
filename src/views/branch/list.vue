<template>
  <div class="app-container">
    <!-- 顶部搜索条件 -->
    <div class="filter-container">
      <!-- 网点编号 -->
      <el-input
        v-model="listQuery.branch_uid"
        clearable
        placeholder="网点编号"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
      />
      <!-- 网点区域 -->
      <el-cascader
        v-model="listQuery.regionCode"
        :options="regions"
        class="filter-item"
        clearable
        placeholder="设备所在区域"
      />
      <!--[选择器] 网点状态-->
      <el-select
        v-model="listQuery.branch_status"
        placeholder="请选择网点状态"
        class="filter-item"
        clearable
      >
        <el-option
          v-for="item in branchStatusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <!-- 按钮 -->
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
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      fit
      highlight-current-row
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
// 第三方包
import { regionDataPlus } from 'element-china-area-data'
// API
import { listBranch, deleteBranch, ExportBranches } from '@/api/branch'
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
      listQuery: {},
      // 表头数据
      tableHead: [
        { field_name: 'branch_uid', label: '网点编号' },
        { field_name: 'branch_name', label: '网点名称' },
        { field_name: 'branch_status', label: '网点状态' },
        // { field_name: 'longitude', label: '经度' },
        // { field_name: 'latitude', label: '纬度' },
        { field_name: 'province', label: '省级区' },
        { field_name: 'city', label: '市级区' },
        { field_name: 'area', label: '县级区' },
        { field_name: 'address', label: '详细地址' }
      ],
      show_action: true, // 显示操作列
      // 市区的下拉菜单选项
      regions: regionDataPlus,
      // [选择器] 充值类型
      branchStatusOptions: [
        {
          label: '正常营业',
          value: '正常营业'
        },
        {
          label: '冬季营业',
          value: '冬季营业'
        },
        {
          label: '内部测试',
          value: '内部测试'
        },
        {
          label: '停止营业',
          value: '停止营业'
        }
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
    },
    /**
     * 处理 新增操作 的函数
     */
    handleCreate() {
      this.$router.push(`/branch/create`)
    },

    // Excel 导出所有设备
    handleDownload() {
      this.listLoading = true
      ExportBranches().then(response => {
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
            filename: '小微自助洗车-网点列表',
            autoWidth: true,
            bookType: 'xlsx'
          })
          this.listLoading = false
        })
      })
    },

    // 数据导出格式化
    formatJson(filterVal, jsonData) {
      return jsonData.map(
        v => filterVal.map(j => {
          return v[j]
        })
      )
    }
  }
}
</script>
