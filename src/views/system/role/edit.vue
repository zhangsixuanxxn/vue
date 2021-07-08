<template>
    <!--弹窗-->
    <el-dialog :title="title" :visible.sync="visible" :before-close="handleClose"
    width="500px">
        <el-form
        ref="formData"
        :rules="rules"
        :model="formData"
        label-width="100px"
        style="width: 400px;"
        status-icon >
            <el-form-item label="名称：" prop="name">
                <el-input v-model="formData.name"></el-input>   
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
                <el-input v-model="formData.remark" type="textarea" :autosize="{ minRows:
                2, maxRows: 4}" placeholder="请输入内容" >
                </el-input>
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
import api from '@/api/role'
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
            rules: {  //定义表单校验规则，根据prop来寻找并定义
                name:[
                    {required: true, message: '请输入角色名称', trigger: 'blur'}
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
        submitForm (formName) {
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
        async submitData() {
            let response = null 
            if(this.formData.id) {
                response = await api.update(this.formData)
            }else {
                response = await api.add(this.formData)
            }

            // 等上面返回数据response后再进行处理
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
                });
            }
        }
    }
}
</script>