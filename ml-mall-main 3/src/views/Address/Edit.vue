<script setup>
import { ref } from 'vue';
import { areaList } from '@vant/area-data';
import { useRoute, useRouter } from 'vue-router';
import { deleteAddress, addAddress, updateAddress } from '@/api/address';
import { showSuccessToast } from 'vant';

const isEdit = ref(false);

const route = useRoute();
const router = useRouter();

const addressList = ref({
  id: 0,
  name: '',
  tel: '',
  province: '',
  city: '',
  county: '',
  addressDetail: '',
  isDefault: false,
});
if (route.query.addressInfo) {
  isEdit.value = true;
  const addressData = JSON.parse(
    decodeURI(atob(route.query.addressInfo || '') || '') || '[]'
  );
  console.log(addressData);
  addressList.value = {
    id: addressData.id,
    name: addressData.name,
    tel: addressData.phone,
    province: addressData.province,
    city: addressData.city,
    county: addressData.town,
    addressDetail: addressData.detail,
    isDefault: !!addressData.is_default,
  };
}

console.table(addressList.value);

const onSave = async info => {
  console.table(info);
  if (!isEdit.value) {
    const res = await addAddress({
      is_default: info.isDefault ? '1' : '0',
      name: info.name,
      phone: info.tel,
      province: info.province,
      city: info.city,
      town: info.county,
      street: null,
      detail: info.addressDetail,
    });
    console.log(res);
    if (res.code === 1) {
      showSuccessToast({
        message: '添加成功',
        duration: 1500,
      });
    }
  } else {
    const res = await updateAddress({
      id: info.id,
      is_default: info.isDefault ? '1' : '0',
      name: info.name,
      phone: info.tel,
      province: info.province,
      city: info.city,
      town: info.county,
      street: null,
      detail: info.addressDetail,
    });
    console.log(res);
    if (res.code === 1) {
      showSuccessToast({
        message: '添加成功',
        duration: 1500,
      });
    }
  }
  router.replace({path:'/address-list',query:{orderInfo:route.query.orderInfo}});
};

const onDelete = async info => {
  if (!isEdit.value) return;
  console.log(info.id);
  const res = await deleteAddress(info.id);
  console.log(res);
  if (res.code === 1) {
    showSuccessToast({
      message: '删除成功',
      duration: 1500,
    });
    router.replace({path:'/address-list',query:{orderInfo:route.query.orderInfo}});
  }
};
</script>

<template>
  <div class="container">
    <van-nav-bar
      :title="$route.query.addressInfo ? '编辑地址' : '新增地址'"
      placeholder
      fixed
      left-arrow
      @click-left="$router.replace({path:'/address-list',query:{orderInfo:route.query.orderInfo}})"
    />
    <van-address-edit
      :address-info="addressList"
      :area-list="areaList"
      :show-delete="!!$route.query.addressInfo"
      show-set-default
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="onSave"
      @delete="onDelete"
    />
  </div>
</template>

<style lang="scss" scoped></style>
