<template>
  <div class="order-main">
    <el-form label-width="80px" :inline="false" class="search" size="normal">
      <el-row :gutter="10">
        <el-col class="searchItem" :span="6" :offset="0">
          <el-form-item label="用户名" size="mini">
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
        :title="isEdit ? '编辑用户' : '新增用户'"
        :visible.sync="dialogFormVisible"
      >
        <el-form :model="form" :rules="rules">
          <el-form-item label="用户名" prop="name">
            <el-input v-model.trim="form.name"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model.trim="form.password"></el-input>
          </el-form-item>
          <!-- <el-form-item label="分配角色">
            <el-input v-model.trim="form.role_id"></el-input>
          </el-form-item> -->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addRoleFormCancel()">取 消</el-button>
          <el-button type="primary" @click="addRoleFormOk()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 分配角色 -->
      <el-dialog
        title="分配角色"
        :visible.sync="dialogRoleForm"
        class="dialog-role"
        center
      >
        <el-select
          class="select-role"
          v-model="assign.value"
          remote
          multiple
          filterable
          :remote-method="searchRole"
          :loading="assign.loading"
          placeholder="请选择角色标签"
          default-first-option
        >
          <el-option
            v-for="item in assign.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <div class="role-footer">
          <el-button @click="addRoleCancel()">取 消</el-button>
          <el-button type="primary" @click="addRoleConfirm()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 订单列表 -->
    <el-card class="card" shadow="never">
      <el-table :data="roleList" border style="width: 100%">
        <el-table-column align="center" type="index" label="#" fixed="left" />
        <el-table-column align="center" label="id" prop="id" width="100" />
        <el-table-column align="center" label="用户名" prop="name" />
        <el-table-column align="center" label="角色">
          <template slot-scope="scope">
            <el-tag
              v-for="item in scope.row.role_names"
              :key="item"
              type="warning"
              effect="dark"
            >
              {{ item }}
            </el-tag>
          </template>
        </el-table-column>
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
              @click="editUserHandler(scope.row)"
              circle
            />
            <!--分配角色按钮 -->
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-key"
              @click="assignRoles(scope.row.id, scope.row.role_names)"
              circle
            />
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteUserHandler(scope.row.id)"
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
  getAdminList,
  addAdmin,
  deleteAdmin,
  editAdmin,
  getRoleList,
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
      dialogRoleForm: false, // 控制分配权限框
      isEdit: false, // 是否是编辑
      editId: "", // 当前编辑id
      /**
       * 搜索
       */
      search: {
        keyword: "",
        timer: null, // 节流
      },
      /**
       * 表单验证
       */
      rules: {
        name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      /**
       * 新增form
       */
      form: {
        name: "",
        password: "",
        is_admin: "1",
        // role_id: 37,
      },
      /**
       * 分配角色数据
       */
      assign: {
        options: [],
        value: [],
        loading: false,
        timer: null, // 节流
        id: null,
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
    dialogRoleForm(newVal) {
      if (!newVal) {
        // 清空表单数据，恢复初始数据
        this.assign.value = [];
      }
    },
  },
  methods: {
    async getList() {
      this.roleList = [];
      const params = {
        /**
         * 空值显示所有
         */
        keyword: this.search.keyword,
        limit: this.limit,
        page: this.currentPage,
      };
      const res = await getAdminList(params);
      // console.log(res);
      console.table(res.data.list);
      if (res.code === 1) {
        // 查找role id name ，
        const roleList = await getRoleList({ page: 1, limit: 50 });
        const roleNameList = roleList.data.list.map((item) => ({
          name: item.name,
          id: item.id,
        }));
        // console.log(roleList.data.list.find((i) => i.id === 39).name);
        // console.log(roleNameList);
        const userInfoList = res.data.list;
        userInfoList.forEach((item) => {
          console.log("--------", item);
          item.role_names =
            item.is_admin === "1"
              ? ["超级管理员"]
              : item.role_id_array
                  .map(
                    (id) => roleList.data.list.find((it) => it.id == id)?.name
                  )
                  .filter((item) => item);
          console.log(item.role_names);
        });
        console.table(userInfoList);
        if (res.data.list.length > 0) {
          this.roleList = res.data.list;
          this.total = res.data.count;
        }
      }
    },
    // 分页
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
            message: "已有相同用户名",
            type: "warning",
          });
          return;
        }
        const res = await editAdmin({ ...this.form, id: this.editId });
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
            message: "已有相同用户名",
            type: "warning",
          });
          return;
        }
        const res = await addAdmin(this.form);
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
    editUserHandler(role) {
      console.log(role);
      this.isEdit = true;
      this.editId = role.id;
      this.form.name = role.name;
      this.dialogFormVisible = true;
    },
    /**
     * 分配权限按钮
     */
    async assignRoles(id, roleNames) {
      this.assign.id = id;

      this.dialogRoleForm = true;
      const res = await getRoleList({ limit: 10, page: 1 });
      console.log(res);
      if (res.code === 1) {
        this.assign.options = res.data.list.map((item) => ({
          value: item.id,
          label: item.name,
        }));
      }
    },
    /**
     * 搜索
     */
    searchRole(keyword) {
      console.log(keyword);
      clearTimeout(this.assign.timer);
      // 输入停止触发 500ms
      this.assign.timer = setTimeout(async () => {
        clearTimeout(this.assign.timer);
        if (keyword.trim().length > 0) {
          this.assign.loading = true;
          const res = await getRoleList({ limit: 10, page: 1, keyword });
          console.log(res);
          if (res.code === 1) {
            this.assign.options = res.data.list?.map((item) => ({
              value: item.id,
              label: item.name,
            }));
          }
          this.assign.loading = false;
        } else {
          this.assign.options = [];
        }
      }, 500);
    },
    /**
     * 删除事件
     */
    deleteUserHandler(id) {
      console.log(id);
      this.$confirm("此操作将永久删除该管理员, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          const res = await deleteAdmin(id);
          console.log(res);
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
    /**
     * 分配角色取消事件
     */
    addRoleCancel() {
      this.dialogRoleForm = false;
    },
    /**
     * 分配角色确定事件
     */
    async addRoleConfirm() {
      this.dialogRoleForm = false;
      const role_ids = this.assign.value.join(",");
      console.log(role_ids);
      const res = await editAdmin({ id: this.assign.id, role_ids });
      console.log(res);
      if (res.code === 1) {
        this.$message({
          message: "分配成功",
          type: "success",
        });
        // 更新页面
        this.getList();
      }
    },
  },
};
</script>

<style scoped lang="scss">
.dialog-role {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .select-role {
    margin-left: 10%;
    width: 80%;
  }
  .role-footer {
    margin-top: 8%;
    display: flex;
    width: 80%;
    justify-content: center;
    margin-left: 10%;
  }
}

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
