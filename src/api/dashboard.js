import request from '@/utils/request'

/**
 * 顶部 数字统计
 */
export function getCardData() {
  return request({
    url: '/dashboard/card-summary',
    method: 'get'
  })
}

/**
 * 图表统计
 */
// 消费统计
export function getServiceData(query) {
  return request({
    url: '/dashboard/service-summary',
    method: 'get',
    params: query
  })
}

// 充值统计
export function getTopupData(query) {
  return request({
    url: '/dashboard/topup-summary',
    method: 'get',
    params: query
  })
}
