<template>
  <div class="product-main">
    <!-- 商品列表 -->
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

      <el-table
        :data="productList"
        border
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="100" fixed="left" />
        <el-table-column label="名称" width="400" prop="name">
        </el-table-column>
        <el-table-column label="可使用商品" width="440" prop="productues">
        </el-table-column>
        <el-table-column label="优惠券面额" width="570" prop="price">
        </el-table-column>
       
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="edit(scope.row)"
              >编辑</el-button>
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
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="50%">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="可使用商品" prop="productues">
          <el-select v-model="checkValue" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <!-- <el-input v-model="form.productues" placeholder="请输入可使用商品"></el-input> -->
        </el-form-item>
        <el-form-item label="优惠券面额" prop="price">
          <el-input v-model="form.price" placeholder="请输入优惠券面额"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose()">取 消</el-button>
        <el-button type="primary" @click="handleOk()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {comList, couponList, couponDelete, couponUpdate, couponAdd } from '@/api/api.js'
import { add } from 'zrender/lib/core/vector';
export default {
  name: "ProductList",
  components: {},
  data() {
    return {
      form: {
        name: '',
        productues: '',
        price: '',
        category_id: '',
      },
      loading: true, // 加载
      productList: [],
      currentPage4: 1,//当前页
      limit: 10,//每页条数
      page: 1,//页数
      total: null,//总条数
      dialogVisible: false,
      title: '',
      options: [],
      keyword: '',
      checkValue: ''

    };
  },
  created() {
    this.getList()
    this.getGoodsList()
  },
  methods: {
    getList() {
      let params = {
        limit: 10,
        page: 1
      }
      couponList(params).then( res => {
        console.log(res)
        if(res.code === 1){
          this.productList = res.data.list
          this.total = res.data.count
        }
      })
    },
    getGoodsList() {
      let params = {
        limit: this.limit,
        page: this.currentPage4,
        keyword: this.keyword
      }
      comList(params).then( res => {
        console.log(res)
        if(res.code === 1){
          this.options = res.data.list
          // this.total = res.data.count
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
          couponDelete(params).then(res => {
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
    handleClose() {
      this.form.name = '',
      this.form.productues = '',
      this.form.price = '',
      this.form.id = null
      this.dialogVisible = false
    },
    handleOk() {
      if(this.title === '新增'){
        this.add()
      } else {
        this.updata()
      }
    },

    //分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
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
      this.dialogVisible = true
      this.title = '新增'
    },
    edit(data) {
      this.dialogVisible = true
      this.title = '编辑'
      this.form = data
    },
    add() {
      let params = {
        name: this.form.name,
        price: this.form.price,
        goods_ids: this.checkValue,
        category_id: this.form.category_id
      }
      couponAdd(params).then(res => {
        if(res.code === 1){
          this.$message({
            message: '新增成功',
            type: 'success'
          })
          this.handleClose()
          this.getList()
        }
      })
    },
    updata() {
      let params = {
        name: this.form.name,
        price: this.form.price,
        goods_id: this.checkValue,
        category_id: this.form.category_id,
        id: this.form.id
      }
      couponUpdate(params).then( res => {
        if(res.code === 1){
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
          this.handleClose()
          this.getList()
        }
      })
    },
  },
};
</script>

<style  scoped lang="scss">
</style>
