import request from '@/utils/request'

export function createBranch(branch) {
  return request({
    url: '/branch/create',
    method: 'post',
    data: branch
  })
}

export function getBranchById(branch_uid) {
  return request({
    url: '/branch/get',
    method: 'get',
    params: { branch_uid }
  })
}

export function updateBranch(branch) {
  return request({
    url: '/branch/update',
    method: 'post',
    data: branch
  })
}

export function listBranch(query) {
  return request({
    url: '/branch/list',
    method: 'get',
    params: query
  })
}

export function deleteBranch(branch_uid) {
  return request({
    url: '/branch/delete',
    method: 'get',
    params: { branch_uid }
  })
}
