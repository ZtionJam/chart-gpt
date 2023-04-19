<template>
  <div>
    <top-frame :title="title" style="height: 30px" />
    <div class="msgBox">
      <messageCard/>
    </div>

    <el-input
      v-model="textarea"
      :autosize="{ minRows: 2, maxRows: 4 }"
      type="textarea"
      placeholder="输入你的问题，Shift+Enter快捷发送"
      class="input"
    />
    <el-button color="#10A37F" class="send" :icon="Promotion" circle />
  </div>
</template>

<script setup>
import topFrame from "@/components/topFrame.vue";
import messageCard from "@/components/messageCard.vue";
import { ref } from "vue";
import { Promotion } from "@element-plus/icons-vue";
let title = "首页";
let textarea = ref("");
</script>

<style>
.msgBox{
  height: 550px;
  margin:0px auto;
  padding-top: 5px;
  /* border: 1px solid red; */
}
.send {
  width: 40px;
  height: 40px;
  position: fixed;
  bottom: 35px;
  right: 40px;
}
.input {
  width: 80%;
  position: fixed;
  bottom: 30px;
  left: 60px;
}
textarea {
  overflow: hidden;
  resize: none !important;
}
</style>