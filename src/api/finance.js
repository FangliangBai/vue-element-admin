import request from '@/utils/request'

/**
 * maintain 相关 API
 */

export function createMaintain(machine_maintain) {
  return request({
    url: '/finance/create-maintain',
    method: 'post',
    data: machine_maintain
  })
}

export function updateMaintain(machine_maintain) {
  return request({
    url: '/finance/update-maintain',
    method: 'post',
    data: machine_maintain
  })
}

export function getMaintainById(maintain_uid) {
  return request({
    url: '/finance/get-maintain',
    method: 'get',
    params: { maintain_uid }
  })
}

export function listMaintain(query) {
  return request({
    url: '/finance/list-maintain',
    method: 'get',
    params: query
  })
}

export function getMaintainOptions() {
  return request({
    url: '/finance/maintain-options',
    method: 'get'
  })
}

export function deleteMaintain(maintain_uid) {
  return request({
    url: '/finance/delete-maintain',
    method: 'get',
    params: { maintain_uid }
  })
}

/**
 * operation 相关 API
 */

export function createOperation(machine_operation) {
  return request({
    url: '/finance/create-operation',
    method: 'post',
    data: machine_operation
  })
}

export function updateOperation(machine_operation) {
  return request({
    url: '/finance/update-operation',
    method: 'post',
    data: machine_operation
  })
}

export function getOperationById(operation_uid) {
  return request({
    url: '/finance/get-operation',
    method: 'get',
    params: { operation_uid }
  })
}

export function listOperation(query) {
  return request({
    url: '/finance/list-operation',
    method: 'get',
    params: query
  })
}

export function getOperationOptions() {
  return request({
    url: '/finance/operation-options',
    method: 'get'
  })
}

export function deleteOperation(operation_uid) {
  return request({
    url: '/finance/delete-operation',
    method: 'get',
    params: { operation_uid }
  })
}

/**
 * 价目表 相关 API
 */

export function getBranchOptions() {
  return request({
    url: '/finance/get-branch-options',
    method: 'get'
  })
}

export function getTariff(branch_uid) {
  return request({
    url: '/finance/get-tariff',
    method: 'post',
    data: {
      branch_uid
    }
  })
}

export function updateTariff(tariff) {
  return request({
    url: '/finance/update-tariff',
    method: 'post',
    data: tariff
  })
}

// 充值定价 相关 API
export function getTopupTariff(branch_uid) {
  return request({
    url: '/finance/get-topup-tariff',
    method: 'post',
    data: {
      branch_uid
    }
  })
}

export function updateTopupTariff(tariff) {
  return request({
    url: '/finance/update-topup-tariff',
    method: 'post',
    data: tariff
  })
}

/**
 * 客户信息
 */

export function listCustomer(query) {
  return request({
    url: '/finance/list-customer',
    method: 'get',
    params: query
  })
}

/**
 * 运营统计
 */

export function listWashedOrder(query) {
  return request({
    url: '/finance/list-washed-order',
    method: 'post',
    data: query
  })
}

export function ListTopupOrder(query) {
  return request({
    url: '/finance/list-topup-order',
    method: 'get',
    params: query
  })
}
