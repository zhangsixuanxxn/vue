<template>
    <div class="app-container">
        <!-- 条件查询 -->
        <el-form :inline="true" :model="query" size="mini">
            <el-form-item label="广告标题:">
                <el-input v-model.trim="query.title" ></el-input>
            </el-form-item>
            <el-form-item label="状态:">
                <el-select v-model="query.status" clearable filterable style="width: 85px">
                    <el-option 
                        v-for="item in statusOptions" :key="item.code" 
                        :label="item.name" :value="item.code">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button icon="el-icon-search" type="primary" @click="queryData">查询</el-button>
                <el-button icon="el-icon-refresh"  @click="reload">重置</el-button>
                <el-button icon="el-icon-circle-plus-outline" type="primary" @click="openAdd" >新增</el-button>
            </el-form-item>
        </el-form>


        <el-table
            :data="list"
            stripe
            border
            style="width: 100%">
            <el-table-column  align="center" type="index" label="序号" width="60"></el-table-column>
            <el-table-column  align="center" prop="title" label="广告标题" ></el-table-column>
            <el-table-column  align="center" prop="imageUrl" label="广告图片" >
                <template slot-scope="scope">
                    <el-image style="width: 90px; height: 60px"
                        :src="scope.row.imageUrl" 
                        :preview-src-list="[scope.row.imageUrl]">
                    </el-image>
                </template>
            </el-table-column>
            <el-table-column  align="center" prop="advertUrl" label="广告链接" ></el-table-column>
            <el-table-column  align="center" prop="status" label="状态" >
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status === 0" type="danger">禁用</el-tag>
                    <el-tag v-if="scope.row.status === 1" type="success">正常</el-tag>
                </template>
            </el-table-column>
            <el-table-column  align="center" prop="sort" label="排序" ></el-table-column>
            <el-table-column  align="center" label="操作" >
                <template slot-scope="scope">
                    <el-button type="success" @click="handleEdit(scope.row.id)" size="mini">编辑</el-button>
                    <el-button type="danger"  @click="handleDelete(scope.row.id)"  size="mini">删除</el-button>
                </template>
            </el-table-column>
        </el-table>


        <!-- 分页组件 -->
         <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.current"
            :page-sizes="[10, 20, 50]"
            :page-size="page.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total">
        </el-pagination>

        <edit :title="edit.title" :visible="edit.visible" 
        :formData="edit.formData" :remoteClose="remoteClose"
        :oldImageUrl="edit.oldImageUrl"
        />
    </div>
</template>
<script>

import api from '@/api/advert'

import Edit from './edit'

const statusOptions = [
    {code: 0, name: '禁用'},
    {code: 1, name: '正常'}
]


export default {
    name: 'Advert', // 和对应路由表中配置的name值一致
    
    components: {Edit},

    data() {
        return {
            list: [],
            page: {
                current: 1,
                size: 20,
                total: 0
            },
            query: {}, // 查询条件
            statusOptions, // 状态
            edit: {
                title: '',
                visible: false,
                formData: {
                    imageUrl: null // 不声明，上传后无法回显展示图片
                },
                oldImageUrl: null // 是编辑时，查询出来的原始图片
            }
        }
    },

    created() {
        this.fetchData()
    },

    methods: {
        async fetchData() {
            const {data} = await api.getList(this.query, this.page.current, this.page.size)
            this.page.total = data.total
            this.list = data.records
        },

        // 编辑
        async handleEdit(id) {
            const response = await api.getById(id)
            if(response.code === 20000){
                this.edit.formData = response.data
                // 修改前的图片url
                this.edit.oldImageUrl = response.data.imageUrl
                // 弹出窗口
                this.edit.visible = true
                this.edit.title = '编辑'
            }
        },

        // 删除
        handleDelete(id) {
            this.$confirm('确认删除这条记录吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 发送删除请求
                api.deleteById(id).then(response => {
                    // 处理响应结果提示
                    this.$message({
                        type: response.code === 20000 ? 'success': 'error',
                        message: response.message
                    })
                })
                // 刷新列表数据
                this.fetchData()
            }).catch(() => {
                // 取消删除，不用理会        
            });
        },

        // val 是切换之后的每页显示多少条
        handleSizeChange(val) {
            this.page.size = val
            this.fetchData()
        },

        // 当页码改变后触发到此方法，val 是当前点击（或输入）的那个页码，
        handleCurrentChange(val) {
            this.page.current = val
            this.fetchData()
        },

        // 条件查询
        queryData() {
            // 将页码变为1，第1页
            this.page.current = 1
            this.fetchData()
        },

        // 重置
        reload() {
            this.query = {}
            this.fetchData()
        },

        // 打开窗口
        openAdd() {
            this.edit.visible = true
            this.edit.title = '新增'
        },
        // 关闭窗口
        remoteClose() {
            // 不声明，上传后无法回显展示图片
            this.edit.formData = {imageUrl: null}
            this.edit.visible = false
            this.fetchData()
        }

    }
}
</script>