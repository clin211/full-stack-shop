<template>
  <div class="dashboard-editor-container">
    <!-- 头部卡片 -->
    <div class="clearfix">
      <el-row :gutter="12">
        <el-col :span="8">
          <el-card shadow="hover">
            今日订单数 <el-divider></el-divider>{{order}}
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover">
            今日日活 <el-divider></el-divider> {{number}}
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover">
            今日销量总价 <el-divider></el-divider> {{money}}
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!-- 统计图 -->
    <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
    <div id="main" class="productEcharts" ></div>
  </div>
</template>

<script>
import { cardList, chartsList } from '@/api/api.js'
import * as echarts from 'echarts';
export default {
  name: "index",
  // components: { PanThumb, GithubCorner },
  data() {
    return {
      order: '',
      number: '',
      money: '',
      order_total: [],
      sale_price_total: [],
      consumption_per_person: [],
      new_order: []
    };
  },
  computed: {},
  created() {
    this.getList()
    // this.getChartsList()
  },
  mounted() {
    this.getChartsList()
    // this.init();
  },
  methods: {
    getList() {
      cardList().then( res => {
        console.log(res)
        if(res.code === 1){
          this.order = res.data.today_order_count
          this.number = res.data.dau
          this.money = res.data.conversion_rate
        }
      })
    },
    getChartsList() {
      chartsList().then( res => {
          console.log(res)
          if(res.code === 1){
            this.order_total = res.data.order_total
            this.sale_price_total = res.data.sale_price_total
            this.consumption_per_person = res.data.consumption_per_person
            this.new_order = res.data.new_order
            this.init()
          }
        })
      },
    init() {
      // this.getChartsList()
       var myChart = echarts.init(document.getElementById('main'));
       var option = {
              title: {
                text: '商品销量一览表'
              },
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'cross',
                  label: {
                    backgroundColor: '#6a7985'
                  }
                }
              },
              legend: {
                data: ['订单总数', '销量总价', '人均消费', '近十分钟新增订单数']
              },
              toolbox: {
                feature: {
                  saveAsImage: {}
                }
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: [
                {
                  type: 'category',
                  boundaryGap: false,
                  data: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
                }
              ],
              yAxis: [
                {
                  type: 'value'
                }
              ],
              series: [
                {
                  name: '订单总数',
                  type: 'line',
                  stack: 'Total',
                  areaStyle: {},
                  emphasis: {
                    focus: 'series'
                  },
                  data: this.order_total
                },
                {
                  name: '销量总价',
                  type: 'line',
                  stack: 'Total',
                  areaStyle: {},
                  emphasis: {
                    focus: 'series'
                  },
                  data: this.sale_price_total
                },
                {
                  name: '人均消费',
                  type: 'line',
                  stack: 'Total',
                  areaStyle: {},
                  emphasis: {
                    focus: 'series'
                  },
                  data: this.consumption_per_person
                },
                {
                  name: '近十分钟新增订单数',
                  type: 'line',
                  stack: 'Total',
                  areaStyle: {},
                  emphasis: {
                    focus: 'series'
                  },
                  data: this.new_order
                },
               
              ]
        };
      // 使用刚指定的配置项和数据显示图表。
       option && myChart.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  background-color: #e3e3e3;
  min-height: 100vh;
  padding: 50px 60px 0px;
}
.productEcharts{
  width: 100%;
  margin: 30px auto;
  margin-bottom: 0;
  background-color: #fff;
  height: 620px;
  padding: 15px;
}
</style>
