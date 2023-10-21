import fetch from 'electron-fetch'
import nf from 'node-fetch'
import { ElMessage } from "element-plus";
// const url = 'http://gpt.ztion.cn/api';
const url = 'http://127.0.0.1:8081';

const headers = {
    'Content-Type': 'application/json'
}
// 登录
const login = async (data) => {
    return fetch(url + '/app/user/login', {
        method: 'post',
        body: JSON.stringify(data),
        headers: headers
    })
}
// 注册
const register = async (data) => {
    return fetch(url + '/app/user/register', {
        method: 'post',
        body: JSON.stringify(data),
        headers: headers
    })
}
// 发送验证码
const sendCode = async (data) => {
    return fetch(url + '/app/user/sendCodeMail', {
        method: 'post',
        body: JSON.stringify(data),
        headers: headers
    })
}
// 消息记忆
const messages = async (data) => {
    headers.Authorization = localStorage.getItem('token')
    return fetch(url + '/app/ai/messages', {
        method: 'get',
        headers: headers
    })
}
// 发送消息
const sendMsg = async (data) => {
    headers.Authorization = localStorage.getItem('token')
    return fetch(url + '/app/ai/send', {
        method: 'post',
        body: JSON.stringify(data),
        headers: headers
    })
}
// 发送流式消息
const sendMsgStream = async (data,call) => {
    headers.Authorization = localStorage.getItem('token')
    await nf(url + '/app/ai/sendStream', {
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
            let text=new TextDecoder('utf-8').decode(value);
            // text=text.replace("\"","").replace("\"","").replace("“","").replace("”","");
            call(text)
            if (done) break;
        }
    })
}
// 清除消息
const clear = async (data) => {
    headers.Authorization = localStorage.getItem('token')
    return fetch(url + '/app/ai/clear', {
        method: 'delete',
        headers: headers
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

export { exception, login, messages, sendMsg, clear, register, sendCode, sendMsgStream };