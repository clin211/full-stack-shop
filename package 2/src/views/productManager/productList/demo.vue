<template>
 
  
</template>

<script>
export default {
  name: "ProductList",
  components: {},
  data() {
    return {};
  },
  created() {},
  methods: {
    demo() {
        console.log("A");
        setTimeout(() => {
            console.log("C");
        }, 0);
        // Promise-1
        new Promise((resolve) => {
            console.log("B");
            // setTimeout(() => {
            //   resolve();
            // }, 0);
            resolve();
        }).then((value) => {
            console.log("D");
            new Promise((resolve) => {
            console.log("E");
            resolve();
            }).then((value) => {
            console.log("F");
            });
        });
    },
  },
};
// A B D E F  C
</script>


<style scoped lang="scss">
</style>
