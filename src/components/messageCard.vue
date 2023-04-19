<template>
  <div class="cardBox">
    <div class="avatarBox">
      <el-avatar class="avatar" :icon="UserFilled" />
    </div>
    <div class="textBox">
      <v-md-preview :text="msg.text"></v-md-preview>
    </div>
    <!-- <el-divider style="display:inline" /> -->
  </div>
</template>

<script setup>
import { UserFilled } from "@element-plus/icons-vue";
import { defineProps } from "vue";
defineProps({
  msg: Object,
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
  /* min-height: 100px; */
  background-color: white;
  display: flex;
  padding-bottom: 40px;
  /* border-bottom: 1px solid #ccc; */
  margin-top: 10px;
}
</style>