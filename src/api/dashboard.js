import request from '@/utils/request'

export default {
  // 查询总条数
  getTotal(){
    return request({
      url: `/system/user/total`,
      method: 'get'
    })
  },

  //查询每个分类下的文章数
  getCategoryTotal() {
    return request({
        url: `/article/article/category/total`,
        method: 'get'
    })
  },

  // 查询近6个月发布的文章数
  getMonthAritcleTotal() {
    return request({
      url: `/article/article/month/total`,
      method: 'get'
    })
  }
}