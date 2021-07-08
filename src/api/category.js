import request from '@/utils/request'

export default {
    //分页条件查询分类列表接口
    getList(query, current = 1, size = 20) {
        return request({
            url: `/article/category/search`,
            method: 'post',
            data: {
                ...query,
                current,
                size
            }
        })
    },

    //新增分类接口
    add(data) {
        return request({
            url: `/article/category`,
            method: 'post',
            data
        })
    },

    //根据ID查询分类信息接口
    getById(id) {
        return request({
            url: `/article/category/${id}`,
            method: 'get'
        })
    },

    //更新分类数据
    update(data) {
        return request({
            url: `/article/category`,
            method: 'put',
            data
        })
    },

    //根据ID删除该分类
    deleteById(id) {
        return request({
            url: `/article/category/${id}`,
            method: 'delete'
        })
    },

    //获取所有正常状态的分类
    getNormalList() {
        return request({
            url: `/article/category/list`,
            method: 'get'
        })
    },

    //获取所有正常分类和标签
    getCategoryAndLabel() {
        return request({
            url: `/article/category/label/list`,
            method: 'get'
        })
    }
}