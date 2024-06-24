<template>
 <div class="productCategory">
    <el-card shadow="never" class="card">
      <div slot="header">
        <span>分类管理</span>
      </div>
      <el-button type="primary" size="default" @click="add()">新增分类</el-button>
      <!-- 树形table -->
      <el-table
        :data="productList"
        style=" margin:30px auto"
        row-key="id"
        border
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column label="菜单" prop="name" width="250" fixed>

        </el-table-column>
        <!-- <el-table-column align="center" label="icon" width="200">
          <template slot-scope="scope">
            <img class="innerImg" :src="scope.row.icon" alt="">
          </template>
        </el-table-column> -->
        <el-table-column
          align="center"
          label="分类名字"
          prop="name"
          width="250"
        />
        <el-table-column
          align="center"
          label="分类层级"
          prop="level"
          width="250"
        >
          <template #default="props"><div>{{props.row.level}}级</div></template>
        </el-table-column>
<!--        <el-table-column-->
<!--          align="center"-->
<!--          label="排序"-->
<!--          prop="sort"-->
<!--          width="120"-->
<!--        />-->
        <!-- <el-table-column align="center" label="显示状态" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.showStatus === 1 ? '显示' : '不显示' }}</span>
          </template>
        </el-table-column> -->

        <!-- <el-table-column
          align="center"
          label="描述"
          prop="description"
        /> -->
        <el-table-column
          align="center"
          label="创建时间"
          prop="created_at"

        />
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="deletes(scope.row)"
              ><span style="color: red">删除</span></el-button>
            </template>
        </el-table-column>
      </el-table>

    </el-card>
    <el-dialog
      title="添加分类"
      :visible.sync="dialogVisible"
      width="50%">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称"></el-input>
        </el-form-item>
<!--        <el-form-item label="分类图片" prop="pic_url">-->
<!--          <el-input v-model="form.pic_url" placeholder="请输入分类图片"></el-input>-->
<!--        </el-form-item>-->
        <el-form-item label="父分类名称" prop="parent_id">
          <el-input v-model="form.parent_id" placeholder="请输入父分类名称"></el-input>
        </el-form-item>
        <el-form-item label="分类层级" prop="level">
          <el-input v-model="form.level" placeholder="请输入分类层级"></el-input>
        </el-form-item>
<!--        <el-form-item label="分类排序" prop="sort">-->
<!--          <el-input v-model="form.sort" placeholder="请输入分类排序"></el-input>-->
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
import { classList, classAdd, classDelete } from '@/api/api.js'
export default {
  name: 'productCategory',
  components: {

  },
  data() {
    return {
      form: {
        name: '',
        pic_url: '1',
        parent_id: '',
        level: '',
        sort: '1'
      },
      productList: [],
      currentPage4: 1,//当前页
      limit: 10,//每页条数
      page: 1,//页数
      total: '',//总条数
      dialogVisible: false,
    }
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
      classList(params).then( res => {
        if(res.code === 1){
          res.data.list.forEach(res => {
            res.children = res.items
          })
          this.productList = res.data.list
          this.total = res.data.count
          console.log(this.productList)
        }
      })
    },
    add() {
      this.dialogVisible = true
    },
    deletes(row) {
      this.$confirm('删除后不可恢复, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(row)
          if(row.children){
            this.$message({
              message: '该分类下有子分类无法删除，需先删除子分类',
              type: 'error'
            })
            return
          }
          let params = {
            id: row.id
          }
          classDelete(params).then(res => {
            if(res.code === 1) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.getList()
            }
          })
        }).catch(() => {
        })
      },
    handleOk() {
      this.productList.forEach(res => {
        console.log(res)
        if(this.form.parent_id === res.name) {
          this.form.parent_id = res.id
        }
        if(this.form.parent_id === this.form.name) {
          this.form.parent_id = 1
        }
      })
      let params = this.form
      classAdd(params).then(res => {
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
    handleClose() {
      this.form.name = ''
      this.form.pic_url = '1'
      this.form.parent_id = ''
      this.form.level = null
      this.form.sort = '1'
      this.dialogVisible = false
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
