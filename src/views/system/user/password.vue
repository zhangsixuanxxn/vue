<template>
    <!--弹窗-->
    <el-dialog :title="title" :visible.sync="visible" :before-close="handleClose" width="380px">
        <el-form :rules="rules" ref="formData" :model="formData" label-width="100px"
        style="width: 300px;">
            <el-form-item label="新密码：" prop="newPassword">
                <el-input type="password" placeholder="请输入新密码" v-model="formData.newPassword"></el-input>
            </el-form-item>
            <el-form-item label="确认密码：" prop="repPassword">
                <el-input type="password" placeholder="请输入确认密码" v-model="formData.repPassword"></el-input>
            </el-form-item>
            <el-form-item align="right">
                <el-button size="mini" @click="handleClose">取 消</el-button>
                <el-button size="mini" type="primary" @click="submitForm('formData')">确定</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import * as api from '@/api/user' 
export default {
    // 接收父组件传递的属性
    props: {
        userId: null, // 用户id
        visible: { //弹出隐藏
            type: Boolean,
            default: false
        },
        title: { // 标题
            type: String,
            default: ''
        },
        remoteClose: Function // 用于关闭窗口
    },
    data() {
        // 校验确认密码是否一致
        const validateRepPassword = (rule, value, callback) => {
            if(value === this.formData.newPassword) {
                // 相等,则通过
                callback()
            }else {
                callback(new Error('两次输入的密码不一致'))
            }
        };
      return {
        formData: {},
        rules: {
            newPassword: [{ required: true, message: '新密码不能为空', trigger: 'blur' }],
            repPassword: [
                { required: true, message: '确认密码不能为空', trigger: 'blur' },
                { validator: validateRepPassword, trigger: 'blur' }
            ]
        }
      }
    },

    methods: {
        // 关闭弹窗
        handleClose(done) {
            // 表单清空
            this.$refs['formData'].resetFields()
            // 因为 visible 是父组件的属性，所以要让父组件去改变值
            this.remoteClose()
        },
        //提交表单
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 发送请求更新
                    this.formData.userId = this.userId // 不要忘记赋值了
                    api.updatePassword(this.formData).then(response => {
                        if (response.code === 20000) {
                            // 提交成功
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            })
                        // 关闭窗口
                        this.handleClose()
                        } else {
                            this.$message({
                                type: 'error',
                                message: response.message
                            })
                        }
                    })
                } else {
                    // 验证不通过
                    return false;
                }
            })
        },
    }
}
</script>
