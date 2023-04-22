<template>
  <div>
    <top-frame :title="title" style="height: 30px" />
    <div class="msgBox" id="msgBox">
      <messageCard v-for="(data, key) in msgs" :key="key" :msg="data" />
    </div>

    <el-input
      v-model="question"
      :autosize="{ minRows: 2, maxRows: 4 }"
      type="textarea"
      placeholder="输入你的问题，Shift+Enter快捷发送"
      class="input"
      v-loading="sending"
      element-loading-text="思考中..."
      element-loading-background="rgba(255, 255, 255, 0.8)"
    />
    <el-button
      @click="send"
      color="#10A37F"
      class="send"
      :icon="Promotion"
      circle
    />
    <el-dialog
    class="newVersionDialog"
      v-model="centerDialogVisible"
      title="发现新版本"
      width="30%"
      align-center
      :modal="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="!isForced"
    >
      <span>{{ introduce }}</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button v-if="!isForced" @click="centerDialogVisible = false">取消</el-button>
          <el-button color="#10a37f" type="primary" @click="update">
          立即更新
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import topFrame from "@/components/topFrame.vue";
import messageCard from "@/components/messageCard.vue";
import { ref, nextTick, onMounted } from "vue";
import { Promotion } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { messages, exception, sendMsg } from "@/api";
import { ipcRenderer } from "electron";
const router = useRouter();
const toBottom = () => {
  nextTick(() => {
    let container = document.getElementById("msgBox");
    container.scrollTop = container.scrollHeight;
  });
};
//标题
let title = "柴特GPT";
//问题
let question = ref("");
//发送中
let sending = ref(false);
//更新框
let centerDialogVisible=ref(false)
let isForced=ref(true)
let msgs = ref([]);
onMounted(() => {
  //检查更新
  ipcRenderer.send("check-update");
  //检查登录状态
  let user = localStorage.getItem("token");
  if (user == null) {
    router.push("/login");
  } else {
    //加载历史消息
    messages().then((res) => {
      if (200 == res.status) {
        res.json().then((json) => {
          if (0 == json.code) {
            msgs.value = json.data;
            toBottom();
          } else {
            ElMessage({
              message: json.msg,
              type: "error",
            });
            if(401==json.code){
            router.push("/login");
          }
          }
        });
      } else {
        exception(res);
      }
    });
  }
});
//发送消息
const send = () => {
  if (sending.value) {
    ElMessage({
      message: "思考中....",
      type: "warning",
    });
    return;
  }
  if (question.value.length < 1) {
    ElMessage({
      message: "说点什么吧~",
      type: "warning",
    });
    return;
  }
  sending.value = true;
  let msg = {
    content: question.value,
    role: "user",
  };
  question.value = "";
  msgs.value.push(msg);
  toBottom();
  sendMsg(msg).then((res) => {
    if (200 == res.status) {
      res.json().then((json) => {
        sending.value = false;
        console.log(json);
        if (0 == json.code) {
          msgs.value.push(...json.data);
          toBottom();
        } else {
          ElMessage({
            message: json.msg,
            type: "error",
          });
          if(401==json.code){
            router.push("/login");
          }
        }
      });
    } else {
      exception(res);
    }
  });
};
let updateInfo=ref({})
let introduce=ref('发现新版本了！')
//更新消息监听
ipcRenderer.on("update-available", (e, info) => {
  updateInfo.value=info
  isForced=info.forced
  introduce=info.introduce
  centerDialogVisible.value=true
  ElMessage({
    message: "发现新版本",
    type: "warning",
  });
});
ipcRenderer.on("console", (e, info) => {
  console.log(info)
});
//更新事件
const update=()=>{
  
}
</script>

<style>
.newVersionDialog{
  border-radius: 10px;
  width: 350px;
  box-shadow: 0 0px 10px rgba(11, 11, 11, 0.3);
}
::-webkit-scrollbar {
  width: 0px;
  background-color: #f5f5f5;
}
.msgBox {
  height: 520px;
  margin: 0px auto;
  padding-top: 5px;
  overflow: auto;
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
  box-shadow: 0 0px 10px rgba(11, 11, 11, 0.3);
  border-radius: 10px;
}
textarea {
  overflow: hidden;
  resize: none !important;
  border-radius: 10px;
}
.input textarea {
  border-radius: 10px;
}
#app div div .el-loading-mask {
  border-radius: 10px;
  opacity: 0.8;
}
</style>