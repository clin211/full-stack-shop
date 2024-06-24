import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { useCartStore } from './cart';

export const useUserStore = defineStore('user', () => {
  const cartStore = useCartStore();
  const name = ref('');
  const avatar = ref('');
  const sex = ref(1);
  const sign = ref('');
  const setInfo = info => {
    name.value = info.name;
    avatar.value = info.avatar;
    sex.value = info.sex;
    sign.value = info.sign;
    cartStore.changeCart();
  };
  const reset = () => {1
    name.value = '';
    avatar.value = '';
    sex.value = 1;
    sign.value = '';
  };

  return { name, avatar, sex, sign, setInfo, reset };
});
