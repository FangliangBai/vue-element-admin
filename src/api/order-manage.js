import request from '@/utils/request'

/**
 * 订单管理 API
 */

/**
 * 充值, 退款
 */
// 充值订单查询
export function ListOrderTopup(query) {
  return request({
    url: '/order-manage/list-order-topup',
    method: 'get',
    params: query
  })
}

// 导出充值订单
export function ExportOrderTopup(query) {
  return request({
    url: '/order-manage/export-order-topup',
    method: 'get',
    params: query
  })
}

// 退款订单查询
export function ListOrderRefund(query) {
  return request({
    url: '/order-manage/list-order-refund',
    method: 'get',
    params: query
  })
}

// 导出退款订单
export function ExportOrderRefund(query) {
  return request({
    url: '/order-manage/export-order-refund',
    method: 'get',
    params: query
  })
}

// 洗车币退款
export function refundTopup(row) {
  return request({
    url: '/order-manage/refund-coin-topup',
    method: 'post',
    data: row
  })
}

// 洗车订单查询
export function ListOrderWashed(query) {
  return request({
    url: '/order-manage/list-order-washed',
    method: 'get',
    params: query
  })
}

// 导出洗车订单
export function ExportOrderWashed(query) {
  return request({
    url: '/order-manage/export-order-washed',
    method: 'get',
    params: query
  })
}

export function ListOrderPark(query) {
  return request({
    url: '/order-manage/list-order-park',
    method: 'get',
    params: query
  })
}

export function deleteOrderPark(row) {
  return request({
    url: '/order-manage/delete-order-park',
    method: 'post',
    data: row
  })
}
