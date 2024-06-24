<script setup>
import { ref } from 'vue';
import { resetPwd } from '@/api/auth';
import { showSuccessToast } from 'vant';

const secretAnswer = ref('');
const pwd = ref('');
const editing = ref(false);

const onSubmit = async ({ secret_answer, password }) => {
  editing.value = true;
  try {
    const res = await resetPwd(password, secret_answer);
    console.log(res);
    if (res.code === 1) {
      showSuccessToast({
        message: '修改成功',
        duration: 1500,
      });
    }
  } catch (error) {
    console.error(error);
  }
  editing.value = false;
};
</script>

<template>
  <main class="container">
    <van-nav-bar
      :title="$route.meta.title"
      placeholder
      fixed
      left-arrow
      @click-left="$router.back()"
    />
    <div class="content">
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model.trim="secretAnswer"
            name="secret_answer"
            label="密保"
            placeholder="密保"
            :rules="[{ required: true, message: '请填写密保' }]"
          />
          <van-field
            v-model.trim="pwd"
            type="password"
            name="password"
            label="新密码"
            placeholder="新密码"
            :rules="[
              { required: true, message: '请填写密码' },
              {
                pattern: /^[-_a-zA-Z0-9]{6,16}$/,
                message: '只能包含6-16位字母数字下划线减号',
              },
            ]"
          />
        </van-cell-group>
        <div style="margin: 16px">
          <van-button
            :loading="editing"
            round
            block
            type="primary"
            native-type="submit"
          >
            提交
          </van-button>
        </div>
      </van-form>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.container {
  .content {
    margin-top: 10px;
  }
}
</style>
