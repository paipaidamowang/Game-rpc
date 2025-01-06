import { _decorator, Component, Node, EditBox } from 'cc';
import Crypt from 'jsencrypt'
import { PublicKey } from '../common'
const { ccclass, property } = _decorator;

const crypt = new Crypt();

crypt.setKey(PublicKey);

@ccclass('LoginManager')
export class LoginManager extends Component {
    //定义两个EditBox的实例引用
    account: EditBox;  // 账号输入框
    password: EditBox; // 密码输入框

    // 组件加载时自动执行
    onLoad() {
        this.account = this.node.getChildByName("Account").getComponent(EditBox);
        this.password = this.node.getChildByName("Password").getComponent(EditBox);
    }

     // 注册方法
    async register(){
        // 获取输入框中的值,进行简单的加密
        const account = crypt.encrypt(this.account.string);
        const password = crypt.encrypt(this.password.string);

        console.log(account, password);
        // 发送 HTTP POST 请求到服务器
        // 服务器地址：http://localhost:3000/register
        // 请求方法：POST
        // 请求头：Content-Type: application/json
        // 请求体：{ account, password }

        const data = await fetch("http://localhost:3000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                account,
                password
            }),
        }).then(res => res.json());

        console.log(data);
    }

    async login(){
        const account = crypt.encrypt(this.account.string);
        const password = crypt.encrypt(this.password.string);

        console.log(account, password);
        
        const data = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                account,
                password
            }),
        }).then(res => res.json());

        console.log(data);
    }
}


