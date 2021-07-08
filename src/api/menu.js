import request from '@/utils/request'

export default {
  //菜单列表分页接口
  getList(query) {
    return request({
      url: `/system/menu/search`,
      method: 'get',
      data: query
    })
  },

  add(data) {
    return request({
      url: `/system/menu`,
      method: 'post',
      data
    })
  },

  getById(id) {
    return request({
      url: `system/menu/search/${id}`,
      method: 'get'
    })
  },

  update(data) {
    return request({
      url: `/system/menu`,
      method: 'put',
      data
    })
  },

  deleteById(id) {
    return request({
      url: `system/menu/${id}`,
      method: 'delete'
    })
  },
}