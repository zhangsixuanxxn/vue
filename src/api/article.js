import request from '@/utils/request'

export default {
    //分页条件查询分类列表接口
    getList(query, current = 1, size = 20) {
        return request({
            url: `/article/article/search`,
            method: 'post',
            data: {
                ...query,
                current,
                size
            }
        })
    },

    getById(id) {
        return request({
            url: `/article/article/${id}`,
            method: 'get',
        })
    },
    
    deleteById(id) {
        return request({
            url: `/article/delete/${id}`,
            method: 'post',
        })
    },

    auditSuccess(id) {
        return request({
            url: `/article/article/audit/success/${id}`,
            method: 'get',
        })
    },

    auditFail(id) {
        return request({
            url: `/article/article/audit/failed/${id}`,
            method: 'get',
        })
    }
}