import request from '@/utils/request'

export default {
    //列表分页接口
    getList(query, current = 1, size = 20) {
        return request({
            url: `/article/label/search`,
            method: 'post',
            data: {
                ...query,    //es6语法， 会将对象query解构，和current，size组成新对象
                current,
                size
            }
        })
    },
    //新增标签接口
    add(data) {
        return request({
            url: `/article/label`,
            method: 'post',
            data
        })
    },

    //通过ID查询
    getById(id) {
        return request({
            url: `/article/label/${id}`,
            method: 'get',
        })
    },

    //更新标签接口
    update(data) {
        return request({
            url: `/article/label`,
            method: 'put',
            data
        })
    },
    //通过ID删除
    deleteById(id) {
        return request({
            url: `/article/label/${id}`,
            method: 'delete',
        })
    },
}