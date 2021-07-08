<template>

<!-- 新增分类 dialog -->
        <el-dialog :title="title" :visible.sync="visible" :before-close="handleClose" width="500px">
            <!-- status-icon 当表单校验不通过时，显示X号 -->
            <el-form ref="formData"
            :rules="rules"
            status-icon 
            :model="formData" 
            label-width="100px" 
            label-position="right" 
            style="width:400px">
                <el-form-item label="分类名称:" prop="name">
                    <el-input v-model="formData.name"/>
                </el-form-item>
                <el-form-item label="状态:" prop="status">
                    <el-radio-group v-model="formData.status">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="排序:" prop="sort">
                    <el-input-number v-model="formData.sort" :min="1" :max="100" style="width:300px"></el-input-number>
                </el-form-item>
                <el-form-item label="备注:" prop="remark">
                    <el-input v-model="formData.remark" type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}" />
                </el-form-item>
                <el-form-item>
                    <el-button @click="handleClose" size="mini">取 消</el-button>
                    <el-button type="primary" @click="submitForm('formData')" size="mini">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 分页区域 -->
</template>

<script>

import api from '@/api/category'

export default {
    //接收父组件传参
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        },
        formData: {            //表单数据
            type: Object,
            default: {}
        },
        remoteClose: Function  //用于关闭弹框
    },
    data() {
        return {
            rules: {  //定义表单校验规则，根据prop来寻找并定义
                name:[
                    {required: true, message: '请输入分类名称', trigger: 'blur'}
                ],
                status: [
                    { required: true, message: '请选择状态', trigger: 'change' }
                ],
                sort:[
                    {required: true, message: '请输入序号', trigger: 'change'}
                ],
            }
        }
    },
    methods: {
        handleClose() {
            //清空表单数据
            this.$refs['formData'].resetFields()
            //不能通过 this.visible =false 来关闭弹窗，因为visible是从父组件接收来的，不可自己直接赋值
            this.remoteClose()
        },
        submitForm(formName) {
            //表单校验通过了再提交
            this.$refs[formName].validate((valid) => {
                if (valid) {   //校验通过
                    this.submitData()
                } else {       //校验不通过
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        async submitData() {
            let response = null
            //判断id是否存在，不存在就新增，存在就更新
            if(this.formData.id) {
                response = await api.update(this.formData)
            } else {
                response = await api.add(this.formData)
            }
            //等上面返回response后在进行处理
            if(response.code == 20000) {
                //提交成功，关闭窗口,刷新列表
                this.$message({
                    message: '保存成功',
                    type: 'success'
                })
                //关闭窗口
                this.handleClose()
            } else {
                this.$message({
                    message: '保存失败',
                    type: 'error'
                })
            }
        }
    },
}
</script>