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
// 消费金额
export function getSumService(query) {
  return request({
    url: '/dashboard/figure-sum-service',
    method: 'post',
    data: query
  })
}

// 消费数量
export function getNumService(query) {
  return request({
    url: '/dashboard/figure-num-service',
    method: 'post',
    data: query
  })
}

// 充值统计
export function getSumTopup(query) {
  return request({
    url: '/dashboard/figure-sum-topup',
    method: 'post',
    data: query
  })
}
