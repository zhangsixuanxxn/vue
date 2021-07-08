import request from '@/utils/request'

export default {
  getList(query, current = 1, size = 20) {
    return request({
      url: `/system/role/search`,
      method: 'post',
      data: { ...query, current, size } //合并为一个对象
    })
  },
  add(data) {
    return request({
      url: `/system/role`,
      method: 'post',
      data
    })
  },
  // 查询
  getById(id) {
    return request({
      url: `/system/role/${id}`, // 反单引号 ``
      method: 'get'
    })
  },
  // 更新
  update(data) {
    return request({
      url: `/system/role`,
      method: 'put', // put 方式提交
      data,
    })
  },
  deleteById(id) {
    return request({
      url: `/system/role/${id}`, // 反单引号 ``
      method: 'delete', // delete 方式提交
    })
  },
  // 获取指定角色id所拥有的权限菜单ids
  getMenuIdsByRoleId(id) {
    return request({
      url: `/system/role/${id}/menu/ids`, // 反单引号 ``
      method: 'get'
    })
  },
  // 给角色新分配菜单保存
  saveRoleMenu(id, menuIds) {
    return request({
      url: `/system/role/${id}/menu/save`,
      method: 'post',
      data: menuIds
    })
    },
    
}