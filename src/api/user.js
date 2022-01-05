import request from '@/utils/request'

/**
 * 系统管理员 登录
 */
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}
export function getInfo() {
  return request({
    url: 'user/info',
    method: 'get'
  })
}
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

/**
 * 系统管理员 管理
 */

export function createAdminUser(admin_user) {
  return request({
    url: '/user/create',
    method: 'post',
    data: admin_user
  })
}
export function getAdminUserById(admin_id) {
  return request({
    url: '/user/get',
    method: 'get',
    params: { admin_id }
  })
}
export function updateAdminUser(admin_user) {
  return request({
    url: '/user/update',
    method: 'post',
    data: admin_user
  })
}
export function listAdminUser(query) {
  return request({
    url: '/user/list',
    method: 'get',
    params: query
  })
}
export function deleteAdminUser(admin_id) {
  return request({
    url: '/user/delete',
    method: 'get',
    params: { admin_id }
  })
}

/**
 * 维护人
 */
export function createMaintainer(maintainer) {
  return request({
    url: '/user/create-maintainer',
    method: 'post',
    data: maintainer
  })
}
export function updateMaintainer(maintainer) {
  return request({
    url: '/user/update-maintainer',
    method: 'post',
    data: maintainer
  })
}
export function getMaintainerById(maintainer_uid) {
  return request({
    url: '/user/get-maintainer',
    method: 'get',
    params: { maintainer_uid }
  })
}
export function listMaintainer(query) {
  return request({
    url: '/user/list-maintainer',
    method: 'get',
    params: query
  })
}
export function deleteMaintainer(maintainer_uid) {
  return request({
    url: '/user/delete-maintainer',
    method: 'get',
    params: { maintainer_uid }
  })
}

/**
 * 负责人
 */
export function createManager(manager) {
  return request({
    url: '/user/create-manager',
    method: 'post',
    data: manager
  })
}
export function updateManager(manager) {
  return request({
    url: '/user/update-manager',
    method: 'post',
    data: manager
  })
}
export function getManagerById(manager_uid) {
  return request({
    url: '/user/get-manager',
    method: 'get',
    params: { manager_uid }
  })
}
export function listManager(query) {
  return request({
    url: '/user/list-manager',
    method: 'get',
    params: query
  })
}
export function deleteManager(manager_uid) {
  return request({
    url: '/user/delete-manager',
    method: 'get',
    params: { manager_uid }
  })
}
