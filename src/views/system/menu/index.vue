<template>
  <div class="app-container">
    <!-- 表单查询区域 -->
        <el-form :inline="true" :model="query" size="mini">
            <el-form-item label="菜单名称：">
                <el-input v-model="query.name"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button icon="el-icon-search" type="primary" @click="fetchData">查询</el-button>
                <el-button icon="el-icon-refresh" @click="reload">重置</el-button>
                <el-button icon="el-icon-circle-plus-outline" type="primary" @click="handleAdd(0)">新增</el-button>
            </el-form-item>
        </el-form>
    <!-- 表格数据展示 -->
        <el-table
        :data="list"
        row-key="id"
        border
        stripe
        highlight-current-row
        style="width: 100%"
        >
            <el-table-column align="center" type="index" label="序号" width="180"></el-table-column>
            <el-table-column align="center" prop="name" label="名称"></el-table-column>
            <el-table-column align="center" prop="url" label="请求地址" width="180"></el-table-column>
            <el-table-column align="center" prop="code" label="权限标识"></el-table-column>
            <el-table-column align="center" prop="type" label="类型">
                <template slot-scope="scope">
                    <span v-if="scope.row.type === 1">目录</span>
                    <span v-if="scope.row.type === 2">菜单</span>
                    <span v-if="scope.row.type === 3">按钮</span>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="icon" label="图标">
                <template slot-scope="scope">
                    <i :class="scope.row.icon" />
                </template>
            </el-table-column>
            <el-table-column align="center" prop="sort" label="排序"></el-table-column>
            <el-table-column align="center" label="操作" width="260">
                <template slot-scope="scope">
                    <el-button @click="handleAdd(scope.row.id)" type="success" size="mini">新增下一级</el-button>
                    <el-button @click="handleEdit(scope.row.id)" type="primary" size="mini">编辑</el-button>
                    <el-button @click="handleDelete(scope.row.id)" type="danger" size="mini">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <edit :title="edit.title" :visible="edit.visible" 
        :formData="edit.formData" :remoteClose="remoteClose"
        />
    </div>
</template>
<script>
import api from '@/api/menu'
import Edit from './edit'
export default {
    components: { Edit },
    data() {
    return {
        query: {}, //查询条件
        list: [], //列表数据
        edit: {
            title: '',
            visible: false,
            formData:{},
        }
        }
    },
    created() {
        this.fetchData()
    },
    methods: {
        fetchData() {
        api.getList(this.query).then(response => {
            console.log("🚀 ~ file: index.vue ~ line 75 ~ api.getList ~ response", response)
            this.list = response.data
        })
        },
        //重置条件并查询
        reload() {
            this.query = {}
            this.fetchData()
        },
        handleAdd(id) {
            // id = 0 是新增一级菜单，否则新增的是子菜单。
            this.edit.formData.parentId = id
            this.edit.visible = true
            this.edit.title = '新增根目录'
        },
        handleEdit(id) {
            api.getById(id).then(response => {
                if(response.code === 20000) {
                    console.log(response)
                    this.edit.formData = response.data
                    this.edit.title = '编辑菜单'
                    this.edit.visible = true
                }
            })
        },
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
        //触发关闭弹出的新增修改子组件窗口  
        remoteClose() {
            this.edit.formData = {}
            this.edit.visible = false
        }
    }, 
}
</script>
