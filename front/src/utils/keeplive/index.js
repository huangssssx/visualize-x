import { encryptByDES } from "./crypto";
import { encrypt } from "./gmCrypto";
import axios from "axios";
import qs from "qs";
import { setToken } from "./auth";

const http = axios.create({
  timeout: 3000,
  baseURL: "",
  withCredentials: true, // 启用跨域
});

class LoginBet {
  constructor() {}

  login({ username, password, url, secretKey, encryptVer = "old" }) {
    return http({
      url: url,
      method: "post",
      data: qs.stringify({
        accountName: username,
        password:
          encryptVer === "old"
            ? encryptByDES(password, secretKey)
            : encrypt(password, secretKey),
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });
  }

  stop() {
    if (this.betInstance) {
      clearInterval(this.betInstance);
    }
  }

  async step(username, password, url, secretKey, encryptVer) {
    const res = await this.login({
      username,
      password,
      url,
      secretKey,
      encryptVer,
    });

    if(this.listener){
      this.listener(res.data.data.token||"");
    }

    if (res && res.status === 200 && res.data && res.data.code === 200) {
      setToken(res.data.data.token);
    }
  }

  /**
   * 心跳维持登录状态
   * @param {*} username
   * @param {*} password
   * @param {*} url
   * @param {*} secretKey
   * @param {*} intervalTime
   */
  async bet(
    username,
    password,
    url,
    secretKey,
    intervalTime = 3000,
    encryptVer = "old"
  ) {
    if (this.betInstance) {
      stop();
    }
    //首次执行
    await this.step(username, password, url, secretKey, encryptVer);
    this.betInstance = setInterval(() => {
      this.step(username, password, url, secretKey, encryptVer);

    }, intervalTime);
  }
}



export default new LoginBet();
