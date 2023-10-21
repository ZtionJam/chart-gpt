import fetch from 'electron-fetch'
import nf from 'node-fetch'
import { ElMessage } from "element-plus";
// const url = 'http://gpt.ztion.cn/api';
const basePath = 'http://127.0.0.1:8208';

const headers = {
    'Content-Type': 'application/json'
}
// 注册
const register = async (data) => {
    return fetch(basePath + '/app/user/register', {
        method: 'post',
        body: JSON.stringify(data),
        headers: headers
    })
}
// 发送验证码
const sendCode = async (data) => {
    return fetch(basePath + '/app/user/sendCodeMail', {
        method: 'post',
        body: JSON.stringify(data),
        headers: headers
    })
}
// 消息记忆
const messages = async (data) => {
    headers.Authorization = localStorage.getItem('token')
    return fetch(basePath + '/app/ai/messages', {
        method: 'get',
        headers: headers
    })
}
// 发送消息
const sendMsg = async (data) => {
    headers.Authorization = localStorage.getItem('token')
    return fetch(basePath + '/app/ai/send', {
        method: 'post',
        body: JSON.stringify(data),
        headers: headers
    })
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
            call(text)
            if (done) break;
        }
    })
}
// 清除消息
const clear = async (data) => {
    headers.Authorization = localStorage.getItem('token')
    return fetch(basePath + '/app/ai/clear', {
        method: 'delete',
        headers: headers
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

const request = (fullPath, data, ok, fail) => {
    fetch(fullPath, data).then(res => {
        if (res.status == 200) {
            res.json().then(json => {
                if (json.code == 200) {
                    ok(json)
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
// 统一异常处理 状态
const exception = (res) => {
    res.json().then(json => {
        switch (res.status) {
            case 401:
                ElMessage({
                    message: json.msg,
                    type: "error",
                });
                break
            case 404:
                ElMessage({
                    message: '数据未找到',
                    type: "error",
                });
                break
            case 500:
                ElMessage({
                    message: json.msg,
                    type: "error",
                });
                break
        }
    })

}

export { modelList, modelChat, msgList,exception, login, messages, sendMsg, clear, register, sendCode, sendMsgStream };