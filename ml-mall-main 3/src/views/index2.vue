<template>
  <van-tree-select
      style="height: 100%"
      v-model:active-id="activeId"
      v-model:main-active-index="activeIndex"
      :items="items"
      @click-nav="clickCatNav"
      @click-item = "goGoods"
  />
</template>

<script setup>
import {getCurrentInstance, onMounted, ref} from 'vue';
import {getCategory} from "@/api/goods";
import {useRouter} from "vue-router";
const router = useRouter();
const proxy = getCurrentInstance()
const activeId = ref(1);
const activeIndex = ref(0);
let items = ref([])
// const items = [
//   {
//     text: '蔬菜',
//     children: [
//       { text: '菇类', id: 1 },
//       { text: '瓜类', id: 2 },
//       { text: '茄果类', id: 3 },
//     ],
//   }
// ];

function goGoods(item){
  router.push({
    path: '/category',
    query: {
      id: item.id
    },
  })
}

console.log(items.value)

async function clickCatNav(index)  {
  let parentId = items.value[index].id
  let res =  await getCategory(parentId)
  let childItem = []
  res.data.list.forEach(item => {
    childItem.push({text:item.name,id:item.id})
  })
  items.value[index].children = childItem
}
onMounted(async () => {
  let res = await getCategory(1)
  if (res.data.count > 0) {
    let firstChildren = await getCategory(res.data.list[0].id)
    res.data.list.forEach(item => {
      items.value.push({text: item.name, children: [], id: item.id})
    })
    let childItem = []
    firstChildren.data.list.forEach(item => {
      childItem.push({text:item.name,id:item.id})
    })
    items.value[0].children = childItem
  }
});
</script>
