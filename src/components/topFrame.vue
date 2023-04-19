<template>
  <div id="frame" :class="isMac ? 'reverse' : ''">
    <!-- 操作栏 -->
    <div id="opBar"></div>
    <!-- 标题 -->
    <div id="title">{{ title || "Rainder" }}</div>
    <!-- 三大金刚键 -->
    <div id="sbcBar" :class="isMac ? 'reverse' : ''">
      <div title="最小化">
        <img src="@/assets/icon/mini.png" @click="op('minApp')" />
      </div>
      <div title="关闭">
        <img src="@/assets/icon/close.png" @click="op('closeApp')" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted } from "vue";
import { ipcRenderer } from "electron";
defineProps({
  title: String,
});
let isMac = ref(true);
onMounted(async () => {
  console.log("通知主进程");
  await ipcRenderer.send("process", "process");
  ipcRenderer.on("process", (e, process) => {
    console.log("系统:" + process);
    isMac.value = process == "darwin";
  });
});

function op(msg) {
  console.log(msg);
  ipcRenderer.send(msg, msg);
}
</script>

<style>
#opBar {
  height: 30px;
  width: 100px;
}
#sbcBar {
  height: 30px;
  width: 65px;
  display: flex;
}
#sbcBar > div {
  width: 30px;
  height: 30px;
}
#sbcBar > div:hover {
  background-color: #20c89f;
  cursor: pointer;
}
#sbcBar > div > img {
  display: block;
  margin: 0px auto;
  margin-top: 6px;
  width: 18px;
  border-radius: 10px;
}
#title {
  height: 30px;
  width: 400px;
  -webkit-app-region: drag;
  text-align: center;
  line-height: 30px;
  font-size: 14px;
}
#frame {
  width: 98vw;
  height: 30px;
  background-color: #10a37f;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  user-select: none;
  display: flex;
  justify-content: space-between;
}
#frame > div {
  border-radius: 10px;
}
.reverse {
  flex-direction: row-reverse;
}
</style>