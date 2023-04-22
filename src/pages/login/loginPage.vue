<template>
  <div>
    <top-frame :title="'登录'" style="height: 30px" />
    <div class="contentBox">
      <div class="infoBox">
        <div class="logoBox">
          <el-image class="logo" style="width: 100px" :src="gptLogo" />
        </div>
        <el-text
          style="
            font-size: 50px;
            font-weight: 600;
            position: fixed;
            top: 40%;
            left: 12%;
          "
          >柴特GPT</el-text
        >
        <el-text
          style="
            font-size: 15px;
            font-weight: 600;
            position: fixed;
            top: 50%;
            left: 35%;
          "
          >By ZtionJam</el-text
        >
        <el-text style="font-size: 15px; position: fixed; top: 55%; left: 5%"
          >基于Open AI GPT模型的人工智能自然语言处理工具</el-text
        >
        <!-- <el-text style="font-size: 12px; position: fixed; top: 60%; left: 17%"
          >The App Author: <el-text tag="b">ZtionJam</el-text></el-text
        > -->
      </div>
      <div class="loginBox">
        <div
          class="loginPanel"
          v-loading="loading"
          element-loading-text="请稍等..."
          element-loading-background="rgba(255, 255, 255, 0.8)"
        >
          <el-text
            style="
              font-size: 25px;
              position: fixed;
              top: 20%;
              left: 74%;
              color: #10a37f;
            "
            >{{ isSignIn ? "注册" : "登录" }}</el-text
          >
          <el-input
            class="authInput"
            v-model="form.username"
            placeholder="账号 / 用户名"
          />
          <el-input
            class="authInput"
            v-model="form.password"
            placeholder="密码"
          />
          <el-button
            id="submit"
            type="success"
            color="#10a37f"
            @click="submit"
            >{{ isSignIn ? "注册" : "登录" }}</el-button
          >
          <el-link type="primary" @click="tagle">{{
            isSignIn ? "已有账号 ? 前往登录>>" : "没有账号 ? 前往注册>>"
          }}</el-link>
          <div
            style="
              position: relative;
              text-align: center;
              font-size: 12px;
              top: 55%;
            "
          >
            仅学习使用，请勿用于商业用途
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import topFrame from "@/components/topFrame.vue";
import gptLogo from "@/assets/img/chatgpt_logo.png";
import { login } from "@/api";
import { ref,onMounted } from "vue"; 
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
const router = useRouter();
let form = ref({ username: "", password: "" });
let isSignIn = ref(false);
let loading = ref(false);
const tagle = () => {
  loading.value=true;
  setTimeout(() => {
    form=ref({})
    loading.value=false;
    isSignIn.value = !isSignIn.value;
  }, 500);
};
const submit = () => {
  loading.value=true
  login(form.value).then((res) => {
    res.json().then((json) => {
      if (0 == json.code) {
        ElMessage({
          message: "登录成功~",
          type: "success",
        });
        localStorage.setItem('token',json.data.access_token)
        router.push('/mainPage');
      }else{
        ElMessage({
          message:json.msg,
          type: "error",
        });
      }
      loading.value=false
    });
  });
};
onMounted(()=>{
  ElMessage({
      message: "请先登录~",
      type: "warning",
    });
})
</script>

<style>
#app .loginBox .el-loading-mask{
  border-radius: 10px;
}
#submit {
  position: relative;
  top: 40%;
  left: 50%;
  transform: translateX(-50%);
}
.authInput {
  width: 80%;
  position: relative;
  left: 10%;
  top: 30%;
  margin-top: 10px;
}
.loginPanel {
  box-shadow: 0 0px 10px rgba(16, 163, 127, 0.3);
  width: 280px;
  height: 400px;
  position: fixed;
  top: 15%;
  border-radius: 10px;
  border: 1px solid #ccc;
  transition: all 0.5s;
}
.loginPanel:hover {
  box-shadow: 0 0px 10px rgba(16, 163, 127, 0.8);
}
.logoBox {
  position: fixed;
  top: 20%;
  left: 20%;
}
.infoBox {
  width: 60%;
  height: 550px;
}
.loginBox {
  width: 40%;
  height: 550px;
  /* background-color: pink; */
}
.contentBox {
  display: flex;
  user-select: none;
}
</style>