import request from '@/utils/request'

/**
 * Partner Topup APIs
 */

// 创建 引流合作商
export function UpsertPartnerTopup(form) {
  return request({
    url: '/partner-manage/upsert-partner-topup',
    method: 'post',
    data: form
  })
}
