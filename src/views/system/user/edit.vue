<template>
    <!--弹窗-->
    <el-dialog :title="title" :visible.sync="visible" :before-close="handleClose"
    width="500px">
        <el-form
        :rules="rules"
        ref="formData"
        :model="formData"
        label-width="100px"
        style="width: 400px;"
        status-icon >
            <el-form-item label="用户名：" prop="username">
                <el-input v-model="formData.username" maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="昵称：" prop="nickName">
                <el-input v-model="formData.nickName" maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="手机号：" prop="mobile">
                <el-input v-model="formData.mobile" maxlength="11"></el-input>
            </el-form-item>
            <el-form-item label="邮箱：" prop="email">
                <el-input v-model="formData.email" ></el-input>
            </el-form-item>
            <el-form-item label="帐号过期：" prop="isAccountNonExpired">
                <el-radio-group v-model="formData.isAccountNonExpired">
                    <el-radio :label="1" border>未过期</el-radio>
                    <el-radio :label="0" border>已过期</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="密码过期：" prop="isCredentialsNonExpired">
                <el-radio-group v-model="formData.isCredentialsNonExpired">
                    <el-radio :label="1" border>未过期</el-radio>
                    <el-radio :label="0" border>已过期</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="帐号锁定：" prop="isAccountNonLocked">
                <el-radio-group v-model="formData.isAccountNonLocked" >
                    <el-radio :label="1" border>未锁定</el-radio>
                    <el-radio :label="0" border>已锁定</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item align="right">
                <el-button size="mini" @click="handleClose">取 消</el-button>
                <el-button size="mini" type="primary" @click="submitForm('formData')">确 定
                </el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import * as api from '@/api/user'

export default {
    // 接收父组件传递的属性
    props: {
        visible: { //弹出隐藏
            type: Boolean,
            default: false
        },
        title: { // 标题
            type: String,
            default: ''
        },
        formData: { // 表单数据
            type: Object,
            default: {}
        },
        remoteClose: Function // 用于关闭窗口
    },
    data() {
      return {
        rules:{
            username: [
                { required: true, message: '请输入用户名', trigger: 'blur' },
                { min: 6, max: 30, message: '长度在 6 到 30 个字符', trigger: 'blur' }
            ],
            nickName: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
            mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
            isAccountNonExpired: [{ required: true, message: '请选择', trigger: 'change' }],
            isCredentialsNonExpired: [{ required: true, message:'请选择', trigger:'change'}],
            isAccountNonLocked: [{ required: true, message: '请选择', trigger: 'change' }]
        }
      }
    },
    methods: {
        // 关闭弹窗
        handleClose(done) {
            this.$refs['formData'].resetFields()
            this.remoteClose()
        },
        //提交表单
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 校验通过，提交数据
                    this.submitData()
                } else {
                    // 验证不通过
                    return false;
                }
            })
        },
        // 3. 异步方法提交数据
        async submitData() {
            // 默认密码与用户名一致
            this.formData.password = this.formData.username
            let response = null
            if(this.formData.id) {
                response = await api.update(this.formData)
            } else {
                response = await api.add(this.formData)
            // 等上面返回数据response后再进行处理
            }
            if (response.code === 20000) {
                // 提交成功, 关闭窗口, 刷新列表
                this.$message({
                    message: '保存成功',
                    type: 'success'
                })
                // 关闭窗口
                this.handleClose()
            } else {
                this.$message({
                    type: 'error',
                    message: "保存失败"
                })
            }
        }
    }
}
</script>
