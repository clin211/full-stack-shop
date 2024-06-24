<template>
    <div class="order-main">
      <el-form
        label-width="80px"
        :inline="false"
        class="search"
        size="normal"
      >
        <el-row :gutter="10">
          <el-col class="searchItem" :span="6" :offset="0">
            <el-form-item label="用户名" size="mini">
              <el-input
                v-model="search.name"
                class="search-input"
                size="mini"
                placeholder="请输入姓名"
              />
            </el-form-item>
          </el-col>
          <el-col class="searchItem" :span="6" :offset="0">
            <el-form-item label="性别" size="mini">
              <el-select
                v-model="search.sex"
                class="search-input"
                size="mini"
                clearable
                placeholder="性别"
              >
                <el-option label="男" value="1" />
                <el-option label="女" value="2" />
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
            label="姓名"
            prop="name"
            width="300"
          >
          </el-table-column>

          <el-table-column
            align="center"
            label="性别"
            width="200"
          >
            <template slot-scope="scope">
              <!-- <router-link></router-link> -->
              <p v-if="scope.row.sex == 1">男</p>
              <p v-if="scope.row.sex == 2">女</p>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="个性签名"
            prop="sign"
          >
          </el-table-column>
          <el-table-column
            align="center"
            label="注册时间"
            prop="created_at"
            width="200"
          >
          </el-table-column>
          <el-table-column align="center" label="冻结账户" width="150">
            <template slot-scope="scope">
              <el-switch
                @change="switchChange(scope.row)"
                v-model="scope.row.cool"
                active-color="#00c761"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" label="提升为管理员" width="150">
            <template slot-scope="scope">
              <el-button type="primary" @click="addadmin(scope.row)">提升</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="删除" width="150">
            <template slot-scope="scope">
              <el-button type="danger" @click="deleteuser(scope.row.id)">删除</el-button>
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
  // import orderApi from "@/api/order/index";
  // import mixin from "@/mixins/index";
  import {
    addAdmin,
    couponDelete,
    editAdmin,
    getAdminList,
    getRoleList,
    memberDelete,
    memberList,
    memberUpdate
  } from '@/api/api.js'
  export default {
    name: "memberlist",
    data() {
      return {
        switchs: false,
        loading: false,
        orderLists: [], // 订单列表
        currentPage4: 1,//当前页
        limit: 10,//每页条数
        page: 1,//页数
        total: null,//总条数
        roleList: [],
        search: {
          sex: '',
          name: '',
          keyword: ''
        },

        form: {
          name: "",
          password: "",
          is_admin: "1",
          user_salt:"",
        },
      };
    },
    computed: {},
    created() {
      this.getList()
    },
    methods: {
      async getList() {
        this.orderLists = []
        this.roleList = []
        let params = {
          sex: this.search.sex,
          name: this.search.name,
          limit: this.limit,
          page: this.currentPage4
        };

        const roleList = await getRoleList({ page: 1, limit: 50 });
        console.log(roleList)

        memberList(params).then( res => {
          if(res.code === 1){
            res.data.list.forEach(res => {
              if(res.status == 1){
                res.cool = false
              } else {
                res.cool = true
              }
            })
            this.orderLists = res.data.list
            console.log(this.orderLists)
            this.total = res.data.count
          }
        })
      },
      // 冻结账号
      switchChange(data) {
        let status = ''
        if(data.cool == false){
          status = 1
        } else {
          status = 2
        }
        let params = {
          id: data.id,
          status: status
        }
        memberUpdate(params).then( res => {
          if(res.code == 1){
            if(status == 2){
              this.$message({
                message: '已冻结该用户',
                type: 'success'
              })
            } else {
              this.$message({
                message: '已解冻该用户',
                type: 'success'
              })
            }
          }
        })
      },
       //分页
       handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage4 = val
        this.getList()
      },
      // 重置搜索栏
      doReset() {
        this.search.keyword = ''
        this.search.sex = ''
        this.search.name = ''
        this.currentPage4 = 1
        this.limit = 10
      },
      // 搜索按钮
      doSearch() {
        this.getList()
      },


      deleteuser(id) {
        this.$confirm('删除后无法恢复，确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            id: id
          }
          memberDelete(params).then(res => {
            console.log(res)
            if(res.code === 1) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.getList()
            }
          })
        })
      },


      async addadmin(row) {
        this.$confirm('是否提升为管理员?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            id: row.id
          }
          memberDelete(params).then(res => {
            console.log(res)
            if(res.code === 1) {
              this.$message({
                message: '成功',
                type: 'success'
              })
              this.getList()
            }
          })
        })
        this.form.password = row.password;
        this.form.name = row.name;
        this.form.user_salt = row.user_salt;
        const { name, desc } = this.form;
        if (name.length < 1 && desc.length < 1) {
          this.$message({
            message: "内容不能为空",
            type: "warning",
          });
          return;
        }
          // 验证是否有相同名称
          if (this.roleList.some((item) => item.name === name)) {
            this.$message({
              message: "已有相同用户名",
              type: "warning",
            });
            return;
          }
          const res = await addAdmin(this.form);
          if (res.code === 1) {
            // this.$message({
            //   message: "添加成功",
            //   type: "success",
            // });
          }
        // 更新页面
        this.getList();
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
