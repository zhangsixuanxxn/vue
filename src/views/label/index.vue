<template>
    <div class="app-container">
        <!-- 查询表单 -->
        <el-form :inline="true" size="mini">
            <el-form-item label="标签名称">
                <el-input v-model.trim="query.name"></el-input>
            </el-form-item>
            <el-form-item label="分类名称">
                <el-select v-model="query.categoryId" clearable filterable>
                    <el-option v-for="item in categoryList"
                                :key="item.id"
                                :label="item.name" 
                                :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button icon="el-icon-search" type="primary" @click="queryData">查询</el-button>
                <el-button icon="el-icon-refresh" @click="reload">重置</el-button>
                <el-button icon="el-icon-circle-plus-outline" type="primary" @click="openAdd">新增</el-button>
            </el-form-item>
        </el-form>

        <!-- 数据表格 -->
        <el-table
            :data="list"
            border
            highlight-current-row
            style="width: 100%">
            <el-table-column align="center" prop="id" label="序号" width="100"></el-table-column>
            <el-table-column align="center" prop="name" label="标签名称"></el-table-column>
            <el-table-column align="center" prop="categoryName" label="分类名称"></el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button @click="handleEdit(scope.row.id)" type="primary" size="mini">编辑</el-button>
                    <el-button @click="handleDelete(scope.row.id)" type="danger" size="mini">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.current"
        :page-sizes="[10, 20, 50]"
        :page-size="page.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        </el-pagination>

        <!-- 新增与修改子组件，弹窗 -->
        <edit :categoryList="categoryList" :title="edit.title" :visible="edit.visible"
                :formData="edit.formData" :remoteClose="remoteClose">
        </edit>
    </div>
</template>

<script>
import api from '@/api/label'
import categoryApi from '@/api/category'
import Edit from './edit'

export default {
    name: 'Label',    //和对应路由表中配置的name名称保持一致
    components: { Edit },
    data() {
        return{
            list: [],
            total: 0,
            page: {  //分页相关数据
                current: 1,
                size: 20
            },
            query: {},   //查询条件
            categoryList: [],  //数据存储正常分类的状态
            edit: {   //子组件引用属性对象
                title: '',
                visible: false,
                formData: {}
            }
        }
    },

    created() {
        this.fetchData()
        //获取正常分类状态
        this.getCategoryList()
    },

    methods: {
        //表格获取数据
        fetchData() {
            api.getList(this.query, this.page.current, this.page.size).then(response => {
                let resp = response.data
                console.log(resp)
                this.list = resp.records
                this.total = resp.total
            })
        },
        
        openAdd() {
            this.edit.visible = true
            this.edit.title = '新增标签'
            this.getCategoryList()  //打开时重新加载最新的分类类别
        },
        //编辑当前行
        handleEdit(id) {
            api.getById(id).then(response => {
                if(response.code === 20000) {
                    this.edit.formData = response.data
                    //弹出窗口
                    this.edit.visible = true
                    this.edit.title = "编辑标签"
                }
            })
        },

        //删除当前行
        handleDelete(id) {
            this.$confirm('此操作将删除该分类, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    api.deleteById(id).then(response => {
                        if(response.code === 20000) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            })
                            this.fetchData()
                        }
                    })
                }).catch(() => {
                    //取消删除，不做操作、
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

        //获取正常状态分类数据
        getCategoryList() {
            categoryApi.getNormalList().then(response => {
                this.categoryList = response.data
            })
        },

        queryData() {
            this.page.current = 1
            this.fetchData()
        },
        
        //重置
        reload() {
            this.query = {}
            this.fetchData()
        },

        //关闭新增、编辑弹窗
        remoteClose() {
            this.edit.formData = {}
            this.edit.visible = false
            this.edit.title = ''
        }
    },
}
</script>