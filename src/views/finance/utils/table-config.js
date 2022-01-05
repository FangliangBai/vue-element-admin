/**
 * maintain-list 页面的 Table 配置
 */
const maintainDefault = {
  tableHead: [
    { field_name: 'maintain_uid', label: '立项号' },
    { field_name: 'branch_name', label: '网点名称' },
    { field_name: 'machine_name', label: '设备名称' },
    { field_name: 'maintainer_name', label: '维护人' },
    { field_name: 'maintain_time', label: '维护时间' },
    { field_name: 'cost_labour', label: '人工费用' },
    { field_name: 'cost_nozzle', label: '枪头维修费用' },
    { field_name: 'cost_tube', label: '软管维修费用' },
    { field_name: 'cost_pump', label: '水泵维修费用' },
    { field_name: 'cost_hoover', label: '吸尘维修费用' },
    { field_name: 'cost_button', label: '按键维修费用' },
    { field_name: 'cost_panel', label: '面板维修费用' },
    { field_name: 'cost_other_maintain', label: '其他维修费用' }
  ]
}

const maintainGroupByMachine = {
  tableHead: [
    { field_name: 'machine_name', label: '设备名称' },
    { field_name: 'cost_labour', label: '人工费用' },
    { field_name: 'cost_nozzle', label: '枪头维修费用' },
    { field_name: 'cost_tube', label: '软管维修费用' },
    { field_name: 'cost_pump', label: '水泵维修费用' },
    { field_name: 'cost_hoover', label: '吸尘维修费用' },
    { field_name: 'cost_button', label: '按键维修费用' },
    { field_name: 'cost_panel', label: '面板维修费用' },
    { field_name: 'cost_other_maintain', label: '其他维修费用' }
  ]
}

const maintainGroupByBranch = {
  tableHead: [
    { field_name: 'branch_name', label: '网点名称' },
    { field_name: 'cost_labour', label: '人工费用' },
    { field_name: 'cost_nozzle', label: '枪头维修费用' },
    { field_name: 'cost_tube', label: '软管维修费用' },
    { field_name: 'cost_pump', label: '水泵维修费用' },
    { field_name: 'cost_hoover', label: '吸尘维修费用' },
    { field_name: 'cost_button', label: '按键维修费用' },
    { field_name: 'cost_panel', label: '面板维修费用' },
    { field_name: 'cost_other_maintain', label: '其他维修费用' }
  ]
}

/**
 * operation-list 页面的 Table 配置
 */

const operationDefault = {
  tableHead: [
    { field_name: 'operation_uid', label: '立项号' },
    { field_name: 'branch_name', label: '网点名称' },
    { field_name: 'machine_name', label: '设备名称' },
    { field_name: 'manager_name', label: '负责人名称' },
    { field_name: 'operation_time', label: '添加时间' },
    { field_name: 'cost_labour', label: '人工成本' },
    { field_name: 'cost_mop', label: '耗材成本:拖把' },
    { field_name: 'cost_bucket', label: '耗材成本:水桶' },
    { field_name: 'cost_towel', label: '耗材成本:毛巾' },
    { field_name: 'cost_filter', label: '耗材成本:吸尘器网' },
    { field_name: 'cost_foam', label: '耗材成本:泡沫' },
    { field_name: 'cost_other_consumable', label: '耗材成本:其他' },
    { field_name: 'cost_promotion', label: '营销成本:宣传' },
    { field_name: 'cost_freebie', label: '营销成本:赠品' },
    { field_name: 'cost_ad', label: '营销成本:广告' },
    { field_name: 'cost_other_marketing', label: '营销成本:其他' },
    { field_name: 'cost_device', label: '建设成本:设备' },
    { field_name: 'cost_build', label: '建设成本:施工' },
    { field_name: 'cost_fence', label: '建设成本:围挡' },
    { field_name: 'cost_other_construction', label: '建设成本:其他' },
    { field_name: 'cost_water', label: '运营成本:水费' },
    { field_name: 'cost_electric', label: '运营成本:电费' },
    { field_name: 'cost_manage', label: '运营成本:物业费' },
    { field_name: 'cost_heating', label: '运营成本:取暖费' },
    { field_name: 'cost_lease', label: '运营成本:租赁费' },
    { field_name: 'cost_other_operation', label: '运营成本:其他' }
  ]
}

