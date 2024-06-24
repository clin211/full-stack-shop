<script setup>
import { login, register } from '@/api/auth';
import { setToken } from '@/utils/auth';
import getAvatar from '@/utils/avatar';
import { ref, reactive, watch, toRef } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { showSuccessToast } from 'vant';
import { setData, getData, resetLogin } from '@/utils/userCache.js';

const avatarUrl = getAvatar();

const getUserInfo = () => ({
  // avatar: avatarUrl,
  avatar:'https://img1.baidu.com/it/u=3269593700,2695107730&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
  username: '',
  password: '',
  sex: 1,
  sign: '',
  secretAnswer: '',
});

function foo(a, b) {
  console.log(a, b);
}
const arr = [1, 2];

foo(...arr);

const userInfo = reactive(getUserInfo());
let isHas = false;
watch(toRef(userInfo, 'username'), val => {
  const avatar = getData(val).avatar;
  if (isHas) {
    userInfo.avatar = avatarUrl;
    isHas = false;
  } else if (avatar) {
    userInfo.avatar = avatar;
    isHas = true;
  }
});

const isRegistered = ref(false);
const router = useRouter();
const userStore = useUserStore();

const onSubmit = async formData => {
  console.table(formData);
  if (isRegistered.value) {
    const res = await register(formData);
    if (res.code === 1) {
      showSuccessToast({
        message: '注册成功',
        duration: 1500,
      });
      Object.assign(userInfo, getUserInfo());
      userInfo.username = formData.name;
      userInfo.avatar = formData.avatar;
      isRegistered.value = false;
      console.log(userInfo);
    }
    console.log(res);
  } else {
    const res = await login(formData);
    console.log(res);
    if (res.code === 1) {
      showSuccessToast({
        message: '登录成功',
        duration: 1500,
      });
      userStore.setInfo({
        name: formData.name,
        avatar: res.data.avatar,
        sign: res.data.sign,
        sex: res.data.sex,
      });
      setToken(res.data.token, res.data.expires_in);
      resetLogin();
      setData(formData.name, {
        avatar: res.data.avatar,
        pwd: formData.password,
        sign: res.data.sign,
        sex: res.data.sex,
        lastLogin: true,
      });
      router.replace('/home');
    }
  }
};
</script>

<template>
  <main>
    <van-nav-bar
      :title="isRegistered ? '注册' : $route.meta.title"
      left-arrow
      @click-left="$router.replace('/home')"
      fixed
    />
    <div class="container">
      <!-- 头像 -->
      <div class="user_img">
        <img :src="userInfo.avatar" />
      </div>
      <!-- 表单 -->
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model.lazy.trim="userInfo.username"
            name="name"
            label="用户名"
            placeholder="用户名"
            :rules="[
              { required: true, message: '请填写用户名' },
              {
                pattern: /^[-_a-zA-Z0-9]{4,16}$/,
                message: '只能包含4-16位字母数字下划线减号',
              },
            ]"
          />
          <van-field
            v-model.lazy.trim="userInfo.password"
            type="password"
            name="password"
            autocomplete
            label="密码"
            placeholder="密码"
            :rules="[
              { required: true, message: '请填写密码' },
              {
                pattern: /^[-_a-zA-Z0-9]{6,16}$/,
                message: '只能包含6-16位字母数字下划线减号',
              },
            ]"
          />
          <van-field
            v-if="isRegistered"
            v-model.lazy.trim="userInfo.avatar"
            type="url"
            name="avatar"
            label="头像"
            placeholder="图片地址"
            :rules="[
              { required: true, message: '请填写图片地址' },
              {
                pattern:
                  /^(http|ftp|https):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/,
                message: '请输入有效的网址',
              },
            ]"
          />
          <van-field v-if="isRegistered" name="sex" label="性别">
            <template #input>
              <van-radio-group v-model="userInfo.sex" direction="horizontal">
                <van-radio :name="1">男</van-radio>
                <van-radio :name="0">女</van-radio>
              </van-radio-group>
            </template>
          </van-field>
          <van-field
            v-if="isRegistered"
            v-model.lazy.trim="userInfo.sign"
            type="text"
            name="sign"
            label="签名"
            placeholder="个性签名"
            :rules="[{ required: true, message: '请填写个性签名' }]"
          />
          <van-field
            v-if="isRegistered"
            v-model.lazy.trim="userInfo.secretAnswer"
            type="text"
            name="secret_answer"
            label="密保"
            placeholder="验证密保"
            :rules="[{ required: true, message: '请填写密保' }]"
          />
        </van-cell-group>
        <div style="margin: 16px">
          <van-button
            round
            block
            :type="isRegistered ? 'primary' : 'success'"
            native-type="submit"
          >
            {{ isRegistered ? '注册' : '登录' }}
          </van-button>
          <van-button
            v-if="!isRegistered"
            class="registerBtn"
            round
            block
            type="primary"
            @click="isRegistered = true"
          >
            注册
          </van-button>
          <van-button
            v-if="isRegistered"
            class="registerBtn"
            round
            block
            plain
            type="primary"
            @click="isRegistered = false"
          >
            返回登录
          </van-button>
        </div>
      </van-form>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.container {
  margin-top: 40px;
  .user_img {
    height: 100px;
    padding-top: 58px;
    margin-bottom: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 88px;
      height: 88px;
      border-radius: 50%;
      object-fit: cover;
    }
  }
  .registerBtn {
    margin-top: 12px;
  }
}
</style>
