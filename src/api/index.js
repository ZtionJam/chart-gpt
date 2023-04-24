import fetch from 'electron-fetch'
import { ElMessage } from "element-plus";
const url = 'http://gpt.ztion.cn/api';
// const url = 'http://127.0.0.1:8081';

const headers = {
    'Content-Type': 'application/json',
}
// 登录
const login = async (data) => {
    return fetch(url + '/app/user/login', {
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
// 消息记忆
const sendMsg = async (data) => {
    headers.Authorization = localStorage.getItem('token')
    return fetch(url + '/app/ai/send', {
        method: 'post',
        body: JSON.stringify(data),
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

export { exception, login, messages, sendMsg };