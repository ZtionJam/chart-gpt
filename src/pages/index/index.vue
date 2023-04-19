<template>
  <div>
    <top-frame :title="title" style="height: 30px" />
    
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import topFrame from "@/components/topFrame.vue";
export default {
  name: "mainPage",
  components: { topFrame },
  data() {
    return {
      title: "首页",
    };
  },
  methods: {},
  setup() {
    const router = useRouter();
    const goLogin = () => {
      router.push("/login");
    };
    return {
      goLogin,
    };
  },
};
</script>

<style>

</style>