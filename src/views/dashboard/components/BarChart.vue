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
        width: {
            type: String,
            default: '100%'
        },
        height: {
            type: String,
            default: '400px'
        },
        xAxisData: { // x轴显示的年月
            type: Array,
            default: () => ['2021-01', '2021-02', '2021-03', '2021-04', '2021-05', '2021-06']
        },
        seriesData: { // 柱状数据
            type: Array,
            default: () => [10, 52, 200, 334, 390, 330]
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
            this.chart = echarts.init(this.$refs.main, 'macarons')
            this.chart.setOption({
                title: { // 标题
                    text: '近6个月发布的文章数', // 主标题
                    left: 'center' // 居中
                },
                tooltip: { // 提示框组件
                    trigger: 'axis', // 鼠标放柱子上事件
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效,
                        type: 'shadow' // 默认为直线（line），shadow（灰色背景） 可选为：'line' | 'shadow'
                    }
                },
                grid: { // 柱状图整体位置
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [ // x 轴
                    {
                        type: 'category',
                        data: this.xAxisData,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis: [ // y 轴
                    {
                        type: 'value'
                    }
                ],
                series: [ //系列，显示的数据
                    {
                        name: '发布数', // 悬浮提示内容
                        type: 'bar', // 柱状类型
                        barWidth: '60%', // 每个柱状宽度
                        data: this.seriesData
                    }
                ]
            })
        }
    }
}
</script>
