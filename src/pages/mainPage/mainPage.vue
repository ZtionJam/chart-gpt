<template>
  <div>
    <top-frame :title="title" style="height: 30px" />
    <div class="msgBox">
      <messageCard :msg="{text:'介绍一下vue'}" />
      <messageCard :msg="msg" />
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
let text = `<img class="size-medium" src="https://fc1tn.baidu.com/it/u=391681853,3049701464&amp;fm=202&amp;mola=new&amp;crop=v1" width="300" height="185" />
<h2 class="md-end-block md-heading"><span class="md-plain md-expand">Vue</span></h2>
<h3 class="md-end-block md-heading"><span class="md-plain">1. 库和框架</span></h3>
<p class="md-end-block md-p"><span class="md-plain">库，功能比较单一，侧重于某一部分的功能。例如 jQuery，它的优点就在于节点操作；lodash，它的优点就在于数据操作；在一个项目中，可以引入多个库搭配进行开发。</span></p>
<p class="md-end-block md-p"><span class="md-plain">框架，针对我们的应用程序提供了一整套的解决方案，而不是针对某一个单独的功能点。框架与框架之间有一定的排他性，在一个项目中，不建议混合多个框架进行开发。</span></p>

<h3 class="md-end-block md-heading md-focus"><span class="md-plain md-expand">2. 前端框架</span></h3>
<p class="md-end-block md-p"><span class="md-plain">现在前端主流的框架主要分为以下三个：</span></p>

<ol class="ol-list" start="">
 	<li class="md-list-item">
<p class="md-end-block md-p"><span class="md-plain">Angular：诞生于 2009 年，Google；</span></p>
</li>
 	<li class="md-list-item">
<p class="md-end-block md-p"><span class="md-plain">React：诞生于 2013 年，Facebook；</span></p>
</li>
 	<li class="md-list-item">
<p class="md-end-block md-p"><span class="md-plain">Vue：诞生于 2014 年，尤雨溪；</span></p>
</li>
</ol>
<h3 class="md-end-block md-heading"><span class="md-plain">3. Vue2.x</span></h3>
<p class="md-end-block md-p"><span class="md-plain md-expand">Vue3.0 在 2020.09 发布正式版，现阶段我们的学习以 Vue2.x 为主。</span></p>`;
let msg = ref({
  text: text,
  auth:'AI'
});
</script>

<style>
::-webkit-scrollbar {
  width: 0px;
  background-color: #f5f5f5;
}
.msgBox {
  height: 550px;
  margin: 0px auto;
  padding-top: 5px;
  overflow: auto;
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