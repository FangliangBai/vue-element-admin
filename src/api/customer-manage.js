/**
 * @description 用户管理 API
 */
import request from '@/utils/request'

// 手动充值记录查询
export function listManualTopup(query) {
  return request({
    url: '/customer-manage/list-manual-topup',
    method: 'get',
    params: query
  })
}

// 获取用户手机号码列表
export function getCustomerList(query) {
  return request({
    url: '/customer-manage/get-customer-list',
    method: 'get',
    params: query
  })
}

// 提交添加新手动充值记录
export function createManualTopup(topupForm) {
  return request({
    url: '/customer-manage/add-manual-topup',
    method: 'post',
    data: topupForm
  })
}

// 删除手动充值记录
export function deleteManualTopup(row) {
  return request({
    url: '/customer-manage/revoke-manual-topup',
    method: 'post',
    data: row
  })
}
