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
                <el-form-item label="类型:" prop="type">
                    <el-radio-group v-model="formData.type">
                        <el-radio :label="1">目录</el-radio>
                        <el-radio :label="2">菜单</el-radio>
                        <el-radio :label="3" v-if="formData.parentId !== 0">按钮</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="名称:" prop="name">
                    <el-input v-model="formData.name"/>
                </el-form-item>
                <el-form-item label="权限标识:" prop="code">
                    <el-input v-model="formData.code"></el-input>
                </el-form-item>
                <el-form-item label="请求地址:" prop="url" v-if="formData.type !== 3">
                    <el-input v-model="formData.url" style="width:300px"></el-input>
                </el-form-item>
                <el-form-item label="图标:" prop="icon" v-if="formData.type !== 3">
                    <el-input v-model="formData.icon" />
                </el-form-item>
                <el-form-item label="排序:" prop="sort">
                    <el-input-number v-model="formData.sort" style="width:300px"></el-input-number>
                </el-form-item>
                <el-form-item label="备注:" prop="remark">
                    <el-input v-model="formData.remark" type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}" />
                </el-form-item>
                <el-form-item align="right">
                    <el-button @click="handleClose" size="mini">取 消</el-button>
                    <el-button type="primary" @click="submitForm('formData')" size="mini">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
</template>

<script>
import api from '@/api/menu'

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
                type:[
                    {required: true, message: '请选择类型', trigger: 'change'}
                ],
                name:[
                    {required: true, message: '请输入菜单名称', trigger: 'blur'}
                ],
                code: [
                    { required: true, message: '请输入权限标识', trigger: 'change' }
                ]
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
                    // 如果是按钮就不提交url和icon,清空一下 
                    if(this.formData.type === 3) {
                        this.formData.url = ''
                        this.formData.icon = ''
                    }
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