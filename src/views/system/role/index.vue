<template>
    <div class="app-container">
        <el-form :inline="true" size="mini">
            <el-form-item label="角色名称:">
                <el-input v-model.trim="query.name"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button icon='el-icon-search' type="primary" @click="queryData">查询</el-button>
                <el-button icon='el-icon-refresh' class="filter-item" @click="reload">重置</el-button>
                <el-button v-if="!roleIds" type="primary" size="mini" icon="el-icon-circle-plus-outline"
                @click="handleAdd">新增</el-button>
                <el-button v-if="roleIds" @click="handleUserRole" icon="el-icon-circle-plus-outline"
                type="success" >设置角色</el-button>
            </el-form-item>
        </el-form>
        <!-- 数据列表 :data 绑定渲染的数据, border 纵向边框 --><!-- 多选时加上 row-key="id" ref="dataTable" -->
        <el-table 
        row-key="id" ref="dataTable" :data="list" 
        border highlight-current-row style="width: 100%"
        @selection-change="handleSelectionChange">
            <!-- type="index"获取索引值，从1开始 ，label显示标题，prop 数据字段名，width列宽 -->
            <el-table-column v-if="roleIds" type="selection" reserve-selection align="center" width="60" ></el-table-column>
            <el-table-column align="center" type="index" label="序号" width="60" ></el-table-column>
            <el-table-column align="center" prop="name" label="角色名称" ></el-table-column>
            <el-table-column align="center" prop="remark" label="备注" ></el-table-column>
            <el-table-column v-if="!roleIds" align="center" label="操作" >
                <template slot-scope="scope">
                    <el-button @click="handlePermission(scope.row.id)" size="mini"
                    type="success" >分配权限</el-button>
                    <el-button @click="handleEdit(scope.row.id)" size="mini">编辑</el-button>
                    <el-button @click="handleDelete(scope.row.id)" size="mini" type="danger" >
                    删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.current"
            :page-sizes="[10, 20, 50]"
            :page-size="page.size"
            :total="page.total"
            layout="total, sizes, prev, pager, next, jumper"
            >
        </el-pagination>

        <!-- 新增与编辑组件 -->
        <edit :title="edit.title" :visible="edit.visible"
        :formData="edit.formData" :remoteClose="remoteClose">
        </edit>

        <!-- 设置权限组件 -->
        <permission :visible="per.visible" :remoteClose="remotePerClose"
        :roleId="per.roleId" />
    </div>
</template>

<script>
import api from '@/api/role'
import Edit from './edit'
import Permission from './permission'

export default {
    name: 'Role',
    components: { Edit , Permission },
    props: {
        roleIds: null // 接收用户拥有角色ids，如果是用户管理弹出的，即使没有角色也是[],而不是会传null
    },
    data() {
        return {
            list: [],
            query: {},
            checkedRoleList: [], // 存储选中角色对象
            page: {
                current: 1,
                size: 20,
                total: 0
            },
            edit: { // 子组件中引用
                title: '',
                visible: false,
                formData: {}
            },
            per: { // 传递给分配权限子组件
                roleId: null, // 角色
                visible: false // 弹窗
            }
        }
    },
    created() {
        this.fetchData()
    },
    watch: { // 监听 roleIds 变化
        roleIds() {
            this.query = [] // 清空查询框数据
            this.queryData() // 重新获取数据
        }
    },
    methods: {
        handleUserRole() { // 设置角色
            const checkedRoleIds = [];
            // 1. 遍历获取已选中的角色id
            this.checkedRoleList.forEach(item => {
                checkedRoleIds.push(item.id)
            })
            // 2. 触发父组件 user/index.vue 的 saveUserRole 事件保存用户角色数据
            this.$emit('saveUserRole', checkedRoleIds)
        },
        handleSelectionChange(val) {
            // 是一个role对象数组，
            this.checkedRoleList = val
        },
        // 触发关闭弹出的新增修改子组件窗口
        remoteClose() {
            this.edit.formData = {}
            this.edit.visible = false
            this.fetchData()
        },
        remotePerClose() {
            this.per.visible = false
            this.per.roleId = null
            this.fetchData()
        },
        handleSizeChange(val) {
            this.page.size = val
            this.fetchData()
        },
        //分页，当前页改变获取数据,val代表改变后的current
        handleCurrentChange(val) {
            this.page.current = val
            this.fetchData()
        },
        handleEdit(id) {
            api.getById(id).then(response => {
                if(response.code === 20000) {
                this.edit.formData = response.data
                }
                //弹出窗口
                this.edit.title = '编辑'
                //弹出窗口
                this.edit.visible = true
            })
        },
        handleDelete(id) {
            this.$confirm('确认删除这条记录吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 确认
                api.deleteById(id).then(response => {
                    //提示信息
                    this.$message({
                        type: response.code===20000 ? 'success':'error',
                        message: response.message
                    })
                    // 刷新列表
                    this.fetchData()
                })
            }).catch(() => {
                // 取消删除，不理会
            })
        },
        handlePermission(id) {
            this.per.visible = true
            this.per.roleId = id
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
        handleAdd() {
            this.edit.visible = true
            this.edit.title = '新增'
        },
        fetchData() {
            api.getList(this.query, this.page.current, this.page.size).then(response => {
                this.list = response.data.records
                this.page.total = response.data.total
                // 列表有数据后，勾选用户角色 +++++
                this.checkedRoles()
            })
        },
        // 勾选用户角色 +++++
        checkedRoles(){
            // 清空上一次的选择
            this.$refs.dataTable.clearSelection()
            if(this.roleIds) {
                // 取出列表中每个角色，与用户角色ids进行匹配，匹配上了则选中
                this.list.forEach(item => {
                    // 匹配上了
                    if(this.roleIds.indexOf(item.id) !== -1) {
                        // 选中，注意在 el-table 加上 ref="dataTable"
                        this.$refs.dataTable.toggleRowSelection(item, true)
                    }
                })
            }
        },
    }
}
</script>