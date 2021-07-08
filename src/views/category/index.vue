<template>
    <div class="app-container">
        <!-- 表单查询区域 -->
        <el-form :inline="true" :model="query" size="mini">
            <el-form-item label="分类名称：">
                <el-input v-model="query.name"></el-input>
            </el-form-item>
            <el-form-item label="状态:">
                <el-select v-model="query.status" filterable clearable style="width:100px">
                    <el-option v-for="item in statusOptions" 
                                :key="item.code" :label="item.name" :value="item.code">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button icon="el-icon-search" type="primary" @click="queryData">查询</el-button>
                <el-button icon="el-icon-refresh" @click="reload">重置</el-button>
                <el-button icon="el-icon-circle-plus-outline" type="primary" @click="openAdd">新增</el-button>
                <el-button icon="el-icon-circle-plus-outline" @click="Del">批量删除</el-button>
            </el-form-item>
        </el-form>

        <!-- 表格数据展示 -->
        <el-table
        :data="list"
        border
        stripe
        highlight-current-row
        style="width: 100%"
        @selection-change="changeFun"
        >
        <!-- type="index"获取索引值，从1开始，label显示标题，prop显示数据字段名 -->
            <el-table-column type="selection" width="55" />
            <el-table-column align="center" type="index" label="序号" width="180"></el-table-column>
            <el-table-column align="center" prop="name" label="分类名称"></el-table-column>
            <el-table-column align="center" prop="sort" label="排序" width="180"></el-table-column>
            <el-table-column align="center" prop="remark" label="备注"></el-table-column>
            <el-table-column align="center" prop="status" label="状态" width="180">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status | statusFilter">
                        {{ scope.row.status ? "启用" : "禁用" }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button @click="handleEdit(scope.row.id)" type="primary" size="mini">编辑</el-button>
                    <el-button @click="handleDelete(scope.row.id)" type="danger" size="mini">删除</el-button>
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
        :total="total">
        </el-pagination>

        <!-- 新增与编辑edit组件 -->
        <edit :title="edit.title" :visible="edit.visible"
        :formData="edit.formData" :remoteClose="remoteClose">
        </edit>
    </div>
</template>

<script>
import api from '@/api/category'
import Edit from './edit'

const statusOptions = [
    {code: 1, name: "启用"},
    {code: 0, name: "禁用"}
]
export default {
    name: 'Category',
    data () {
        return {
            list: [],     //列表数据
            total: 0,     //总条数
            page: {       //分页
                current: 1,
                size: 20,
            },
            query: {},    //查询数据
            statusOptions,  //下拉框选项
            edit: {         //传给子组件的数据属性方法
                title: '',
                visible: false,
                formData: {
                    id: null,
                    name: '',
                    sort: null,
                    remark: ''
                }
            },
            multipleSelection: []
        }
    },
    components: { Edit },
    filters: {
        statusFilter(status) {
            //样式筛选
            const statusMap = {0: "danger", 1: "success"}
            //status就是后台返回的stauts值，0或1
            return statusMap[status]
        }
    },
    created() {
        this.fetchData()
    },
    methods: {
        changeFun (val) {
            this.multipleSelection = val // 返回的是选中的列的数组集合
            console.log(this.multipleSelection)
            let ids = []
            this.multipleSelection.map(item => {
                ids.push(item.id)
            })
            console.log(ids)
        },
        //表格获取数据
        fetchData() {
            api.getList(this.query, this.page.current, this.page.size).then(response => {
                let resp = response.data
                this.list = resp.records
                this.total = resp.total
            })
        },
        
        //表格编辑某一行
        handleEdit(id) {
            api.getById(id).then(response => {
                if(response.code === 20000) {
                    //将查询的详情传递给dialog进行展示
                    console.log(response)
                    this.edit.formData = response.data
                    this.edit.title = '编辑'
                    this.edit.visible = true

                }
            }) 
        },
        Del(val) {
            //确认删除执行的操作
            console.log(this.multipleSelection)
            // api.deleteById(this.multipleSelection).then(response => {
            //     this.$message({
            //         type: response.code === 20000 ? 'success' : 'error',
            //         message: response.message
            //     })
            //     //刷新列表
            //     this.fetchData()
            // })
},
        //表格删除某一行
        handleDelete(id) {
            this.$confirm('此操作将删除该分类, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    //确认删除执行的操作
                    api.deleteById(id).then(response => {
                        this.$message({
                            type: response.code === 20000 ? 'success' : 'error',
                            message: response.message
                        })
                        //刷新列表
                        this.fetchData()
                    })
                }).catch(() => {
                    //取消删除，不做处理
                })
        },

        //分页，页尺寸改变获取数据,val代表改变后的size
        handleSizeChange(val) {
            this.page.size = val
            this.fetchData()
        },

        //分页，当前页改变获取数据,val代表改变后的current
        handleCurrentChange(val) {
            this.page.current = val
            this.fetchData()
        },

        //条件查询数据
        queryData() {
            this.page.current = 1
            this.fetchData()
        },

        //重置条件并查询
        reload() {
            this.query = {}
            this.fetchData()
        },

        //新增分类
        openAdd() {
            this.edit.visible = true
            this.edit.title = '新增'
        },

        //触发关闭弹出的新增修改子组件窗口  
        remoteClose() {
            this.edit.formData = {}
            this.edit.visible = false
        }

    }
}
</script>

<style lang="css" scoped>
</style>