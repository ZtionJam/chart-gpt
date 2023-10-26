<template>
  <div :class="['cardBox', msg.role == 'assistant' ? 'AICard' : '']">
    <div class="avatarBox">
      <el-avatar
        class="avatar"
        :src="msg.role == 'assistant' ? (aiAvatar||gptLogo) : ''"
        :icon="msg.role == 'user' ? UserFilled : ''"
      />
    </div>
    <div class="textBox">
      <v-md-preview :text="msg.content"></v-md-preview>
    </div>
  </div>
</template>

<script setup>
import { UserFilled } from "@element-plus/icons-vue";
import { defineProps } from "vue";
import gptLogo from "@/assets/img/chatgpt_logo.png";
defineProps({
  msg: Object,
  aiAvatar: String
});
</script>

<style>
.textBox {
  width: 650px;
}
.avatarBox {
  width: 80px;
}
.avatar {
  margin-left: 20px;
  margin-top: 10px;
}
.cardBox {
  width: 100%;
  background-color: white;
  display: flex;
  padding-bottom: 30px;
  border-bottom: 1px solid #ccc;
}
.AICard {
  background-color: #f7f7f8;
}
</style>