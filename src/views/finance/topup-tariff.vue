<template>
  <div class="createPost-container">

    <!-- 吸顶按钮组 -->
    <sticky
      :z-index="1"
      :class-name="'sub-navbar '+'published'"
    >
      <el-button
        v-loading="loading"
        icon="el-icon-success"
        style="margin-left: 10px;"
        type="success"
        @click="submitForm"
      >
        设定
      </el-button>
    </sticky>

    <el-form
      ref="elForm"
      :model="TopupTariff"
      class="createPost-main-container"
    >

      <!-- 网点选择 -->
      <aside>定价网点</aside>

      <txt class="filter-item">网点选择: </txt>

      <!-- [选择器] 网点 -->
      <el-select
        v-model="selected_branch_uid"
        class="filter-item"
        placeholder="请选择网点"
        clearable
        filterable
        style="margin: 20px; width: 20%;"
        @change="getTariff()"
      >
        <el-option
          v-for="item in branchOptions"
          :key="item.branch_uid"
          :label="item.branch_name"
          :value="item.branch_uid"
        />
      </el-select>

      <!-- 充值设定 -->
      <aside>充值设定</aside>

      <el-divider><i class="el-icon-coin" /> 充值设定 - 洗车币 (元) </el-divider>
      <el-row>
        <el-col :span="8">
          <el-form-item label="充值选项 1">
            <el-input-number
              v-model="TopupTariff.tariff_coin.opt1"
              placeholder="请输入充值金额"
              :step="1"
              :min="0"
            />
          </el-form-item>
          <el-form-item label="充值选项 2">
            <el-input-number
              v-model="TopupTariff.tariff_coin.opt2"
              placeholder="请输入充值金额"
              :step="1"
              :min="0"
            />
          </el-form-item>
          <el-form-item label="充值选项 3">
            <el-input-number
              v-model="TopupTariff.tariff_coin.opt3"
              placeholder="请输入充值金额"
              :step="1"
              :min="0"
            />
          </el-form-item>
          <el-form-item label="充值选项 4">
            <el-input-number
              v-model="TopupTariff.tariff_coin.opt4"
              placeholder="请输入充值金额"
              :step="1"
              :min="0"
            />
          </el-form-item>
          <el-form-item label="充值选项 5">
            <el-input-number
              v-model="TopupTariff.tariff_coin.opt5"
              placeholder="请输入充值金额"
              :step="1"
              :min="0"
            />
          </el-form-item>
          <el-form-item label="充值选项 6">
            <el-input-number
              v-model="TopupTariff.tariff_coin.opt6"
              placeholder="请输入充值金额"
              :step="1"
              :min="0"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="赠币选项 1">
            <el-input-number
              v-model="TopupTariff.tariff_bonus.opt1"
              placeholder="请输入赠币金额"
              :step="1"
              :min="0"
            />
          </el-form-item>
          <el-form-item label="赠币选项 2">
            <el-input-number
              v-model="TopupTariff.tariff_bonus.opt2"
              placeholder="请输入赠币金额"
              :step="1"
              :min="0"
            />
          </el-form-item>
          <el-form-item label="赠币选项 3">
            <el-input-number
              v-model="TopupTariff.tariff_bonus.opt3"
              placeholder="请输入赠币金额"
              :step="1"
              :min="0"
            />
          </el-form-item>
          <el-form-item label="赠币选项 4">
            <el-input-number
              v-model="TopupTariff.tariff_bonus.opt4"
              placeholder="请输入赠币金额"
              :step="1"
              :min="0"
            />
          </el-form-item>
          <el-form-item label="赠币选项 5">
            <el-input-number
              v-model="TopupTariff.tariff_bonus.opt5"
              placeholder="请输入赠币金额"
              :step="1"
              :min="0"
            />
          </el-form-item>
          <el-form-item label="赠币选项 6">
            <el-input-number
              v-model="TopupTariff.tariff_bonus.opt6"
              placeholder="请输入赠币金额"
              :step="1"
              :min="0"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider><i class="el-icon-money" /> 充值设定 - 人民币 (元) </el-divider>
      <el-row>
        <el-col :span="8">
          <el-form-item label="充值选项 1">
            <el-input-number
              v-model="TopupTariff.tariff_rmb.opt1"
              placeholder="请输入充值金额"
              :step="1"
              :min="0"
            />
          </el-form-item>
          <el-form-item label="充值选项 2">
            <el-input-number
              v-model="TopupTariff.tariff_rmb.opt2"
              placeholder="请输入充值金额"
              :step="1"
              :min="0"
            />
          </el-form-item>
          <el-form-item label="充值选项 3">
            <el-input-number
              v-model="TopupTariff.tariff_rmb.opt3"
              placeholder="请输入充值金额"
              :step="1"
              :min="0"
            />
          </el-form-item>
          <el-form-item label="充值选项 4">
            <el-input-number
              v-model="TopupTariff.tariff_rmb.opt4"
              placeholder="请输入充值金额"
              :step="1"
              :min="0"
            />
          </el-form-item>
          <el-form-item label="充值选项 5">
            <el-input-number
              v-model="TopupTariff.tariff_rmb.opt5"
              placeholder="请输入充值金额"
              :step="1"
              :min="0"
            />
          </el-form-item>
          <el-form-item label="充值选项 6">
            <el-input-number
              v-model="TopupTariff.tariff_rmb.opt6"
              placeholder="请输入充值金额"
              :step="1"
              :min="0"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
