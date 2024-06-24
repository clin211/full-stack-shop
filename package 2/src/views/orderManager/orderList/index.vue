<template>
  <div class="order-main">
    <el-form
      label-width="80px"
      :inline="false"
      class="search"
      size="normal"
    >
      <el-row :gutter="10">
        <!-- <el-col class="searchItem" :span="6" :offset="0">
          <el-form-item label="姓名" size="mini">
            <el-input
              v-model="search.name"
              class="search-input"
              size="mini"
              placeholder="请输入姓名"
            />
          </el-form-item>
        </el-col> -->
        <el-col class="searchItem" :span="6" :offset="0">
          <el-form-item label="订单状态" size="mini">
            <el-select
              v-model="search.status"
              class="search-input"
              size="mini"
              clearable
              placeholder="订单状态"
            >
              <el-option label="待支付" value="1" />
              <el-option label="已支付" value="2" />
              <el-option label="已发货" value="3" />
              <el-option label="已收获待评价" value="4" />
              <el-option label="全部" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col style="float: right" :span="4" :offset="0">
          <el-button type="primary" size="mini" @click="doSearch"
            >搜索</el-button
          >
          <el-button type="default" size="mini" @click="doReset"
            >重置
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <!-- 订单列表 -->
    <el-card class="card" shadow="never">
      <el-table
        :data="orderLists"
        border
        style="width: 100%"
      >
        <el-table-column type="index" label="#" fixed="left" />

        <el-table-column
          align="center"
          label="订单编号"
          prop="number"
          width="300"
        >
          <template slot-scope="scope">
            <!-- <router-link></router-link> -->
            <span> {{ scope.row.number }}</span>
          </template>
        </el-table-column>

        <!-- <el-table-column
          align="center"
          label="支付方式"
          prop="pay_type"
          width="200"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_type === 0" type="info" effect="dark"
              >未支付</el-tag
            >
            <el-tag
              v-else-if="scope.row.pay_type === 1"
              effect="dark"
              style="font-size: 25px"
            >
              <svg-icon icon-class="aliPay" class="aliPay" />
            </el-tag>
            <el-tag v-else style="font-size: 25px" type="success" effect="dark">
              <svg-icon icon-class="weixin" class="weixin" />
            </el-tag>
          </template>
        </el-table-column> -->
        <el-table-column align="center" label="订单状态" width="200">
          <template slot-scope="scope">
            <!-- <router-link></router-link> -->
            <el-tag v-if="scope.row.status === 1" type="danger" effect="dark"
              >待支付</el-tag
            >
            <el-tag v-if="scope.row.status === 2" type="danger" effect="dark"
              >已支付</el-tag
            >
            <el-tag v-if="scope.row.status === 3">已发货</el-tag>
            <el-tag v-if="scope.row.status === 4" effect="dark"
              >已收获待评价</el-tag
            >

          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="添加时间"
          prop="created_at"
          width="300"
        />
        <el-table-column
          align="center"
          label="用户账号"
          prop="consignee_name"
          width="200"
        />
        <el-table-column align="center" label="订单类型" width="200">
          <template slot-scope="scope">
            <!-- <router-link></router-link> -->
            <el-tag v-if="scope.row.orderType === 1" type="warning"
              >秒杀订单</el-tag
            >
            <el-tag v-else type="success">正常订单</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="备注" prop="remark" />
        <!-- <el-table-column fixed="right" align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              type="primary"
              style="width: 150px"
              size="mini"
              @click="goEdit(scope.row)"
            >
              <i
                style="margin-right: 6px"
                class="el-icon-view"
              />查看订单</el-button
            >
          </template>
        </el-table-column> -->
      </el-table>

     <!-- 所有列表都要有分页 除非有特殊要求 否则数据多的情况下就没办法看了 -->
     <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
// import orderApi from "@/api/order/index";
// import mixin from "@/mixins/index";
import { orderList } from '@/api/api.js'
export default {
  name: "orderlist",
  data() {
    return {
      loading: false,
      search: {
        orderType: "", // 订单类型
        payType: "", // 支付类型
        status: "", // 订单状态
      },
      orderLists: [
        {
          orderSn: "oSY34233252",
          payType: "0",
          status: "0",
          createTime: "2022-12-03",
          memberUsername: "wha2132424",
          orderType: "0",
          note:'此订单为正常单'
        },
           {
          orderSn: "oSY34233252",
          payType: "0",
          status: "0",
          createTime: "2022-12-03",
          memberUsername: "wha2132424",
          orderType: "0",
          note:'此订单为正常单'
        },
           {
          orderSn: "oSY34233252",
          payType: "0",
          status: "0",
          createTime: "2022-12-03",
          memberUsername: "wha2132424",
          orderType: "0",
          note:'此订单为正常单'
        },
           {
          orderSn: "oSY34233252",
          payType: "0",
          status: "0",
          createTime: "2022-12-03",
          memberUsername: "wha2132424",
          orderType: "0",
          note:'此订单为正常单'
        },

      ], // 订单列表
      currentPage4: 1,//当前页
      limit: 10,//每页条数
      page: 1,//页数
      total: null,//总条数
    };
  },
  computed: {},
  created() {
    this.getList()
  },
  methods: {
    getList() {
      let params = {
        status: this.search.status,
        limit: this.limit,
        page: this.currentPage4
      }
      orderList(params).then( res => {
        console.log(res)
        if(res.code === 1){
          this.orderLists = res.data.list
          this.total = res.data.count
        }
      })
    },
    // 编辑
    goEdit(row) {
      // 路由跳转
      this.$router.push({ name: "orderDetail", params: { id: row.id } });
    },
     //分页
     handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage4 =
      this.getList()
    },
    // 重置搜索栏
    doReset() {
        this.search.status = ''
        this.currentPage4 = 1
        this.limit = 10
      },
    // 搜索按钮
    doSearch() {
      this.getList()
    },
  },
};
</script>

<style  scoped lang="scss">
.search {
  padding: 30px 20px 10px 20px;
}
.order-main {
  .searchForm {
    ::v-deep .el-form-item {
      label {
        font-weight: normal;
      }
    }
  }
  .card {
    margin: 30px;
  }
  .search-main {
    .search-input {
      width: 200px;
    }
  }
  .table_img {
    width: 100px;
    height: 100px;
  }
  .searchBtn_wrapper {
    margin-top: 20px;
    display: flex;
    flex-direction: row-reverse;
  }
}
</style>
