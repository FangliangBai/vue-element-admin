<template>
  <div class="dashboard-editor-container">
    <!-- 顶部数据栏 -->
    <panel-group />

    <!-- 统计选项卡 -->
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="消费金额" name="消费金额">
        <el-card class="box-card" style="margin-bottom:10px;">
          <!-- 时间段 -->
          <el-date-picker
            v-model="dateRange"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
          />

          <!-- 统计单位 -->
          <el-select
            v-model="unitTime"
            placeholder="请选择统计时间单位"
            style="margin-left: 10px;"
          >
            <el-option
              v-for="item in timeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

          <!-- 统计区域 -->
          <el-cascader
            v-model="regionCode"
            :options="regions"
            style="margin-left: 10px;"
            clearable
            placeholder="统计区域"
          />

          <!-- 按钮 -->
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            style="margin-left: 20px"
            @click="summarizeSumService"
          >
            查询
          </el-button>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="洗车服务量" name="洗车服务量">
        <el-card class="box-card" style="margin-bottom:10px;">
          <!-- 时间段 -->
          <el-date-picker
            v-model="dateRange"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
          />

          <!-- 统计单位 -->
          <el-select
            v-model="unitTime"
            placeholder="请选择统计时间单位"
            style="margin-left: 10px;"
          >
            <el-option
              v-for="item in timeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

          <!-- 统计区域 -->
          <el-cascader
            v-model="regionCode"
            :options="regions"
            style="margin-left: 10px;"
            clearable
            placeholder="统计区域"
          />

          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            style="margin-left: 20px"
            @click="summarizeNumService"
          >
            查询
          </el-button>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="充值金额" name="充值金额">
        <el-card class="box-card" style="margin-bottom:10px;">
          <!-- 时间段 -->
          <el-date-picker
            v-model="dateRange"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
          />

          <!-- 统计单位 -->
          <el-select
            v-model="unitTime"
            placeholder="请选择统计时间单位"
            style="margin-left: 10px;"
          >
            <el-option
              v-for="item in timeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

          <!-- 统计区域 -->
          <el-cascader
            v-model="regionCode"
            :options="regions"
            style="margin-left: 10px;"
            clearable
            placeholder="统计区域"
          />

          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            style="margin-left: 20px"
            @click="summarizeSumTopup"
          >
            查询
          </el-button>
        </el-card>
      </el-tab-pane>

      <!-- 折线图 -->
      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <line-chart :chart-data="lineChartData" />
      </el-row>
    </el-tabs>
  </div>
</template>

<script>
// 第三方包
import { regionDataPlus } from 'element-china-area-data'
// 组件
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
// API
import { getSumService, getNumService, getSumTopup } from '@/api/dashboard'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart
  },
  data() {
    return {
      lineChartData: '', // 图标数据
      /**
       * 消费统计 Tab
       */
      activeName: '消费金额',
      // 时间范围
      dateRange: [],
      // 单位时段
      timeOptions: [{
        value: 'day',
        label: '日汇总'
      }, {
        value: 'week',
        label: '周汇总'
      }, {
        value: 'month',
        label: '月汇总'
      }, {
        value: 'year',
        label: '年汇总'
      }],
      unitTime: 'day',
      /**
       * 省市区的下拉菜单选项
       */
      regions: regionDataPlus,
      regionCode: ['']
    }
  },
  mounted() {
    // 初始化查询条件
    const end = new Date()
    const start = new Date()
    start.setMonth(start.getMonth() - 6)
    this.dateRange = [start, end]
    this.summarizeSumService()
  },
  methods: {
    // 获取 消费金额 图表数据
    summarizeSumService() {
      const query = {
        dateRange: this.dateRange,
        groupBy: this.unitTime,
        regionCode: this.regionCode
      }
      getSumService(query).then(response => {
        const {
          data
        } = response
        const chartData = {
          xAxisLabel: [],
          data: [],
          legend: '消费金额'
        }
        data.forEach(item => {
          chartData.xAxisLabel.push(item.xAxisLabel)
          chartData.data.push(item.data)
        })
        this.lineChartData = chartData
      })
    },

    // 获取 洗车服务量 图表数据
    summarizeNumService() {
      const query = {
        dateRange: this.dateRange,
        groupBy: this.unitTime,
        regionCode: this.regionCode
      }
      getNumService(query).then(response => {
        const {
          data
        } = response
        const chartData = {
          xAxisLabel: [],
          data: [],
          legend: '洗车服务量'
        }
        data.forEach(item => {
          chartData.xAxisLabel.push(item.xAxisLabel)
          chartData.data.push(item.data)
        })
        this.lineChartData = chartData
      })
    },

    // 获取 充值金额 图表数据
    summarizeSumTopup() {
      const query = {
        dateRange: this.dateRange,
        groupBy: this.unitTime,
        regionCode: this.regionCode
      }
      getSumTopup(query).then(response => {
        const {
          data
        } = response
        const chartData = {
          xAxisLabel: [],
          data: [],
          legend: '充值金额'
        }
        data.forEach(item => {
          chartData.xAxisLabel.push(item.xAxisLabel)
          chartData.data.push(item.data)
        })
        this.lineChartData = chartData
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
