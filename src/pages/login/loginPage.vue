<template>
  <div>
    <top-frame :title="'登录'" :showModel="false" style="height: 30px" />
    <div class="contentBox">
      <div class="infoBox">
        <div class="logoBox">
          <el-image class="logo" style="width: 100px" :src="gptLogo" />
        </div>
        <el-text
          style="
            font-size: 50px;
            font-weight: 600;
            position: fixed;
            top: 40%;
            left: 12%;
          "
        >柴特GPT</el-text>
        <el-text
          style="
            font-size: 15px;
            font-weight: 600;
            position: fixed;
            top: 50%;
            left: 35%;
          "
        >By ZtionJam</el-text>
        <el-text
          style="font-size: 15px; position: fixed; top: 55%; left: 5%"
        >基于Open AI GPT模型的人工智能自然语言处理工具</el-text>
      </div>
      <div class="loginBox">
        <div
          class="loginPanel"
          v-loading="loading"
          element-loading-text="请稍等..."
          element-loading-background="rgba(255, 255, 255, 0.8)"
        >
          <el-text class="optTitle">{{ isSignIn ? "注册" : "登录" }}</el-text>
          <el-link class="tagle" type="primary" @click="tagle">
            {{
            isSignIn ? "已有账号 ? 前往登录>>" : "没有账号 ? 前往注册>>"
            }}
          </el-link>
          <div style="height:30px" v-show="!isSignIn"></div>
          <el-input class="authInput" v-model="form.username" placeholder="账号 / 用户名" />
          <el-input v-show="isSignIn" class="authInput" v-model="form.email" placeholder="邮箱" />
          <el-input class="authInput" type="password" v-model="form.password" placeholder="密码" />
          <el-input
            v-show="isSignIn"
            class="authInput codeInput"
            v-model="form.code"
            placeholder="验证码"
          />
          <el-button
            id="sendCodeBtn"
            v-show="isSignIn"
            class="sendCodeBtn"
            type="success"
            color="#10a37f"
            @click="sendCodeClick"
          >发送</el-button>
          <br />
          <el-button
            id="submit"
            type="success"
            color="#10a37f"
            @click="submit"
          >{{ isSignIn ? "注册" : "登录" }}</el-button>
          <div
            style="
              margin-top:50px;
              text-align: center;
              font-size: 12px;
            "
          >仅学习使用，一切解释权归作者所有</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import topFrame from "@/components/topFrame.vue";
import gptLogo from "@/assets/img/chatgpt_logo.png";
import { login} from "@/api";
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
const router = useRouter();
let form = ref({ username: "", password: "", email: "", code: "" });
let isSignIn = ref(false);
let loading = ref(false);
let isGetCode = ref(false);
const tagle = () => {
  loading.value = true;
  setTimeout(() => {
    form = ref({});
    loading.value = false;
    isSignIn.value = !isSignIn.value;
  }, 500);
};
//发送验证码
const sendCodeClick = () => {
  ElMessage({ message: "暂未开放注册", type: "error" });
};
//注册
const registerClick = () => {
  ElMessage({ message: "暂未开放注册", type: "error" });
};
//提交
const submit = () => {
  //去注册
  if (isSignIn.value) {
    registerClick();
    return;
  }
  loading.value = true;
  //登录
  login(
    form.value,
    ok => {
      ElMessage({ message: "登录成功~", type: "success" });
      localStorage.setItem("token", ok.data.token);
      router.push("/mainPage");
    },
    () => {
      loading.value = false;
    }
  );
};
</script>

<style scoped>
#app .loginBox .el-loading-mask {
  border-radius: 10px;
}
.loginPanel {
  box-shadow: 0 0px 10px rgba(16, 163, 127, 0.3);
  width: 280px;
  height: 400px;
  position: fixed;
  top: 15%;
  border-radius: 10px;
  border: 1px solid #ccc;
  transition: all 0.5s;
  padding-top: 20px;
}
.loginPanel:hover {
  box-shadow: 0 0px 10px rgba(16, 163, 127, 0.8);
}
.logoBox {
  position: fixed;
  top: 20%;
  left: 20%;
}
.infoBox {
  width: 60%;
  height: 550px;
}
.loginBox {
  width: 40%;
  height: 550px;
  /* background-color: pink; */
}
.contentBox {
  display: flex;
  user-select: none;
}
.optTitle {
  font-size: 25px;
  color: #10a37f;
  display: block;
  text-align: center;
}
.tagle {
  display: block;
  text-align: center;
  margin-top: 10px;
}
.authInput {
  width: 80%;
  margin-top: 10px;
  margin-left: 10%;
}
.codeInput {
  width: 50%;
}
.sendCodeBtn {
  margin-top: 10px;
  margin-left: 15px;
}
#submit {
  display: block;
  margin: 0px auto;
  margin-top: 20px;
}
</style>