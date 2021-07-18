<template>
  <div class="shouye">
    <div id="footer-nav">
      <tabBar :tabBarMsg="tabBarMsg"></tabBar>
    </div>
    <keep-alive exclude="item"><router-view></router-view></keep-alive>
  </div>
</template>

<script>
import tabBar from "@/components/common/tabBar";
import axiosInstance from "@/network/axiosInstance.js";
export default {
  name: "shouye",
  components: {
    tabBar,
  },
  data() {
    return {
      tabBarMsg: [
        {
          title: "首页",
          icon: "iconfont iconshouye",
          path: "/home",
        },
        {
          title: "统计",
          icon: "iconfont icontongji",
          path: "/statistics",
        },
        {
          title: "听写",
          icon: "iconfont iconbianji",
          path: "/spelling",
        },
        {
          title: "我的",
          icon: "iconfont iconwode",
          path: "/my",
        },
      ],
    };
  },
  methods: {
    getProcessList() {
      axiosInstance.get("/getProcessList").then((res) => {
        let keys = Object.keys(res);
        let map = {};
        sessionStorage.setItem("nichen", res.nichen);
        keys.shift();
        keys.forEach((el) => {
          map[el] = {};
          map[el].processIndex = res[el];
        });
        sessionStorage.setItem("processMap", JSON.stringify(map));
      });
    },
  },
  created() {
    this.getProcessList();
  },
  mounted() {
    if (this.$router.history.current.path !== "/shouye/home")
      this.$router.push("/shouye/home");
  },
};
</script>
<style scoped>
#footer-nav {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background: #fff;
  z-index: 999;
}
</style>