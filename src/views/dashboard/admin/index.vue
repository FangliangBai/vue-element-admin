<template>
  <div class="dashboard-editor-container">
    <!-- 顶部数据栏 -->
    <panel-group />
    <!-- 统计选项卡 -->
    <el-tabs v-model="activeName">
      <el-tab-pane label="消费统计" name="消费统计">
        <el-card class="box-card" style="margin-bottom:32px;">
          <txt style="margin-left: 10px;">单位时段</txt>
          <el-select
            v-model="unitTime"
            placeholder="请选择"
            style="margin-left: 10px;"
          >
            <el-option
              v-for="item in timeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <txt style="margin-left: 20px;">地区范围</txt>
          <el-select
            v-model="unitRegion"
            placeholder="请选择"
            style="margin-left: 10px;"
          >
            <el-option
              v-for="item in regionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input
            v-model="target"
            placeholder="请输入内容"
            style="width: 200px; margin-left: 10px;"
          />
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            style="margin-left: 20px"
            @click="summarizeServiceFigure"
          >
            查询
          </el-button>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="充值统计" name="充值统计">
        <el-card class="box-card" style="margin-bottom:32px;">
          <txt style="margin-left: 10px;">单位时段</txt>
          <el-select
            v-model="unitTime"
            placeholder="请选择"
            style="margin-left: 10px;"
          >
            <el-option
              v-for="item in timeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            style="margin-left: 20px"
            @click="summarizeTopupFigure"
          >
            查询
          </el-button>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <!-- 折线图 -->
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import { getServiceData, getTopupData } from '@/api/dashboard'

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
      activeName: '消费统计',
      // 单位时段
      timeOptions: [{
        value: 'day',
        label: '日'
      }, {
        value: 'week',
        label: '周'
      }, {
        value: 'month',
        label: '月'
      }, {
        value: 'year',
        label: '年'
      }],
      unitTime: 'day',
      // 地区范围
      regionOptions: [{
        value: 'machine',
        label: '设备'
      }, {
        value: 'branch',
        label: '网点'
      }, {
        value: 'cityCode',
        label: '区号'
      }],
      unitRegion: 'machine',
      target: ''
    }
  },
  mounted() {
    // this.summarizeServiceFigure()
  },
  methods: {
    // 获取 消费统计 图表数据
    summarizeServiceFigure() {
      const query = {
        groupBy: this.unitTime,
        region: this.unitRegion,
        target: this.target
      }
      getServiceData(query).then(response => {
        const {
          data
        } = response
        const chartData = {
          xAxisLabel: [],
          data: [],
          legend: '洗车次数'
        }
        data.forEach(item => {
          chartData.xAxisLabel.push(item.xAxisLabel)
          chartData.data.push(item.data)
        })
        this.lineChartData = chartData
      })
    },
    // 获取 充值统计 图表数据
    summarizeTopupFigure() {
      const query = {
        groupBy: this.unitTime
      }
      getTopupData(query).then(response => {
        const {
          data
        } = response
        const chartData = {
          xAxisLabel: [],
          data: [],
          legend: '充值次数'
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
