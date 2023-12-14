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
      <v-md-preview v-if="msg.role == 'user'" :text="content"></v-md-preview>
      <v-md-preview v-if="msg.role != 'user'" :text="msg.content"></v-md-preview>
      <div class="imgBox" v-if="imgs.length>0">
        <el-image
          class="msgImg"
          :key="key"
          v-for="(data,key) in imgs"
          :src="data"
          :zoom-rate="1.2"
          :max-scale="7"
          :min-scale="0.2"
          :initial-index="4"
          fit="cover"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { UserFilled } from "@element-plus/icons-vue";
import { defineProps, ref } from "vue";
import gptLogo from "@/assets/img/chatgpt_logo.png";
let prop = defineProps({
  msg: Object,
  aiAvatar: String
});

let content = "";
let imgs = ref([]);
if (prop.msg.role == "user") {
  content = prop.msg.contents.filter(c => c.type == "text")[0].text;
  let c = prop.msg.contents.filter(c => c.type == "image_url");
  if (c.length > 0) {
    imgs.value.push(c[0].imgUrl);
  }
}
</script>

<style>
.msgImg {
  width: 100px;
  height: 100px;
  transition: all 300ms;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(23, 82, 30, 0.25);
}
.msgImg:hover {
  width: 200px;
  height: 200px;
  margin-top: -50px;
  margin-left: -50px;
  box-shadow: 0 2px 8px rgba(23, 82, 30, 0.8);
}
.imgBox {
  widows: 80%;
  height: 100px;
  /* border: 1px solid #ccc; */
  margin-top: -40px;
  margin-left: 40px;
}
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