<template>
  <div>
    <top-frame />
    <h1>Test212222222222</h1>
    <button @click="goLogin()">Log</button>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import topFrame from "@/components/topFrame.vue";
export default {
  name: "mainPage",
  components: { topFrame },
  methods: {},
  setup() {
    const router = useRouter();
    const goLogin = () => {
      console.log("1212");
      router.push("/login");
    };
    return {
      goLogin
    };
  }
};
</script>

<style>
</style>