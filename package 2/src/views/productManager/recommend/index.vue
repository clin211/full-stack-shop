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
          <el-table-column label="文章标题" prop="title">
          </el-table-column>
          <el-table-column label="展示图片" prop="title" width="150">
            <template slot-scope="scope">
                <img style="width: 100px;" :src="scope.row.pic_url" alt="">
            </template>
          </el-table-column>
          <el-table-column label="添加时间" width="200" prop="created_at">
          </el-table-column>  
          <el-table-column label="内容" prop="detail">
          </el-table-column>   
          <el-table-column label="摘要" prop="desc">
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
          <el-form-item label="文章标题" prop="title">
            <el-input v-model="form.title" placeholder="请输入文章标题"></el-input>
          </el-form-item>
          <el-form-item label="展示图片" prop="pic_url">
            <el-input v-model="form.pic_url" placeholder="请输入图片链接"></el-input>
          </el-form-item>
          <el-form-item label="内容" prop="price">
            <el-input v-model="form.detail" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="摘要" prop="price">
            <el-input v-model="form.desc" placeholder="请输入摘要"></el-input>
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
  import { recommendList, recommendDelete, recommendUpdata, recommendAdd } from '@/api/api.js'
  import { add } from 'zrender/lib/core/vector';
  export default {
    name: "recommend",
    components: {},
    data() {
      return {
        form: {
          title: '',
          pic_url: '',
          detail: '',
          desc: '',
          id: ''
        },
        loading: true, // 加载
        productList: [],
        currentPage4: 1,//当前页
        limit: 10,//每页条数
        page: 1,//页数
        total: null,//总条数
        dialogVisible: false,
        title: ''
  
      };
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        let params = {
          limit: 10,
          page: 1
        }
        recommendList(params).then( res => {
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
            recommendDelete(params).then(res => {
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
        this.form.title = '',
        this.form.pic_url = '',
        this.form.detail = '',
        this.form.id = null
        this.form.desc = ''
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
      },
      // 搜索按钮
      doSearch() {
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
          title: this.form.title,
          pic_url: this.form.pic_url,
          detail: this.form.detail,
          desc: this.form.desc,
          id: this.form.id,
        }
        recommendAdd(params).then(res => {
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
          title: this.form.title,
          pic_url: this.form.pic_url,
          detail: this.form.detail,
          desc: this.form.desc,
          id: this.form.id,
        }
        recommendUpdata(params).then( res => {
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
  