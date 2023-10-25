<template>
  <div id="frame" :class="isMac ? 'reverse' : ''">
    <!-- 操作栏 -->
    <div id="opBar"></div>
    <!-- 标题 -->
    <div id="title">
      <div class="titleStr">{{ title || "Rainder" }}</div>
      <div id="model" v-if="showModel">
        <el-dropdown size="small">
          <el-button class="modelBtn" type="primary">
            {{ nowModel.name }}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu class="modelMenu">
              <el-dropdown-item
                class="modelList"
                v-for="(item,key) in models"
                :key="key"
                :title="item.detail"
                @click="choooseModel(item)"
              >{{ item.name }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <!-- 三大金刚键 -->
    <div id="sbcBar">
      <div :class="isMac ? 'reverse f-left' : 'f-right'">
        <div title="退出登录">
          <img src="@/assets/icon/exit.png" @click="exit" />
        </div>
        <div title="最小化">
          <img src="@/assets/icon/mini.png" @click="op('minApp')" />
        </div>
        <div title="关闭">
          <img src="@/assets/icon/close.png" @click="op('closeApp')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted, defineEmits } from "vue";
import { useRouter } from "vue-router";
import { ipcRenderer } from "electron";
import { ElMessage } from "element-plus";
import { ArrowDown } from "@element-plus/icons-vue";
const router = useRouter();
const emit = defineEmits(["choooseModel"]);
const props = defineProps({
  title: String,
  showModel: Boolean,
  models: Array,
  nowModel: Object
});
let isMac = ref(true);
//获取系统类型 控制金刚键位置
onMounted(async () => {
  await ipcRenderer.send("process", "process");
  ipcRenderer.on("process", (e, process) => {
    isMac.value = process == "darwin";
  });
});
function choooseModel(item) {
  emit("choooseModel", item);
}
function op(msg) {
  ipcRenderer.send(msg, msg);
}
function exit() {
  ElMessage({
    message: "退出登陆成功",
    type: "success"
  });
  localStorage.removeItem("token");
  router.push("/login");
}
</script>

<style>
/* .modelMenu{
  width: 200px;
} */
/* .modelList{
  height: 50px;
}  */
.modelBtn {
  width: 110px;
  height: 20px;
  font-size: 10px;
  overflow: hidden;
}
.titleStr {
  float: left;
  -webkit-app-region: drag;
}
#model {
  float: left;
  margin-left: 5px;
  margin-top: 5px;
}
#opBar {
  height: 30px;
  width: 33%;
}
#sbcBar {
  height: 30px;
  width: 33%;
}
#sbcBar > div {
  display: flex;
}
#sbcBar > div > div {
  width: 30px;
  height: 30px;
}
#sbcBar > div > div:hover {
  background-color: #20c89f;
  cursor: pointer;
}
#sbcBar > div > div > img {
  display: block;
  margin: 0px auto;
  margin-top: 6px;
  width: 18px;
  border-radius: 10px;
}
#title {
  height: 30px;
  width: 33%;
  text-align: center;
  line-height: 30px;
  font-size: 14px;
  display: flex;
  justify-content: center;
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
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  overflow: hidden;
}
.reverse {
  flex-direction: row-reverse;
}
.f-left {
  float: left;
}
.f-right {
  float: right;
}
img {
  -webkit-user-drag: none;
}
</style>