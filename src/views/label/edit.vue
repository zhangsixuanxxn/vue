<template>
    <!-- 弹窗  -->
    <el-dialog :title="title" :visible.sync="visible" width="400px" :before-close="handleClose">
        <el-form ref="formData"
            :rules="rules"
            status-icon 
            :model="formData" 
            label-width="100px" 
            label-position="right">
            <el-form-item label="标签名称" prop="name">
                <el-input v-model="formData.name" style="width:200px"></el-input>
            </el-form-item>
            <el-form-item label="分类名称" prop="categoryId">
                <el-select v-model="formData.categoryId" clearable filterale>
                    <el-option v-for="item in categoryList"
                                :key="item.id"
                                :label="item.name" 
                                :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleClose" size="mini">取 消</el-button>
            <el-button type="primary" @click="submitForm('formData')" size="mini">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import api from '@/api/label'
export default {
    //接收父组件传来的数据
    props: {
        categoryList: {  //接收所有正常状态的分类
            type: Array,
            default: []
        },
        title: {
            type: String,
            default: ''
        },
        visible: {
            type: Boolean,
            default: false
        },
        formData: {
            type: Object,
            default: {}
        },
        remoteClose: Function  //用于关闭弹窗，不能直接在子组件关闭，要父组件传递关闭函数来关闭
    },
    data() {
        return{
            rules: {
                name: [
                    {required: true, message: '请输入分类名称', trigger: 'blur'}
                ],
                categoryId: [
                    {required: true, message: '请输入分类名称', trigger: 'change'}
                ]
            }

        }
    },

    methods: {
        //关闭弹窗，不能直接关，要父组件关闭
        handleClose(done) {
            this.$refs['formData'].resetFields()
            this.remoteClose()
        },
        //提交表单数据
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