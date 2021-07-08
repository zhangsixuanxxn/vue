<template>
    <div class="app-container">
        <el-form :inline="true" size="mini">
            <el-form-item label="用户名:">
                <el-input v-model.trim="query.username"></el-input>
            </el-form-item>
            <el-form-item label="手机号:">
                <el-input v-model.trim="query.mobile"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button icon='el-icon-search' type="primary" @click="queryData">查询</el-button>
                <el-button icon='el-icon-refresh' class="filter-item" @click="reload">重置</el-button>
                <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline"
                @click="handleAdd">新增</el-button>
            </el-form-item>
        </el-form>
        <!-- 数据列表 :data 绑定渲染的数据, border 纵向边框 -->
        <el-table :data="list" border highlight-current-row style="width: 100%">
            <!-- type="index"获取索引值，从1开始 ，label显示标题，prop 数据字段名，width列宽 -->
            <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
            <el-table-column align="center" prop="username" label="用户名" ></el-table-column>
            <el-table-column align="center" prop="nickName" label="昵称" ></el-table-column>
            <el-table-column align="center" prop="mobile" label="手机号" ></el-table-column>
            <el-table-column align="center" prop="email" label="邮箱" ></el-table-column>
            <el-table-column align="center" prop="isAccountNonExpired" label="帐号过期"
            width="80">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.isAccountNonExpired === 0" type="danger">过期</el-tag>
                    <el-tag v-if="scope.row.isAccountNonExpired === 1" type="success">正常</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="isAccountNonLocked" label="帐号锁定"
            width="80">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.isAccountNonLocked === 0" type="danger">锁定</el-tag>
                    <el-tag v-if="scope.row.isAccountNonLocked === 1" type="success">正常</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="isCredentialsNonExpired" label="密码过期"
            width="80">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.isCredentialsNonExpired === 0" type="danger">过期
                    </el-tag>
                    <el-tag v-if="scope.row.isCredentialsNonExpired === 1" type="success">正常
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="isEnabled" label="是否可用" width="80">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.isEnabled === 0" type="danger">已删除</el-tag>
                    <el-tag v-if="scope.row.isEnabled === 1" type="success">可用</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="340">
                <!-- isEnabled == 1 才显示操作按钮-->
                <template slot-scope="scope" v-if="scope.row.isEnabled == 1">
                    <el-button @click="handleEdit(scope.row.id)" size="mini" >编辑</el-button>
                    <el-button @click="handleDelete(scope.row.id)" size="mini" type="danger" >
                    删除</el-button>
                    <el-button @click="handleRole(scope.row.id)" size="mini" type="success" >
                    设置角色</el-button>
                    <el-button @click="handlePwd(scope.row.id)" size="mini" type="success">密码修改</el-button>
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
        :total="page.total"
        layout="total, sizes, prev, pager, next, jumper"
        >
        </el-pagination>

        <!-- 新增子组件edit -->
        <edit :title="edit.title" :visible="edit.visible"
        :formData="edit.formData" :remoteClose="remoteClose">
        </edit>

        <!-- 设置角色组件 -->
        <el-dialog title="设置角色" :visible.sync="role.visible" width="65%">
            <Role :roleIds="role.roleIds" @saveUserRole="saveUserRole"></Role>
        </el-dialog>

        <!-- 修改密码组件 -->
        <Password title="修改密码" :userId="pwd.userId" :visible="pwd.visible"
        :remoteClose="remotePwdClose" />
    </div>
</template>

<script>
import * as api from '@/api/user'
import Edit from './edit'
import Role from '../role'
import Password from './password' // 修改密码组件
export default {
    name: 'User',
    components: { Edit , Role ,  Password },
    data() {
        return {
            list: [], // 列表数据
            page: { // 分页相关
                total: 0, // 总记录数
                current: 1, // 当前页码
                size: 20, // 每页显示20条数据
            },
            query: {}, // 查询条件
            edit: { // 子组件中引用
                title: '',
                visible: false,
                formData: {}
            },
            role: { // 设置角色功能 相关属性 +++
                userId: null, // 用户id
                roleIds: [], // 封装用户拥有角色ids，传递给角色列表子组件
                visible: false
            },
            pwd: { //设置修改密码相关数据
                visible: false,
                userId: null
            }
        }
    },
    created() {
        this.fetchData()
    },
    methods: {
        // 当每页显示条数改变后,被触发 , val是最新的每页显示条数
        handleSizeChange(val) {
            this.page.size = val
            this.fetchData()
        },
        // 当页码改变后,被触发 , val 是最新的页面
        handleCurrentChange(val) {
            this.page.current = val
            this.fetchData()
        },
        // 重置
        reload() {
            this.query = {}
            this.fetchData()
        },
        // 条件查询
        queryData(){
            this.page.current = 1
            this.fetchData()
        },
        handleAdd() {
            this.edit.visible = true
            this.edit.title = '新增——默认密码与用户名一致'
        },
        handleEdit(id) {
            // 通过Id查询数据
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
        handleRole(id) {
            // 用户id，后面要用
            this.role.userId = id
            // 查询用户当前拥有角色ids
            api.getRoleIdsByUserId(id).then(response => {
                this.role.roleIds = response.data
                // 查询后，打开窗口
                this.role.visible = true
            })
        },

        // 提交设置的用户角色数据
        saveUserRole(roleIds) {
            // 1. 保存用户角色信息
            api.saveUserRole(this.role.userId, roleIds).then(response => {
                if (response.code === 20000) {
                    // 提交成功, 关闭窗口, 刷新列表
                    this.$message({
                        message: '保存成功',
                        type: 'success'
                    })
                    // 关闭窗口
                    this.role.visible = false
                } else {
                    this.$message({
                        type: 'error',
                        message: "保存失败"
                    });
                }
            })
        },
        handlePwd(id) {
            // 要修改密码的用户id
            this.pwd.userId = id
            //弹出窗口
            this.pwd.visible = true
        },
        remoteClose() {
            this.edit.formData = {}
            this.edit.visible = false
            this.fetchData()
        },
        // 关闭密码窗口
        remotePwdClose() {
            this.pwd.userId = null
            this.pwd.visible = false
            this.fetchData()
        },
        fetchData() {
            api.getList(this.query, this.page.current, this.page.size).then(response => {
                this.list = response.data.records
                this.page.total = response.data.total
            })
        },
    }

}
</script>