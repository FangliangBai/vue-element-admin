<template>
  <div class="app-container">
    <!-- 顶部搜索条件 -->
    <div class="filter-container">
      <!-- 设备编号 -->
      <el-input
        v-model="listQuery.machine_uid"
        clearable
        placeholder="编号"
        style="width: 200px;"
        class="filter-item"
      />
      <!-- 设备区域 -->
      <el-cascader
        v-model="listQuery.regionCode"
        :options="regions"
        class="filter-item"
        clearable
        placeholder="设备所在区域"
      />
      <!-- 设备状态 -->
      <el-select v-model="listQuery.machine_status" placeholder="请选择设备状态" class="filter-item" clearable>
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <!-- 最后活动时间 -->
      <el-select v-model="listQuery.active_time_interval" placeholder="最后活动时间" class="filter-item" clearable>
        <el-option
          v-for="item in activeTimeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

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
      stripe
      highlight-current-row
      style="width: 100%;"
    >
      <!-- 数据列 -->
      <template v-for="(item, index) in tableHead">
        <el-table-column :key="index" :prop="item.field_name" :label="item.label" align="center" />
      </template>
      <!-- 操作列 -->
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
import { listMachine, deleteMachine, ExportMachines } from '@/api/machine'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { regionDataPlus } from 'element-china-area-data'

export default {
  name: 'MachineList',
  components: { Pagination },
  filters: {},
  data() {
    return {
      /**
       * 组件数据
       */
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {},
      // 表头数据
      tableHead: [
        { field_name: 'machine_uid', label: '设备编号' },
        { field_name: 'machine_name', label: '设备名称' },
        { field_name: 'branch_name', label: '网点名称' },
        { field_name: 'machine_status', label: '设备状态' },
        { field_name: 'last_active_time', label: '最后活动时间' },
        { field_name: 'address', label: '地址' }
      ],
      statusOptions: [
        { value: '启用', label: '启用' },
        { value: '故障', label: '故障' },
        { value: '未注册', label: '未注册' },
        { value: '离线', label: '离线' },
        { value: '维修', label: '维修' },
        { value: '运行中', label: '运行中' }
      ],
      activeTimeOptions: [
        { value: '7', label: '一周前' },
        { value: '30', label: '一个月前' },
        { value: '90', label: '三个月前' }
      ],
      show_action: true, // 显示操作列
      /**
       * 省市区的下拉菜单选项
       */
      regions: regionDataPlus
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
        path: '/machine/list',
        query: this.listQuery
      })
    },
    getList() {
      this.listLoading = true
      listMachine(this.listQuery).then(response => {
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
      this.$router.push(`/machine/edit/${row.machine_uid}`)
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该洗车机, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMachine(row.machine_uid).then(response => {
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
    handleCreate() {
      this.$router.push(`/machine/create`)
    },

    // Excel 导出所有设备
    handleDownload() {
      this.listLoading = true
      ExportMachines().then(response => {
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
            filename: '小微自助洗车-设备列表',
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
