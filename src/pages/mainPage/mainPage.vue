<template>
  <div>
    <top-frame
      :title="title"
      :show-model="true"
      :models="models"
      style="height: 30px"
      @choooseModel="choooseModel"
      :now-model="nowModel"
    />
    <div class="msgBox" id="msgBox">
      <div class="defaultMsg" v-if="msgs.length == 0">
        <el-image
          style="width: 200px; height: 200px;border-radius:40px;"
          :src="nowModel.avatar||gptLogo"
        />
        <br />
        <div style="text-align: center">{{ nowModel.name }}</div>
        <div style="text-align: center; font-size: 14px; font-weight: 399">速速咱们的开始对话吧~</div>
      </div>
      <messageCard v-for="(data) in msgs" :key="data.id" :msg="data" :aiAvatar="nowModel.avatar" />
    </div>
    <div class="uploadBox" v-if="nowModel.vision">
      <el-upload
        title="点击上传图片"
        action="#"
        :file-list="fileList"
        list-type="picture-card"
        :limit="1"
        :auto-upload="true"
        accept="image/*"
        :http-request="uploadImg"
      >
        <el-icon>
          <Plus />
        </el-icon>
        <template #file="{ file }">
          <div>
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                <el-icon>
                  <Delete />
                </el-icon>
              </span>
            </span>
          </div>
        </template>
      </el-upload>
    </div>
    <el-button
      @click="clearVisible = true"
      color="#10A37F"
      title="清除记录"
      class="clearBtn"
      type="success"
      :icon="DeleteFilled"
      circle
    />
    <el-input
      @keyup.enter="quickSend"
      v-model="question"
      :autosize="{ minRows: 2, maxRows: 4 }"
      type="textarea"
      placeholder="输入你的问题，Shift+Enter快捷发送"
      class="input"
      id="msgInput"
      v-loading="sending"
      element-loading-text="思考中..."
      element-loading-background="rgba(255, 255, 255, 0.8)"
    />
    <el-button @click="sendStream" color="#10A37F" class="send" :icon="Promotion" circle />
    <el-dialog
      class="newVersionDialog"
      v-model="dialogData.centerDialogVisible"
      :title="dialogData.dialogTitle"
      width="30%"
      align-center
      :modal="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="!dialogData.isForced"
    >
      <span>
        <span v-show="dialogData.isShowContent">{{ dialogData.introduce }}</span>
        <el-progress
          :text-inside="true"
          :stroke-width="24"
          :percentage="progress.percent"
          status="success"
          v-show="dialogData.isShowProgress"
        />
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button v-if="!dialogData.isForced" @click="dialogData.centerDialogVisible = false">取消</el-button>
          <el-button v-if="dialogData.isForced" @click="close">退出</el-button>
          <el-button
            v-show="!dialogData.isInstall"
            color="#10a37f"
            type="primary"
            @click="update"
          >立即更新</el-button>
          <el-button
            v-show="dialogData.isInstall"
            color="#10a37f"
            type="primary"
            @click="installNow"
            :disabled="!dialogData.canInstall"
          >立即安装</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      v-model="clearVisible"
      title="清除消息记录"
      width="30%"
      align-center
      :modal="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="clearDialog"
    >
      <span>确定清除记录吗？AI会根据消息记录回复你的问题，清除消息记录有助于提高AI的响应速度，当AI回复不全时，清除即可解决。</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="clearVisible = false">取消</el-button>
          <el-button type="primary" @click="clearNow">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import topFrame from "@/components/topFrame.vue";
