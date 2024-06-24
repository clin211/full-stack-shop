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
              <el-form-item label="商品名称" size="mini">
                <el-input
                  v-model="keyword"
                  class="search-input"
                  size="mini"
                  placeholder="商品名称/模糊查询"
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
      <div slot="header">
        <el-button
          type="primary"
          size="mini"
          @click="addProduct"
          >新增</el-button
        >

        <!-- <el-button
          type="primary"
          size="mini"
          :loading="downloadLoading"
          @click="handleDownload"
        >
          导出商品列表excel文件
        </el-button> -->
      </div>
      <!-- 商品列表 -->

      <!-- 商品列表 -->

      <el-table
        :data="productList"
        border
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" fixed="left" />
        <el-table-column label="商品图片" width="180" prop="pic_url">
          <template slot-scope="scope">
            <img
              style="width: 100px; height: 100px"
              :src="scope.row.pic_url"
              class="avatar"
            />
          </template>
        </el-table-column>
        <el-table-column label="商品名称" width="240" prop="name">
        </el-table-column>
        <el-table-column label="商品价格" width="200" prop="price">
        </el-table-column>
        <!-- <el-table-column label="商品优惠券" width="180" prop="stock">
        </el-table-column> -->
        <el-table-column label="商品类别" width="200" prop="tags">
        </el-table-column>
        <el-table-column label="生产日期" width="200" prop="brand">
        </el-table-column>
        <el-table-column label="保质期" width="200" prop="stock">
        </el-table-column>
        <el-table-column label="注释" width="400" prop="tags">
        </el-table-column>
        <el-table-column label="是否过期">
          <template slot-scope="scope">
            <span v-if="isExpired(scope.row.brand, scope.row.stock)">
                已过期
            </span>
            <span v-else>
                未过期
            </span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="250">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="edit(scope.row)"
              >编辑</el-button>
              <el-button
              type="text"
              size="small"
              @click="details(scope.row)"
              >详情</el-button>
            <el-button
              type="text"
              size="small"
              @click="deletes(scope.row.id)"
              ><span style="color: red">删除</span></el-button>
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
import { comList, comDelete } from '@/api/api.js'
export default {
  name: "ProductList",
  components: {},
  data() {
    return {
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
        keyword: this.keyword
      }
      comList(params).then( res => {
        console.log(res)
        if(res.code === 1){
          this.productList = res.data.list
          this.total = res.data.count
        }
      })
    },
    deletes(id) {
      this.$confirm('删除后不可恢复, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            id: id
          }
          comDelete(params).then(res => {
            console.log(res)
            if(res.code === 1) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.getList()
            }
          })
        }).catch(() => {
        });
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
      this.keyword = ''
      this.currentPage4 = 1
      this.limit = 10
    },
    // 搜索按钮
    doSearch() {
      this.getList()
    },
    // 新增商品
    addProduct() {
      this.$router.push({ name: 'addProductDetail' })
    },
    //编辑
    edit(data) {
      this.$router.push({ name: 'addProductDetail',
        query: {
          id: data.id,
          type: 0
        }
      })
    },
    details(data) {
      this.$router.push({ name: 'addProductDetail',
        query: {
          id: data.id,
          type: 1
        }
      })
    },
    isExpired(brand, stock) {
      // 获取当前日期
      const currentDate = new Date();

      // 将brand转换为日期对象
      const productionDate = new Date(brand);

      // 将stock转换为整数（保质期天数）
      const shelfLifeDays = parseInt(stock);

      // 计算产品的过期日期
      const expirationDate = new Date(productionDate);
      expirationDate.setDate(productionDate.getDate() + shelfLifeDays);

      // 判断产品是否变质
      return currentDate >= expirationDate;
    },
    //导出商品列表
    handleDownload() {
      //      <p>{{ scope.row.name }}</p>
      //     <p>品牌: {{ scope.row.brandName }}</p>
      //     <p>{{ scope.row.description }}</p>
      //   </template>
      // </el-table-column>
      // <el-table-column align="center" label="商品价格" width="150">
      //   <template slot-scope="scope">
      //     <p>原价: {{ scope.row.originalPrice | money }}</p>
      //     <p>现价: {{ scope.row.price | money }}</p>
      // this.downloadLoading = true
      // import('@/vendor/Export2Excel').then((excel) => {
      //     const tHeader = ['商品名称', '商品品牌', '商品价格']
      //     const filterVal = ['name', 'brandName', 'price']
      //     const list = this.productList
      //     const data = this.formatJson(filterVal, list)
      //     // console.log('list===',JSON.stringify()list)
      //     excel.export_json_to_excel({
      //         header: tHeader,
      //         data,
      //         filename: this.filename,
      //         autoWidth: this.autoWidth,
      //         bookType: this.bookType
      //     })
      //     this.downloadLoading = false
      // })
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
