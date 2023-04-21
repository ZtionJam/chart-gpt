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
    <el-button @click="send" color="#10A37F" class="send" :icon="Promotion" circle />
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
const router = useRouter();
const toBottom = () => {
  nextTick(() => {
    let container = document.getElementById("msgBox");
    container.scrollTop = container.scrollHeight;
  });
};
let title = "首页";
let question = ref("");
let sending = ref(false);

let msgs = ref([
  {
    content: "介绍一下Vue",
    role: "user"
  },
  {
    content: "好东西",
    role: "assistant"
  },
  {
    content: "好的感谢",
    role: "user"
  }
]);
onMounted(() => {
  let user = localStorage.getItem("token");
  if (user == null) {
    router.push("/login");
  } else {
    messages().then(res => {
      if (200 == res.status) {
        res.json().then(json => {
          if (0 == json.code) {
            msgs.value = json.data;
            toBottom();
          } else {
            ElMessage({
              message: json.msg,
              type: "error"
            });
          }
        });
      } else {
        exception(res);
      }
    });
  }
});
const send = () => {
  if(sending.value){
    ElMessage({
      message: "思考中....",
      type: "warning"
    });
    return
  }
  if (question.value.length < 1) {
    ElMessage({
      message: "说点什么吧~",
      type: "warning"
    });
    return;
  }
  sending.value=true;
  let msg = {
    content: question.value,
    role: "user"
  };
  question.value = "";
  msgs.value.push(msg);
  toBottom();
  sendMsg(msg).then(res => {
    if (200 == res.status) {
      res.json().then(json => {
        sending.value=false;
        console.log(json);
        if (0 == json.code) {
          msgs.value.push(...json.data);
          toBottom();
        } else {
          ElMessage({
            message: json.msg,
            type: "error"
          });
        }
      });
    } else {
      exception(res);
    }
  });
};
</script>

<style>
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
#app div div .el-loading-mask{
  border-radius: 10px;
  opacity: 0.8;
}
</style>