import request from '@/utils/request'

export default {
  getList(query, current = 1, size = 20) {
    return request({
      url: `/article/advert/search`,
      method: 'post',
      data: { ...query, current, size } //合并为一个对象
    })
  },

  add(data) {
    return request({
      url: `/article/advert`,
      method: 'post',
      data
    })
  },

  // 查询详情
  getById(id) {
    return request({
      url: `/article/advert/${id}`,
      method: 'get'
    })
  },

  //更新行数据
  update(data) {
    return request({
      url: `/article/advert`,
      method: 'put',
      data
    })
  },

  //更新行数据
  deleteById(id) {
    return request({
      url: `/article/advert/${id}`,
      method: 'delete'
    })
  }
}