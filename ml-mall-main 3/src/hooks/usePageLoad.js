import { ref } from 'vue';

export const usePageLoad = (apiCallback, queryParams) => {
  queryParams;
  const data = ref([]);
  const count = ref(0);
  const loading = ref(false);
  const finished = ref(false);
  const onLoad = async () => {
    try {
      const res = await apiCallback(queryParams);
      if (res.code === 1) {
        count.value = res.data.count;
        loading.value = false;
        if (res.data.list) {
          data.value.push(...(res.data.list || []));
        }
      }
    } catch (error) {
      console.error(error);
    }
    if (queryParams.page++ > parseInt(count.value / queryParams.limit) + 1) {
      finished.value = true;
      return;
    }
  };
  console.log('use page load:', data);
  return { data, onLoad, loading, finished, count };
};
