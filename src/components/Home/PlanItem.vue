<template>
  <div class="item">
    <div class="content" v-for="(item, index) in itemList" :key="index">
      <div class="imgWraper">
        <img :src="item.src" alt="" />
      </div>
      <div class="box">
        <el-progress :percentage="percentage[index]"></el-progress>
      </div>
      <div class="num">
        <p>{{ item.process }}</p>
        <p>{{ "进度" }}</p>
        <p>{{ item.count }}</p>
      </div>
      <div
        @click.stop="clickEvent(index)"
        style="display: flex; justify-content: center"
      >
        <el-button type="primary" plain disabled>开始学习</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import axiosInstance from "@/network/axiosInstance";
export default {
  name: "item",
  data() {
    return {
      itemList: null,
      percentage: {},
    };
  },
  created() {
    this.eventBus.on("leavePlanInfo", (args) => {
      this.percentage[args.type] = Number(
        ((args.process / this.itemList[args.type].count) * 100).toFixed(2)
      );
      this.itemList[args.type].process = args.process;
    });
    if (!sessionStorage.getItem("planList"))
      axiosInstance.get("/allPlans").then(
        (res) => {
          let keys = Object.keys(res);
          let planList = {};
          keys.forEach((el) => {
            planList[el] || (planList[el] = {});
            planList[el].count = res[el];
            planList[el].process = 0;
            planList[el].src = require("@/assets/img/" + el + ".png");
          });
          this.itemList = planList;
          sessionStorage.setItem("planList", JSON.stringify(planList));
        },
        (err) => {
          console.log(err);
        }
      );
    else this.itemList = JSON.parse(sessionStorage.getItem("planList"));
  },
  mounted() {},
  watch: {
    itemList() {
      let keys = Object.keys(this.itemList);
      let processMap = JSON.parse(sessionStorage.getItem("processMap"));
      keys.forEach((el) => {
        if (processMap[el]) {
          this.percentage[el] = Number(
            (
              (processMap[el].processIndex / this.itemList[el].count) *
              100
            ).toFixed(2)
          );
          this.itemList[el].process = processMap[el].processIndex;
        }
      });
    },
  },
  methods: {
    clickEvent(item) {
      this.$router.push({
        name: "planInfo",
        params: {
          type: item,
        },
      });
    },
  },
  updated() {},
};
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
}
.item {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-bottom: 18vw;
  text-align: center;
}
.content {
  width: 45%;
  margin: 1vw;
}
.imgWraper {
  width: 100%;
  height: 30vw;
}
.content img {
  width: 100%;
}
.box {
  width: 100%;
  height: 5vw;
  background-color: #fff;
}

.num {
  display: flex;
  justify-content: space-between;
  font-size: 3vw;
}
</style>
