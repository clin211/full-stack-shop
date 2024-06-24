<template>
  <div class="product-main">
    <!-- 轮播图列表 -->
    <el-card class="card" shadow="never">
      <div slot="header">
        <el-button
          type="primary"
          size="mini"
          @click="addProduct(0)"
          >新增</el-button
        >
      </div>
      <!-- 商品列表 -->

      <!-- 商品列表 -->

      <el-table :data="productList" border style="width: 100%">
        <el-table-column type="index" label="序号" width="100" fixed="left" />
        <el-table-column label="轮播图" width="400" prop="bannerImg">
          <template slot-scope="scope">
            <img
              style="width: 2.6667rem; height: 2.6667rem"
              :src="scope.row.pic_url"
              class="avatar"
            />
          </template>
        </el-table-column>
        <el-table-column label="跳转商品ID" width="400" prop="link">
<!--          <template slot-scope="scope">-->
<!--            <a :href="scope.row.link">###</a>-->
<!--          </template>-->
        </el-table-column>
<!--        <el-table-column label="排序值" width="300" prop="sort">-->
<!--        </el-table-column>-->
        <el-table-column label="添加时间"  prop="created_at">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="openDialo(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="deletes(scope.row)"><span style="color: red">删除</span></el-button>
          </template>
        </el-table-column>
      </el-table>
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
      :close-on-click-modal="false"
      :title="title"
      :visible.sync="dialogVisible"
      width="50%">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="轮播图" prop="pic_url">
          <el-input v-model="form.pic_url" placeholder="请输入轮播图地址"></el-input>
        </el-form-item>
        <el-form-item label="商品ID" prop="link">
          <el-input v-model="form.link" placeholder="请输入跳转ID"></el-input>
        </el-form-item>
<!--        <el-form-item label="排序值" prop="sort">-->
<!--          <el-input v-model="form.sort" placeholder="请输入排序值"></el-input>-->
<!--        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose()">取 消</el-button>
        <el-button type="primary" @click="handleOk()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { loopList, loopDelete, loopAdd, loopEdit } from '@/api/api.js'
export default {
  name: "bannerSwiper",
  components: {},
  data() {
    return {
      form: {
        pic_url: '',
        link: '',
        sort: '1',
        id: null
      },
      rules: {
        pic_url: [
            { required: true, message: '请输入轮播图地址', trigger: 'blur' },
        ]
      },
      productList: [],   // 轮播图列表
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
      loopList(params).then( res => {
        console.log(res)
        if(res.code === 1){
          this.total = res.data.count
          this.productList = res.data.list
        }
      })
    },
    deletes(row) {
      this.$confirm('删除后不可恢复, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            id: row.id
          }
          loopDelete(params).then(res => {
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
    addProduct() {
      this.dialogVisible = true
      this.title = '新增'
    },
    handleClose(form) {
      this.form.pic_url = '',
      this.form.link = '',
      this.form.sort = '',
      this.form.id = null
      this.dialogVisible = false
    },
    handleOk() {
      if(this.title === '新增'){
        this.add()
      } else {
        this.edit()
      }
    },
    add() {
      let params = this.form
      loopAdd(params).then(res => {
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
    openDialo(data) {
      this.dialogVisible = true
      this.title = '编辑'
      this.form.pic_url = data.pic_url
      this.form.link = data.link
      this.form.id = data.id
      this.form.sort = data.sort
    },
    edit() {
      let params = {
        pic_url: this.form.pic_url,
        link: this.form.link,
        id: this.form.id,
        sort: this.form.sort
      }
      loopEdit(params).then(res => {
        if(res.code === 1){
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
          this.dialogVisible = false
          this.handleClose()
          this.getList()
        }
      })
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

  },
};
</script>

<style  scoped lang="scss">
</style>
