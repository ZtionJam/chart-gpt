import fetch from 'electron-fetch'
import nf from 'node-fetch'
import { ElMessage } from "element-plus";
import router from "@/router/index.js"
// const basePath = 'http://chart.ztion.cn';
const basePath = 'http://127.0.0.1:8208';
const fileUploadPath = 'https://res.ztion.cn/file';

const headers = {
    'Content-Type': 'application/json'
}
//上传文件
const upload = async (file, ok, fail) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('pass', "123456");
    let body = {
        pass: "123456",
        file: file
    }
    await nf(fileUploadPath, {
        method: 'post',
        body: formData
    }).then(async res => {
        if (res.status == 200) {
            ok(await res.text())
        } else {
            console.log("file upload fail")
            fail()
        }
    }).catch(e=>{
        fail()
    });
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
        let swap = '';
        for (; ;) {
            const { value, done } = await reader.read();
            if (done) break;
            let text = new TextDecoder('utf-8').decode(value);
            //解决在Mac上，读取到的数据不完整问题（读到的数据没有包含在data:[ChartEnd]中间）
            if (text.indexOf('data:') == -1) {
                text = swap + text;
                swap = '';
            }
            if (text.indexOf('[ChartEnd]') == -1) {
                swap = text;
                continue
            }

            let arr = text.split("[ChartEnd]");
            for (let index = 0; index < arr.length; index++) {
                const slice = arr[index];
                call(slice)
            }
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
const getMsg = async (data, ok, fail) => {
    GET('/app/chat/msg/' + data, {}, ok, fail);
}
// 检查
const something = async (ok, fail) => {
    GET('/app/chat/something', {}, ok, fail);
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


export { something, getMsg, msgClear, modelList, modelChat, msgList, login, sendMsgStream, upload };