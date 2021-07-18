<template>
  <div class="login">
    <img src="@/assets/img/logo.png" alt="" srcset="" />
    <el-input
      placeholder="用户名(5-10个数字和英文组成)"
      v-model="username"
      clearable
      style="margin: 10px 0"
    >
    </el-input>
    <el-input
      placeholder="请输入密码(5-10个数字和英文组成)"
      v-model="password"
      style="margin: 5px 0"
    ></el-input>
    <el-button
      type="primary"
      style="margin: 5px 0; width: 100%"
      @click="loginEvent"
      >登录</el-button
    >
    <br />
    <el-button style="margin: 10px 0; width: 100%" @click="registerEvent"
      >注册</el-button
    >
    <br />
    <el-button type="info" round style="width: 100%" @click="youkeLogin"
      >游客登录</el-button
    >
  </div>
</template>
<script>
import axiosInstance from "@/network/axiosInstance.js";
export default {
  name: "login",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    loginEvent() {
      if (this.isvalued(this.username) && this.isvalued(this.password))
        axiosInstance
          .post("/login", {
            username: this.username,
            password: this.password,
          })
          .then(
            (res) => {
              if (res.status === 200) {
                localStorage.setItem("token", res.token);
                this.$router.push("/shouye");
              } else {
                alert(res);
              }
            },
            (err) => {
              console.log(err);
            }
          );
      else alert("用户名或密码不规范");
    },
    isvalued(val) {
      var reg1 = new RegExp("[\\u4E00-\\u9FFF]+", "g");
      var reg2 = /([0-9]|[a-zA-Z]){5,10}/g;
      if (reg1.test(val) || !reg2.test(val)) return false;
      return true;
    },
    registerEvent() {
      if (this.isvalued(this.username) && this.isvalued(this.password))
        axiosInstance
          .post("/register", {
            username: this.username,
            password: this.password,
          })
          .then(
            (res) => {
              if (res === "注册成功") {
                localStorage.setItem("isLogin", true);
                this.$router.push("/shouye");
              } else alert(res);
            },
            (err) => {
              console.log(err);
            }
          );
      else alert("用户名或密码不规范");
    },
    youkeLogin() {
      localStorage.setItem("token", "youke");
      this.$router.push("/shouye");
    },
  },
};
</script>
<style scoped>
.login {
  position: relative;
  text-align: center;
  padding: 20vw 5vw;
}
img {
  width: 25vw;
}
</style>