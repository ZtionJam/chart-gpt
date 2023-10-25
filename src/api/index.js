import fetch from 'electron-fetch'
import nf from 'node-fetch'
import { ElMessage } from "element-plus";
import router from "@/router/index.js"
// const url = 'http://gpt.ztion.cn/api';
const basePath = 'http://127.0.0.1:8208';

const headers = {
    'Content-Type': 'application/json'
}

// 发送流式消息
const sendMsgStream = async (data, call) => {
    headers.Authorization = localStorage.getItem('token')
    await nf(basePath + '/app/chat/talk', {
        method: 'post',
        body: JSON.stringify(data),
        cache: "no-cache",
        keepalive: true,
        headers: {
            "Content-Type": "application/json",
            "Accept": "text/event-stream",
            ...headers
        }
    }).then(async response => {
        const reader = response.body.getReader()
        for (; ;) {
            const { value, done } = await reader.read();
            let text = new TextDecoder('utf-8').decode(value);
            let arr = text.split("[ChartEnd]");
            for (let index = 0; index < arr.length; index++) {
                const slice = arr[index];
                call(slice)
            }
            if (done) break;
        }
    })
}
// 登录
const login = async (data, ok, fail) => {
    POST('/auth/login', data, ok, fail);
}
// 模型列表
const modelList = async (ok, fail) => {
    GET('/app/chat/modelList', {}, ok, fail);
}
// 模型列表
const modelChat = async (data, ok, fail) => {
    GET('/app/chat/modelChat?modelId=' + data, {}, ok, fail);
}
// 消息列表
const msgList = async (data, ok, fail) => {
    GET('/app/chat/msgList?chatId=' + data, {}, ok, fail);
}
// 消息列表清理
const msgClear = async (data, ok, fail) => {
    GET('/app/chat/msgClear?chatId=' + data, {}, ok, fail);
}
// 消息详情
const getMsg= async (data, ok, fail) => {
    GET('/app/chat/msg/' + data, {}, ok, fail);
}
const GET = (url, data, ok, fail) => {
    headers.Authorization = localStorage.getItem('token')
    request(basePath + url, {
        method: 'get',
        headers: headers
    }, ok, fail);
}
const POST = (url, data, ok, fail) => {
    headers.Authorization = localStorage.getItem('token')
    request(basePath + url, {
        method: 'post',
        body: JSON.stringify(data),
        headers: headers
    }, ok, fail);
}
//代理请求
const request = (fullPath, data, ok, fail) => {
    fetch(fullPath, data).then(res => {
        if (res.status == 200) {
            res.json().then(json => {
                console.log(json)
                if (json.code == 200) {
                    ok(json)
                } else if (json.code == 403) {
                    ElMessage({ message: json.msg, type: "warning" });
                    router.push({ path: '/login' })
                } else {
                    ElMessage({ message: json.msg, type: "error" });
                    fail(json);
                }
            })
        } else {
            ElMessage({ message: '请求失败，请稍后重试', type: "error" });
            fail();
        }
    })
}


export { getMsg,msgClear, modelList, modelChat, msgList, login, sendMsgStream };