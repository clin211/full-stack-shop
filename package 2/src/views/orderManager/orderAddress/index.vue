<template>
  <div class="product-main">
    <!-- <el-collapse class="collapse" v-model="activeNames"> -->
      <!-- <el-collapse-item title="商品查询" name="1"> -->
        <el-form
          label-width="80px"
          :inline="false"
          class="search"
          size="normal"
        >
          <el-row :gutter="10">
            <el-col class="searchItem" :span="6" :offset="0">
              <el-form-item label="姓名" size="mini">
                <el-input
                  v-model="name"
                  class="search-input"
                  size="mini"
                  placeholder="姓名"
                />
              </el-form-item>
            </el-col>
            <el-col class="searchItem" :span="6" :offset="0">
                <el-form-item label="电话" size="mini">
                  <el-input
                    v-model="phone"
                    class="search-input"
                    size="mini"
                    placeholder="电话"
                  />
                </el-form-item>
              </el-col>
            <!-- <el-col class="searchItem" :span="6" :offset="0">
              <el-form-item label="上架状态" size="mini">
                <el-select
                  v-model="search.publishStatus"
                  class="search-input"
                  size="mini"
                  clearable
                  placeholder="上架状态"
                >
                  <el-option label="上架" value="1" />
                  <el-option label="未上架" value="0" />
                </el-select>
              </el-form-item>
            </el-col> -->
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
      <!-- </el-collapse-item> -->
    <!-- </el-collapse> -->

    <!-- 商品列表 -->
    <el-card class="card" shadow="never">
      <!-- 商品列表 -->

      <!-- 商品列表 -->

      <el-table
        :data="productList"
        border
        style="width: 100%"
      >
        <el-table-column type="index" width="100" label="序号" fixed="left" />
        <el-table-column label="姓名" width="340" prop="name">
        </el-table-column>
        <el-table-column label="电话" width="340" prop="phone">
        </el-table-column>
        <el-table-column label="地址" prop="price">
          <template slot-scope="scope">
            {{(scope.row.city + scope.row.town + scope.row.street + scope.row.detail)}}
          </template>
        </el-table-column>
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
import { addressList } from '@/api/api.js'
export default {
  name: "ProductList",
  components: {},
  data() {
    return {
      name: '',
      phone: '',
      downloadLoading: false,
      activeNames: ["1"],
      keyword: '',
      loading: true, // 加载
      productList: [],
      currentPage4: 1,//当前页
      limit: 10,//每页条数
      page: 1,//页数
      total: null//总条数
    };
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      let params = {
        limit: this.limit,
        page: this.currentPage4,
        name: this.name,
        phone: this.phone
      }
      addressList(params).then( res => {
        console.log(res)
        if(res.code === 1){
          this.productList = res.data.list
          this.total = res.data.count
        }
      })
    },

    //分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.getList()
    },

    // 重置搜索栏
    doReset() {
      this.name = ''
      this.phone = ''
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


<style lang="scss">
.el-collapse-item__header{
    margin-left: 10px!important;
    font-size: 18px;
}
.search {
  padding: 30px 20px 10px 10px;
}
</style>
