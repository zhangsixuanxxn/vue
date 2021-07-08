<template>
    <div ref="main" :class="className" :style="{height:height,width:width}" />
</template>
<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
export default {
    mixins: [resize],
    props: {
        className: {
            type: String,
            default: 'chart'
        },
        width: {type: String,
            default: '100%'
        },
        height: {
            type: String,
            default: '400px'
        },
        legendData: {
            type: Array,
            default: () => ["前端","Java","移动端","大数据", "人工智能", "区块链"]
        },
        seriesData: { // 柱状数据
            type: Array,
            default: () => [
                {value: 335, name: '前端'},
                {value: 310, name: 'Java'},
                {value: 234, name: '移动端'},
                {value: 135, name: '大数据'},
                {value: 1548, name: '人工智能'},
                {value: 1548, name: '区块链'}
            ]
        }
    },
    data() {
        return {
            chart: null
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initChart()
        })
    },
    beforeDestroy() {
        if (!this.chart) {
            return
        }
        this.chart.dispose()
        this.chart = null
    },
    methods: {
        initChart() {
            // 初始化实例时，指定主题
            this.chart = echarts.init(this.$refs.main, 'macarons')
            this.chart.setOption({
                title: { // 标题
                    text: '各技术频道文章统计', // 主标题
                    left: 'center' // 居中
                },
                tooltip: {// 鼠标放上去显示的格式
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: { // 左上角数据
                    orient: 'vertical', // 垂直
                    left: 'left', // 左侧
                    data: this.legendData
                },
                series: [ // 图数据
                    {
                        name: '统计内容', //鼠标放上去显示文字
                        type: 'pie', // 饼图
                        radius: '55%', // 圆大小
                        center: ['50%', '50%'], // 饼图位置【左，上】
                        data: this.seriesData,// 图饼展示数据
                        emphasis: {
                            itemStyle: { // 图形样式
                                shadowBlur: 10, // 图形阴影的模糊大小
                                shadowOffsetX: 0, // 阴影水平方向上的偏移距离
                                shadowColor: 'rgba(0, 0, 0, 0.5)' //阴影颜色
                            }
                        }
                    }
                ]
            })
        }
    }
}
</script>