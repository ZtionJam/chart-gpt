<template>
  <div>
    <top-frame :title="'登录'" style="height: 30px" />
    <div class="contentBox">
      <div class="infoBox">
       <div class="logoBox"> <el-image class="logo" style="width: 100px;" :src="gptLogo" :fit="fit" /></div>
       <el-text  style="font-size: 50px;font-weight: 600;position: fixed;top: 40%;left: 12%;">ChatGPT</el-text>  
       <el-text  style="font-size: 15px;font-weight: 600;position: fixed;top: 48%;left: 35%;">API版</el-text>
       <el-text  style="font-size: 15px;position: fixed;top: 52%;left: 5%;">OpenAI推出的人工智能自然语言处理工具，使用GPT-3.5架构。</el-text>
       <el-text  style="font-size: 12px;position: fixed;top: 60%;left: 17%;">The App Author: <el-text tag="b">ZtionJam</el-text></el-text>
    </div>
      <div class="loginBox">
        <div class="loginPanel">
            <el-text  style="font-size: 25px;position: fixed;top: 20%;left: 74%;color: #10a37f;">{{ isSignIn?'注册':'登录' }}</el-text> 
            <el-input class="authInput" v-model="input" placeholder="账号 / 用户名" />
            <el-input class="authInput" v-model="input" placeholder="密码" />
            <el-button id="submit" type="success" color="#10a37f" @click="submit">{{ isSignIn?'注册':'登录' }}</el-button>
            <el-link type="primary" @click="tagle">{{ isSignIn?'已有账号 ? 前往登录>>':'没有账号 ? 前往注册>>' }}</el-link>
            <div style="position:relative;text-align: center;font-size: 12px;top: 55%;">仅学习使用，请勿用于商业用途</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import topFrame from "@/components/topFrame.vue";
import gptLogo from "@/assets/img/chatgpt_logo.png";
import { ref } from "vue";
let isSignIn = ref(false);
const tagle = () => {
  isSignIn.value = !isSignIn.value;

};
const submit = () => {

};
</script>

<style>
#submit{
    position: relative;
    top: 40%;
    left: 50%;
    transform: translateX(-50%);
}
.authInput{
    width: 80%;
    position: relative;
    left: 10%;
    top: 30%;
    margin-top: 10px;
}
.loginPanel{
    box-shadow: 0 0px 10px rgba(11, 11, 11, 0.3);
    width: 280px;
    height: 400px ;
    position: fixed;
    top: 15%;
    border-radius: 10px;
    border: 1px solid #ccc;
    transition: all 0.5s;
}
.loginPanel:hover{
    box-shadow: 0 0px 10px rgba(11, 11, 11, 0.5);
}
.logoBox{
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
.contentBox{
    display: flex;
}
</style>