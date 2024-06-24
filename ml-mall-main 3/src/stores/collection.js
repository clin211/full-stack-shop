import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useCollectionStore = defineStore('collection', () => {
  const active = ref('1');
  const changeActive = status => {
    active.value = status;
  };
  return { active, changeActive };
});