const operationGroupByMachine = {
  tableHead: [
    { field_name: 'machine_name', label: '设备名称' },
    { field_name: 'cost_labour', label: '人工成本' },
    { field_name: 'cost_mop', label: '耗材成本:拖把' },
    { field_name: 'cost_bucket', label: '耗材成本:水桶' },
    { field_name: 'cost_towel', label: '耗材成本:毛巾' },
    { field_name: 'cost_filter', label: '耗材成本:吸尘器网' },
    { field_name: 'cost_foam', label: '耗材成本:泡沫' },
    { field_name: 'cost_other_consumable', label: '耗材成本:其他' },
    { field_name: 'cost_promotion', label: '营销成本:宣传' },
    { field_name: 'cost_freebie', label: '营销成本:赠品' },
    { field_name: 'cost_ad', label: '营销成本:广告' },
    { field_name: 'cost_other_marketing', label: '营销成本:其他' },
    { field_name: 'cost_device', label: '建设成本:设备' },
    { field_name: 'cost_build', label: '建设成本:施工' },
    { field_name: 'cost_fence', label: '建设成本:围挡' },
    { field_name: 'cost_other_construction', label: '建设成本:其他' },
    { field_name: 'cost_water', label: '运营成本:水费' },
    { field_name: 'cost_electric', label: '运营成本:电费' },
    { field_name: 'cost_manage', label: '运营成本:物业费' },
    { field_name: 'cost_heating', label: '运营成本:取暖费' },
    { field_name: 'cost_lease', label: '运营成本:租赁费' },
    { field_name: 'cost_other_operation', label: '运营成本:其他' }
  ]
}

const operationGroupByBranch = {
  tableHead: [
    { field_name: 'branch_name', label: '网点名称' },
    { field_name: 'cost_labour', label: '人工成本' },
    { field_name: 'cost_mop', label: '耗材成本:拖把' },
    { field_name: 'cost_bucket', label: '耗材成本:水桶' },
    { field_name: 'cost_towel', label: '耗材成本:毛巾' },
    { field_name: 'cost_filter', label: '耗材成本:吸尘器网' },
    { field_name: 'cost_foam', label: '耗材成本:泡沫' },
    { field_name: 'cost_other_consumable', label: '耗材成本:其他' },
    { field_name: 'cost_promotion', label: '营销成本:宣传' },
    { field_name: 'cost_freebie', label: '营销成本:赠品' },
    { field_name: 'cost_ad', label: '营销成本:广告' },
    { field_name: 'cost_other_marketing', label: '营销成本:其他' },
    { field_name: 'cost_device', label: '建设成本:设备' },
    { field_name: 'cost_build', label: '建设成本:施工' },
    { field_name: 'cost_fence', label: '建设成本:围挡' },
    { field_name: 'cost_other_construction', label: '建设成本:其他' },
    { field_name: 'cost_water', label: '运营成本:水费' },
    { field_name: 'cost_electric', label: '运营成本:电费' },
    { field_name: 'cost_manage', label: '运营成本:物业费' },
    { field_name: 'cost_heating', label: '运营成本:取暖费' },
    { field_name: 'cost_lease', label: '运营成本:租赁费' },
    { field_name: 'cost_other_operation', label: '运营成本:其他' }
  ]
}

/**
 * washed-order-list 页面的 Table 配置
 */

const washedNumGroupByMachine = {
  tableHead: [
    { field_name: 'machine_uid', label: '设备 ID' },
    { field_name: 'branch_name', label: '网点名称' },
    { field_name: 'city_code', label: '区号' },
    { field_name: 'count', label: '洗车量' },
    { field_name: 'cost_rmb', label: '人民币消费' },
    { field_name: 'cost_coin', label: '洗车币消费' }
  ]
}

const washedNumGroupByBranch = {
  tableHead: [
    { field_name: 'branch_name', label: '网点名称' },
    { field_name: 'city_code', label: '区号' },
    { field_name: 'count', label: '洗车量' },
    { field_name: 'cost_rmb', label: '人民币消费' },
    { field_name: 'cost_coin', label: '洗车币消费' }
  ]
}

const washedNumGroupByCityCode = {
  tableHead: [
    { field_name: 'city_code', label: '区号' },
    { field_name: 'count', label: '洗车量' },
    { field_name: 'cost_rmb', label: '人民币消费' },
    { field_name: 'cost_coin', label: '洗车币消费' }
  ]
}

module.exports = {
  // maintain-list 页面 table
  maintainDefault,
  maintainGroupByMachine,
  maintainGroupByBranch,
  // operation-list 页面 table
  operationDefault,
  operationGroupByMachine,
  operationGroupByBranch,
  // washed-order-list 页面 table
  washedNumGroupByMachine,
  washedNumGroupByBranch,
  washedNumGroupByCityCode
}