import messageCard from "@/components/messageCard.vue";
// import clearIcon from "@/assets/img/clear.png";
import { ref, nextTick, onMounted } from "vue";
import gptLogo from "@/assets/img/chatgpt_logo.png";
import {
  Promotion,
  DeleteFilled,
  Delete,
  Download,
  Plus,
  ZoomIn
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import {
  modelList,
  msgList,
  sendMsgStream,
  modelChat,
  msgClear,
  something,
  upload
} from "@/api";
import { ipcRenderer, clipboard, nativeImage } from "electron";
import fetch from "electron-fetch";
const fs = require("fs");
const os = require("os");
const path = require("path");

const router = useRouter();
const toBottom = () => {
  nextTick(() => {
    let container = document.getElementById("msgBox");
    container.scrollTop = container.scrollHeight;
  });
};
//模型列表
let models = ref([]);
let chat = {};
//标题
let title = "柴特GPT";
//问题
let question = ref("");
//发送中
let sending = ref(false);
//更新框
let dialogData = ref({
  dialogTitle: "发现新版本",
  isShowContent: true,
  centerDialogVisible: false,
  isForced: true,
  introduce: "发现新版本了",
  isInstall: false,
  isShowProgress: false,
  canInstall: false
});
let msgs = ref([]);
//选择模型
let nowModel = ref({
  name: "请选择模型"
});
const choooseModel = model => {
  nowModel.value = model;
  localStorage.setItem("lastModel", nowModel.value.id);
  loadMsg();
  handleRemove();
};
onMounted(() => {
  //检查更新
  ipcRenderer.send("check-update");
  //检查登录状态
  let user = localStorage.getItem("token");

  if (user == null) {
    router.push("/login");
  } else {
    //加载模型列表
    modelList(
      ok => {
        models.value.push(...ok.data);
        if (models.value.length > 0) {
          nowModel.value = models.value[0];
        }
        //选中上次使用的模型
        let lastModel = localStorage.getItem("lastModel");
        if (lastModel) {
          let last = models.value.filter(m => {
            return m.id == lastModel;
          });
          if (last.length > 0) {
            nowModel.value = last[0];
          }
        }
        loadMsg();
      },
      () => {
        ElMessage({
          message: "加载模型列表，请稍后重试",
          type: "error"
        });
      }
    );
  }
});

//文件操作
let fileList = ref([]);
let imgMessage = {};
const handleRemove = file => {
  fileList.value = [];
  imgMessage = {};
};
const uploadImg = file => {
  upFile(file.file);
};
const upFile = file => {
  sending.value = true;
  ElMessage({
    message: "图片上传中....",
    type: "warning"
  });
  upload(
    file,
    url => {
      imgMessage = {
        type: "image_url",
        imgUrl: url
      };
      ElMessage({ message: "图片上传成功~", type: "success" });
      sending.value = false;
      const fileObject = {
        name: file.name,
        size: file.size,
        type: file.type,
        uid: file.lastModified + Date.now(),
        status: "ready",
        raw: file,
        url: url
      };
      fileList.value = [fileObject];
      document.getElementById("msgInput").focus();
    },
    () => {
      sending.value = false;
      ElMessage({
        message: "图片上传失败，请稍后重试",
        type: "error"
      });
      fileList.value = [];
    }
  );
};
//Ctrl+V操作
document.addEventListener("keydown", event => {
  if (
    nowModel.value.vision &&
    (event.metaKey || event.ctrlKey) &&
    event.key === "v"
  ) {
    event.preventDefault(); // 阻止默认的粘贴行为
    const availableFormats = clipboard.availableFormats();
    if (availableFormats.includes("image/png")) {
      const image = clipboard.readImage().toPNG();
      const file = new File([image], "uploadTemp.png", {
        type: "image/png"
      });
      upFile(file);
    } else if (availableFormats.includes("text/uri-list")) {
      const filePaths = clipboard.read("text/uri-list");
    }
  }
});
function isImagePath(filePath) {
  return /\.(jpg|jpeg|png|gif|bmp|svg)$/i.test(filePath);
}
//获取消息列表
const loadMsg = () => {
  //获取会话
  modelChat(
    nowModel.value.id,
    ok => {
      chat = ok.data;
      //加载消息记录
      msgList(
        ok.data.id,
        ok => {
          msgs.value = ok.data;
          toBottom();
        },
        fail => {
          ElMessage({
            message: "加载会话失败，请切换模型重试",
            type: "error"
          });
        }
      );
    },
    () => {
      ElMessage({
        message: "加载会话失败，请切换模型重试",
        type: "error"
      });
    }
  );
};

const quickSend = e => {
  if (e.shiftKey === true && e.key === "Enter") {
    sendStream();
  }
};
//流式消息
const sendStream = () => {
  if (!setSending()) {
    return;
  }
  let msg = {
    contents: [
      {
        type: "text",
        text: question.value
      }
    ],
    role: "user",
    chatId: chat.id
  };
  if (imgMessage.type) {
    msg.contents.push(imgMessage);
    fileList.value = [];
  }
  question.value = "";
  msgs.value.push(msg);
  toBottom();
  let content = ref("");
  let card = {
    role: "assistant",
    content: content
  };
  msgs.value.push(card);
  something(ok => {
    sendMsgStream(msg, data => {
      if (data.trim().indexOf("data:[DONE]") == 0) {
        sending.value = false;
        return;
      }
      data = parseSSEData(data);
      card.content.value += data;
      toBottom();
    });
  });
};
//转换SSE消息
function parseSSEData(line) {
  let data = "";
  let arr = line.split("data:");
  if (arr.length > 1) {
    data += arr[1];
  }
  return data;
}
const setSending = () => {
  if (sending.value) {
    ElMessage({
      message: "思考中....",
      type: "warning"
    });
    return false;
  }
  if (question.value.trim().length < 1) {
    ElMessage({
      message: "说点什么吧~",
      type: "warning"
    });
    return false;
  }
  sending.value = true;
  return true;
};

let clearVisible = ref(false);
//清除
const clearNow = () => {
  msgs.value = [];
  fileList.value = [];
  msgClear(
    chat.id,
    ok => {
      loadMsg();
      ElMessage({ message: "清理成功~", type: "success" });
      sending.value = false;
    },
    fail => {}
  );
  clearVisible.value = false;
};
let updateInfo = ref({});
//退出
const close = () => {
  ipcRenderer.send("closeApp");
};
//更新消息监听
ipcRenderer.on("update-available", (e, info) => {
  updateInfo.value = info;
  dialogData.value.isForced = info.forced;
  dialogData.value.introduce = info.introduce;
  dialogData.value.centerDialogVisible = true;
  ElMessage({
    message: "发现新版本",
    type: "warning"
  });
});
//来自主线程的通知，方便调试
ipcRenderer.on("console", (e, info) => {
  console.log(info);
});
//立即更新事件
const update = () => {
  ipcRenderer.send("updateNow");
  dialogData.value = {
    dialogTitle: "正在下载",
    isShowContent: false,
    centerDialogVisible: true,
    isForced: true,
    introduce: "",
    isInstall: true,
    isShowProgress: true,
    canInstall: false
  };
};
//下载进度
let progress = ref({
  bytesPerSecond: 0,
  delta: 0,
  percent: 1,
  total: 0,
  transferred: 0
});
ipcRenderer.on("download-progress", (e, progressNow) => {
  progress.value.percent = Math.round(progressNow.percent);
});
//下载完成
ipcRenderer.on("update-downloaded", () => {
  progress.value.percent = 100;
  dialogData.value.dialogTitle = "下载完成";
  dialogData.value.canInstall = true;
  ElMessage({
    message: "更新下载完成~",
    type: "success"
  });
});
//立即安装事件
const installNow = () => {
  ipcRenderer.send("installNow");
};
</script>

<style>
.uploadBox .el-upload--picture-card {
  width: 80px;
  height: 80px;
}
.uploadBox .el-upload {
  width: 80px;
  height: 80px;
  line-height: 80px;
}
.uploadBox .el-upload-list--picture-card .el-upload-list__item {
  width: 80px;
  height: 80px;
  line-height: 80px;
}
.uploadBox .el-upload-list--picture-card .el-upload-list__item-thumbnail {
  width: 80px;
  height: 80px;
  line-height: 80px;
  object-fit: cover;
}

.uploadBox {
  opacity: 0.8;
  width: 160px;
  height: 80px;
  position: fixed;
  bottom: 90px;
  right: 0px;
  overflow: hidden;
  /* border: 1px solid #ccc; */
}
.clearBtn {
  width: 40px;
  height: 40px;
  position: fixed;
  bottom: 35px;
  left: 20px;
}

.newVersionDialog {
  border-radius: 10px;
  width: 350px;
  box-shadow: 0 0px 10px rgba(11, 11, 11, 0.3);
}

::-webkit-scrollbar {
  width: 0px;
  background-color: #f5f5f5;
}

.msgBox {
  height: 554px;
  margin: 0px auto;
  padding-top: 5px;
  overflow: auto;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.send {
  width: 40px;
  height: 40px;
  position: fixed;
  bottom: 35px;
  right: 20px;
}

.input {
  width: 80%;
  position: fixed;
  bottom: 30px;
  left: 80px;
  box-shadow: 0 0px 10px rgba(11, 11, 11, 0.3);
  border-radius: 10px;
  z-index: 999;
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

.clearDialog {
  width: 400px;
  box-shadow: 0 0px 10px rgba(11, 11, 11, 0.3);
  user-select: none;
}

.defaultMsg {
  width: 200px;
  font-size: 20px;
  font-weight: 700;
  position: relative;
  left: 50%;
  top: 100px;
  transform: translate(-50%);
  opacity: 0.4;
}
img {
  -webkit-user-drag: none;
}
</style>