// 组件
import Sticky from '@/components/Sticky'
// API
import { getBranchOptions, getTopupTariff, updateTopupTariff } from '@/api/finance'

export default {
  name: 'TopupTariff',
  components: { Sticky },
  data() {
    return {
      // ---- 组件数据 ----
      // 网点选择器
      branchOptions: [],
      selected_branch_uid: '',

      // ---- 业务数据 ----
      TopupTariff: {
        tariff_coin: {
          opt1: 0,
          opt2: 0,
          opt3: 0,
          opt4: 0,
          opt5: 0,
          opt6: 0
        },
        tariff_bonus: {
          opt1: 0,
          opt2: 0,
          opt3: 0,
          opt4: 0,
          opt5: 0,
          opt6: 0
        },
        tariff_rmb: {
          opt1: 0,
          opt2: 0,
          opt3: 0,
          opt4: 0,
          opt5: 0,
          opt6: 0
        }
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    // 获取网点选项
    this.getBranchOptions()
  },
  mounted() {},
  methods: {
    // 获取网点列表
    getBranchOptions() {
      getBranchOptions().then(res => {
        this.branchOptions = res.data
      })
    },

    // 根据选择网点, 获取相应充值定价
    getTariff() {
      getTopupTariff(this.selected_branch_uid).then(response => {
        if (response.data) {
          this.TopupTariff = response.data
          this.$notify({
            title: '获取成功',
            message: '已获取到该网点的充值定价表',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '该网点暂无充值定价',
            message: '请设置此网点的服务价格',
            type: 'success',
            duration: 2000
          })
        }
      })
    },

    // 更新信息到数据库
    submitForm() {
      this.loading = true

      // ---- 数据预处理 ----
      // 对象转换
      const TopupTariff = Object.assign({}, this.TopupTariff)
      //
      // TopupTariff 加上 branch_uid
      TopupTariff.branch_uid = this.selected_branch_uid

      updateTopupTariff(TopupTariff).then(() => {
        this.loading = false
        this.$notify({
          title: '更新成功',
          message: '更新入数据库',
          type: 'success',
          duration: 2000
        })
      }).catch(() => {
        this.loading = false
        this.$notify({
          title: '更新失败',
          message: '无法更新入数据库',
          type: 'error',
          duration: 2000
        })
      })
    }
  }
}

</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .preview-img {
      width: 200px;
      height: 270px;
    }

    .contents-wrapper {
      padding: 5px 0;
    }
  }
}
</style>
