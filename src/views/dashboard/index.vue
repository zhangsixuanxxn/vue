<template>
    <div class="dashboard-container">
      <panel-group :userTotal="userTotal" />
        <el-row :gutter="40" >
            <el-col :xs="24" :sm="24" :lg="12" >
                <el-card>
                    <!-- 饼状图： 各技术频道文章统计 -->
                    <pie-chart v-if="flag" :legendData="categoryTotal.nameList" :seriesData="categoryTotal.nameAndValueList"/>
                </el-card>
            </el-col>
            <el-col :xs="24" :sm="24" :lg="12" >
                <el-card>
                    <!-- 柱状图： 近6个月发布的文章数 -->
                    <bar-chart v-if="flag" :xAxisData="monthAritcleTotal.yearMonthList" :seriesData="monthAritcleTotal.aritcleTotalList"/>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import PanelGroup from './components/PanelGroup'
import api from '@/api/dashboard'

export default {
  name: 'Dashbord',
  components: { PieChart , BarChart , PanelGroup }, // 2. 作为子组件
  data() {
    return {
      userTotal: 0, // 总用户
      flag: false, //是否显示子组件，加载数据完成后
      categoryTotal: {}, // 每个分类下的文章数
      monthAritcleTotal: {} // 查询近6个月发布的文章数
    }
  },
  mounted() {
    //查询总条数
    this.getTotal()
    // 统计各技术频道文章数和近6个月发布文章数
    this.getArticleTotal()
  },
  methods: {
    async getTotal() {
      // 总用户
      const {data: userTotal} = await api.getTotal()
      this.userTotal = userTotal
    },

    async getArticleTotal() {
      // 每个分类下的文章数
      const {data: categoryTotal} = await api.getCategoryTotal()
      this.categoryTotal = categoryTotal
      // 查询近6个月发布的文章数
      const {data: monthAritcleTotal} = await api.getMonthAritcleTotal()
      this.monthAritcleTotal = monthAritcleTotal
      // 数据加载完成，显示子组件
      this.flag = true
    }
  },
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
