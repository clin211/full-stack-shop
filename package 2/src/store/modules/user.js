import { login, logout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import router, { resetRouter } from "@/router";

const state = {
  token: getToken(),
  name: "",
  avatar: "",
  introduction: "",
  roles: [],
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
};

const actions = {
  // user login
  //登录接口
  login({ commit }, userInfo) {
    const { name, password } = userInfo;
    return new Promise((resolve, reject) => {
      //trim是防止用户输入空格，orgid是我写死的一个管理员身份
      login({ name: name.trim(), password: password })
        .then((response) => {
          if (response.code === 1) {
            //拼接token
            response.data.tokens =
              response.data.type + " " + response.data.token;
            localStorage.setItem("info", JSON.stringify(response.data));
          }
          //这里是把token存在了vuex里面
          const { data } = response;
          commit("SET_TOKEN", data.tokens);
          setToken(data.tokens);
          console.log(data);
          console.log(data.tokens);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // get user info
  //获取用户信息 这里到时候可以换成你们的接口 现在数据是我写死的
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      const info = JSON.parse(localStorage.getItem("info"));
      console.log("info", info);
      const { data } = {
        data: {
          roles: info.is_admin
            ? ["*"]
            : info.permissions.map((item) => item.path), // 身份
          introduction: "Administrator",
          avatar:
            "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
          name: "administrator",
          token: info.tokens,
        },
      };
      console.log("data", data);
      if (!data) {
        reject("Verification failed, please Login again.");
      }

      const { roles, name, avatar, introduction, token } = data;
      if (!roles || roles.length <= 0) {
        reject("getInfo: roles must be a non-null array!");
      }

      commit("SET_ROLES", roles);
      commit("SET_NAME", name);
      commit("SET_AVATAR", avatar);
      commit("SET_INTRODUCTION", introduction);
      commit("SET_TOKEN", token);
      resolve(data);
    });
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout({ token: state.token }).then(() => {
        commit("SET_TOKEN", "");
        commit("SET_ROLES", []);
        removeToken();
        resetRouter();
        //退出要清除localStorage里的用户信息
        localStorage.removeItem("info");

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch("tagsView/delAllViews", null, { root: true });

        resolve();
      });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      commit("SET_TOKEN", "");
      commit("SET_ROLES", []);
      removeToken();
      resolve();
    });
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + "-token";

    commit("SET_TOKEN", token);
    setToken(token);

    const { roles } = await dispatch("getInfo");

    resetRouter();

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch("permission/generateRoutes", roles, {
      root: true,
    });
    // dynamically add accessible routes
    router.addRoutes(accessRoutes);

    // reset visited views and cached views
    dispatch("tagsView/delAllViews", null, { root: true });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
