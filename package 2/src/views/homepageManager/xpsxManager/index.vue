<template>
  <div class="product-main">
    <!-- 轮播图列表 -->
    <el-card class="card" shadow="never">
      <div slot="header">
        <el-button
          type="primary"
          size="mini"
          @click="addProduct"
          >新增</el-button
        >
      </div>
      <!-- 商品列表 -->

      <!-- 商品列表 -->
      <el-table :data="productList" border style="width: 100%">
        <el-table-column type="index" label="序号" width="100" fixed="left" />
        <el-table-column label="商品名称" width="300" prop="productname">
        </el-table-column>
        <el-table-column label="跳转链接" width="440">
          <template slot-scope="scope">
            <a :href="scope.row.productSrc">dksf</a>
          </template>
        </el-table-column>
        <el-table-column label="排序值" width="200" prop="productOrder">
        </el-table-column>
        <el-table-column label="商品编号" width="200" prop="productOrder">
        </el-table-column>
        <el-table-column label="添加时间" width="300" prop="addTime">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <el-button type="text" size="small">编辑</el-button>
          <el-button type="text" size="small"
            ><span style="color: red">删除</span></el-button
          >
        </el-table-column>
      </el-table>
      <!-- <el-pagination
        :current-page="page.currentPage"
        :page-sizes="page.pageSizes"
        :page-size="page.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />  -->
    </el-card>
  </div>
</template>

<script>
export default {
  name: "xpsxManager",
  components: {},
  data() {
    return {
      activeNames: ["1"],
      search: {
        productSn: "",
        publishStatus: "",
        verifyStatus: "",
        name: "",
      },
      loading: true, // 加载
      productList: [
        {
          // 商品列表
          productname: "华为手机R30折叠屏",
          productSrc: "https://malujiaoyu.com/",
          productOrder: "201",
          addTime: "2022-01-14",
        },
        {
          productSrc: "https://malujiaoyu.com/",
          productname: "满12000减1-00",
          productues: "华为折叠屏手机",
          productPrice: "1000元",
        },
        {
          productSrc: "https://malujiaoyu.com/",
          productname: "满6000减700",
          productues: "华为R30手机",
          productPrice: "700元",
        },
        {
          productSrc: "https://malujiaoyu.com/",
          productname: "满6000减700",
          productues: "华为R30手机",
          productPrice: "700元",
        },
      ],
    };
  },
  created() {},
  methods: {
    handleChange(val) {
      console.log(val);
    },
    // 重置搜索栏
    doReset() {
      // this.search = {
      //     gname: '',
      //     pcode: '',
      //     brandId: '',
      //     price: ''
      // }
      // this.searchForm = {}
    },
    // 搜索按钮
    doSearch() {
      // this.page.currentPage = 1
      // this.searchForm = Object.assign({}, this.search)
      // this.getProductList()
    },
    // 新增优惠券
    addProduct() {
      this.$router.push({ name: "addProductDetail" });
    },
  },
};
</script>

<style  scoped lang="scss">
</style>
