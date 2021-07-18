<template>
  <div class="tabBar">
    <div
      class="item"
      v-for="(item, index) in tabBarMsg"
      :key="index"
      @click.stop="clickEvent1(index)"
      :class="{
        active: index === activeIndex,
      }"
    >
      <li><span :class="item.icon"></span></li>
      <li>{{ item.title }}</li>
    </div>
  </div>
</template>
<script>
export default {
  props: ["tabBarMsg"],
  data() {
    return {
      activeIndex: 0,
    };
  },
  methods: {
    clickEvent1(index) {
      this.activeIndex = index;
      let router = this.$router;
      if (
        router.history.current.path !==
        "/shouye" + this.tabBarMsg[index].path
      )
        router.push("/shouye" + this.tabBarMsg[index].path);
    },
  },
};
</script>
<style scoped>
.tabBar {
  display: flex;
  padding: 2vw;
  border-top: 0.2px solid rgba(66, 66, 66, 0.5);
}
.tabBar .item {
  flex: 1;
  text-align: center;
  opacity: 0.4;
}
.iconfont {
  font-size: 8.3vw;
}
.active {
  opacity: 1 !important;
  color: #409eff;
}
</style>