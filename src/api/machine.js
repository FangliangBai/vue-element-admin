import request from '@/utils/request'

export function createMachine(machine) {
  return request({
    url: '/machine/create',
    method: 'post',
    data: machine
  })
}

export function getMachineById(machine_uid) {
  return request({
    url: '/machine/get',
    method: 'get',
    params: { machine_uid }
  })
}

export function updateMachine(machine) {
  return request({
    url: '/machine/update',
    method: 'post',
    data: machine
  })
}

export function listMachine(query) {
  return request({
    url: '/machine/list',
    method: 'get',
    params: query
  })
}

export function getMachineOptions() {
  return request({
    url: '/machine/machine-options',
    method: 'get'
  })
}

export function deleteMachine(machine_uid) {
  return request({
    url: '/machine/delete',
    method: 'get',
    params: { machine_uid }
  })
}
