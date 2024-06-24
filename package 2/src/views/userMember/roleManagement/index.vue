<template>
  <div class="order-main">
    <el-form label-width="80px" :inline="false" class="search" size="normal">
      <el-row :gutter="10">
        <el-col class="searchItem" :span="6" :offset="0">
          <el-form-item label="角色名称" size="mini">
            <el-input
              v-model="search.keyword"
              class="search-input"
              size="mini"
              placeholder="请输入角色关键字"
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
        :title="isEdit ? '编辑角色' : '新增角色'"
        :visible.sync="dialogFormVisible"
      >
        <el-form :model="form" :rules="rules">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model.trim="form.name"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="desc">
            <el-input v-model.trim="form.desc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addRoleFormCancel()">取 消</el-button>
          <el-button type="primary" @click="addRoleFormOk()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 分配权限 -->
      <el-dialog
        title="分配权限"
        :visible.sync="dialogRolePermission"
        class="dialog-role"
        center
      >
        <el-tree
          :data="assign.options"
          show-checkbox
          node-key="id"
          ref="tree"
          highlight-current
        >
        </el-tree>
        <div class="role-footer">
          <el-button @click="assignPermissionsCancel()">取 消</el-button>
          <el-button type="primary" @click="assignPermissionsConfirm()"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div>
    <!-- 订单列表 -->
    <el-card class="card" shadow="never">
      <el-table :data="roleList" border style="width: 100%">
        <el-table-column align="center" type="index" label="#" fixed="left" />
        <el-table-column align="center" label="id" prop="id" width="100" />
        <el-table-column align="center" label="名称" prop="name" />
        <el-table-column align="center" label="描述" prop="desc" />
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
            <!-- 编辑角色按钮 -->
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="editRoleHandler(scope.row)"
              circle
            />
            <!-- 分配权限按钮 -->
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-key"
              @click="assignPermissions(scope.row)"
              circle
            />
            <!-- 删除角色按钮 -->
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
  getRoleList,
  addRole,
  deleteRole,
  editRole,
  editRolePermission,
  getPermissionList,
  deleteRolePermission,
} from "@/api/api.js";

export default {
  name: "roleList",
  data() {
    return {
      roleList: [], // 角色列表
      currentPage: 1, //当前页
      limit: 10, //每页条数
      page: 1, //页数
      total: null, //总条数
      dialogFormVisible: false, // 控制新增角色弹出框
      isEdit: false, // 是否是编辑
      editId: "", // 当前编辑角色id
      dialogRolePermission: false, // 分配权限界面
      search: {
        keyword: "",
        timer: null, // 节流
      },
      /**
       * 表单验证
       */
      rules: {
        name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
        desc: [{ required: true, message: "请输入角色描述", trigger: "blur" }],
      },
      /**
       * 新增角色form
       */
      form: {
        name: "",
        desc: "",
      },
      assign: {
        value: [],
        loading: false,
        options: [],
        id: null,
        timer: null,
      },
      resKeys: [],
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
    dialogRolePermission(newVal) {
      if (!newVal) {
        // 清空表单数据，恢复初始数据
        this.assign.value = [];
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
      const res = await getRoleList(params);
      // console.log(res);
      // console.table(res.data.list);
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
        // 节流
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
     * 新增按钮事件，新增角色事件
     */
    async addRoleHandler() {
      this.dialogFormVisible = true;
    },
    /**
     * 新增角色表单 - 取消事件
     */
    addRoleFormCancel() {
      // 关闭表单
      this.dialogFormVisible = false;
    },
    /**
     * 新增角色表单 - 确定事件
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
            message: "已有相同角色名称",
            type: "warning",
          });
          return;
        }
        const res = await editRole({ ...this.form, id: this.editId });
        if (res.code === 1) {
          this.$message({
            message: "修改成功",
            type: "success",
          });
        }
      } else {
        // 验证是否有相同角色名
        if (this.roleList.some((item) => item.name === name)) {
          this.$message({
            message: "已有相同角色名称",
            type: "warning",
          });
          return;
        }
        const res = await addRole(this.form);
        if (res.code === 1) {
          this.$message({
            message: "添加角色成功",
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
     * 编辑角色事件
     */
    editRoleHandler(role) {
      console.log(role);
      this.isEdit = true;
      this.editId = role.id;
      this.form.name = role.name;
      this.form.desc = role.desc;
      this.dialogFormVisible = true;
    },
    /**
     * 删除角色事件
     */
    deleteRoleHandler(id) {
      console.log(id);
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          const res = await deleteRole(id);
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
     * 分配权限按钮
     */
    async assignPermissions(row) {
      console.log(row);
      this.dialogRolePermission = true;
      this.assign.id = row.id;
      const res = await getPermissionList({
        limit: 100,
        page: 1,
        keyword: "",
      });
      if (res.code === 1) {
        this.assign.options = res.data.list
          ?.map?.((item, i, arr) => {
            if (item.path.split("/").length === 2) {
              console.log(item.path);
              return {
                id: item.id,
                label: item.name,
                path: item.path,
                children: arr
                  .map((it) =>
                    it.path.split("/").length > 2 && it.path.includes(item.path)
                      ? {
                          id: it.id,
                          label: it.name,
                          path: it.path,
                        }
                      : false
                  )
                  .filter((it) => it)
                  .reverse(),
              };
            }
          })
          .filter((it) => it)
          .reverse();
        console.log("---------------");
        console.table(this.assign.options);
      }
      console.log(res);
      this.resKeys = res.data.list.map((item) => item.id);
      console.log(row.permissions);
      const keys = row.permissions
        ?.map?.((item) =>
          item.path.split("/").length === 2 &&
          row.permissions.some(it=>it.path.includes(item.path.concat("/")))
            ? false
            : item.id
        )
        .filter((it) => it);
      console.log(keys);
      console.log()
      this.$refs.tree.setCheckedKeys(keys || [], true);
    },
    /**
     * 关闭分配权限对话框
     */
    assignPermissionsCancel() {
      this.dialogRolePermission = false;
    },
    /**
     * 分配权限对话框确认
     */
    async assignPermissionsConfirm() {
      const select = this.$refs.tree
        .getCheckedNodes(false, true)
        .map((it) => it.id);
      console.log(select);
      const deleteRes = await deleteRolePermission({
        role_id: this.assign.id,
        permission_ids: this.resKeys,
      });
      console.log(deleteRes);
      const addRes = await editRolePermission({
        role_id: this.assign.id,
        permission_ids: select,
      });
      console.log({
        role_id: this.assign.id,
        permission_ids: select,
      });
      console.log(addRes);
      this.dialogRolePermission = false;
      this.$message({
        message: "分配成功",
        type: "success",
      });
      this.getList();
    },
    /**
     * 搜索框
     */
    async searchPermission(keyword) {
      console.log(keyword);
      clearTimeout(this.assign.timer);
      // 输入停止触发 500ms
      this.assign.timer = setTimeout(async () => {
        clearTimeout(this.assign.timer);
        if (keyword.trim().length > 0) {
          this.assign.loading = true;
          const res = await getPermissionList({ limit: 10, page: 1, keyword });
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
      0.0;
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
