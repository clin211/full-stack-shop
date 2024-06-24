<template>
  <div class="order-main">
    <el-form label-width="80px" :inline="false" class="search" size="normal">
      <el-row :gutter="10">
        <el-col class="searchItem" :span="6" :offset="0">
          <el-form-item label="名称" size="mini">
            <el-input
              v-model="search.keyword"
              class="search-input"
              size="mini"
              placeholder="请输入关键字"
            />
          </el-form-item>
        </el-col>
        <el-col class="searchItem" :span="6" :offset="0"> </el-col>
        <el-col style="float: right" :span="4" :offset="0">
          <el-button type="primary" size="mini" @click="doSearch()"
            >搜索</el-button
          >
          <el-button type="default" size="mini" @click="doReset()"
            >重置
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <div class="btn-box">
      <el-button type="primary" size="mini" @click="addRoleHandler()"
        >新增</el-button
      >
      <!-- 嵌套表单 -->
      <el-dialog
        :title="isEdit ? '编辑权限' : '新增权限'"
        :visible.sync="dialogFormVisible"
      >
        <el-form :model="form" :rules="rules">
          <el-form-item label="名称" prop="name">
            <el-input v-model.trim="form.name"></el-input>
          </el-form-item>
          <el-form-item label="权限" prop="path">
            <el-input v-model.trim="form.path"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addRoleFormCancel()">取 消</el-button>
          <el-button type="primary" @click="addRoleFormOk()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 订单列表 -->
    <el-card class="card" shadow="never">
      <el-table :data="roleList" border style="width: 100%">
        <el-table-column align="center" type="index" label="#" fixed="left" />
        <el-table-column align="center" label="id" prop="id" width="100" />
        <el-table-column align="center" label="名称" prop="name" />
        <el-table-column align="center" label="权限" prop="path" />
        <el-table-column
          align="center"
          label="创建时间"
          prop="created_at"
          width="200"
        />
        <el-table-column
          align="center"
          label="更新时间"
          prop="updated_at"
          width="200"
        />
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="editRoleHandler(scope.row)"
              circle
            />
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteRoleHandler(scope.row.id)"
              circle
            />
          </template>
        </el-table-column>
      </el-table>

      <!-- 所有列表都要有分页 除非有特殊要求 否则数据多的情况下就没办法看了 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import {
  getPermissionList,
  addPermission,
  deletePermission,
  editPermission,
} from "@/api/api.js";
export default {
  name: "roleList",
  data() {
    return {
      roleList: [], // 列表
      currentPage: 1, //当前页
      limit: 10, //每页条数
      page: 1, //页数
      total: null, //总条数
      dialogFormVisible: false, // 控制新增弹出框
      isEdit: false, // 是否是编辑
      editId: "", // 当前编辑id
      search: {
        keyword: "",
        timer: null, // 节流
      },
      /**
       * 表单验证
       */
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        path: [{ required: true, message: "请输入权限", trigger: "blur" }],
      },
      /**
       * 新增form
       */
      form: {
        name: "",
        path: "",
      },
    };
  },
  computed: {},
  created() {
    this.getList();
  },
  watch: {
    dialogFormVisible(newVal) {
      if (!newVal) {
        // 清空表单数据，恢复初始数据
        Object.assign(this.$data.form, this.$options.data().form);
      }
    },
  },
  methods: {
    async getList() {
      this.roleList = [];
      let params = {
        /**
         * 空值显示所有
         */
        keyword: this.search.keyword,
        limit: this.limit,
        page: this.currentPage,
      };
      const res = await getPermissionList(params);
      console.log(res);
      console.table(res.data.list);
      if (res.code === 1) {
        if (res.data.list.length > 0) {
          this.roleList = res.data.list;
          this.total = res.data.count;
        }
      }
    },
    //分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getList();
    },
    // 重置搜索栏
    doReset() {
      this.search.keyword = "";
      this.currentPage = 1;
      this.limit = 10;
      this.getList();
    },
    // 搜索按钮
    doSearch() {
      if (this.search.keyword.length > 0) {
        // 2s节流
        if (!this.search.timer) {
          this.search.timer = setTimeout(() => {
            clearTimeout(this.search.timer);
            this.search.timer = null;
          }, 2000);
          this.getList();
        }
      } else {
        this.$message({
          message: "请输入搜索关键字",
          type: "warning",
        });
      }
    },
    /**
     * 新增按钮事件，新增事件
     */
    async addRoleHandler() {
      this.dialogFormVisible = true;
    },
    /**
     * 新增表单 - 取消事件
     */
    addRoleFormCancel() {
      // 关闭表单
      this.dialogFormVisible = false;
    },
    /**
     * 新增表单 - 确定事件
     */
    async addRoleFormOk() {
      const { name, desc } = this.form;
      if (name.length < 1 && desc.length < 1) {
        this.$message({
          message: "内容不能为空",
          type: "warning",
        });
        return;
      }
      // 是编辑进来的
      if (this.isEdit) {
        // 查看改的名字是否有重复
        if (
          this.roleList
            .filter((item) => item.id !== this.editId)
            .some((item) => item.name === name)
        ) {
          this.$message({
            message: "已有相同名称",
            type: "warning",
          });
          return;
        }
        const res = await editPermission({ ...this.form, id: this.editId });
        if (res.code === 1) {
          this.$message({
            message: "修改成功",
            type: "success",
          });
        }
      } else {
        // 验证是否有相同名称
        if (this.roleList.some((item) => item.name === name)) {
          this.$message({
            message: "已有相同名称",
            type: "warning",
          });
          return;
        }
        const res = await addPermission(this.form);
        if (res.code === 1) {
          this.$message({
            message: "添加成功",
            type: "success",
          });
        }
      }
      // 关闭表单
      this.dialogFormVisible = false;
      // 更新页面
      this.getList();
    },
    /**
     * 编辑事件
     */
    editRoleHandler(role) {
      console.log(role);
      this.isEdit = true;
      this.editId = role.id;
      this.form.name = role.name;
      this.form.path = role.path;
      this.dialogFormVisible = true;
    },
    /**
     * 删除事件
     */
    deleteRoleHandler(id) {
      console.log(id);
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          const res = await deletePermission(id);
          if (res.code === 1) {
            console.log(res);
            // 更新页面
            this.getList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style scoped lang="scss">
.btn-box {
  margin: 0px 30px;
}
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
    margin: 10px 30px;
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
