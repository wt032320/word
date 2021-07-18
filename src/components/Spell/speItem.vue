<template>
  <div class="item">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="margin: 0 2vw">今日单词</span>
        <a href="#" @click="getDayWordList" class="iconfont iconrefresh">
          刷新
        </a>
        <el-button style="float: right; padding: 3px 0" type="text">
          <router-link :to="'/spInfo'">开始听写</router-link>
        </el-button>
      </div>
      <el-checkbox v-model="allSelect">全选</el-checkbox>

      <div class="main">
        <div v-for="(item, index) in wordList" :key="index" class="text item">
          <p>{{ item.eng_word + "   " }}{{ JSON.parse(item.chinese)[0] }}</p>
          <el-checkbox v-model="wordList[index].isSelected">选择</el-checkbox>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import axiosInstance from "@/network/axiosInstance.js";
export default {
  name: "item",
  data() {
    return {
      wordList: [],
      allSelect: false,
    };
  },
  created() {
    this.getDayWordList();
  },
  watch: {
    allSelect() {
      console.log(this.allSelect);
      this.wordList.forEach((el) => {
        if (this.allSelect) el.isSelected = true;
        else el.isSelected = false;
      });
    },
  },
  methods: {
    getDayWordList() {
      axiosInstance.get("getDayWordList").then((res) => {
        this.wordList = res;
        this.wordList.forEach((element) => {
          this.$set(element, "isSelected", false);
        });
      });
    },
  },
  updated() {
    this.$store.commit(
      "inputSpList",
      this.wordList.filter((el) => {
        return el.isSelected === true;
      })
    );
  },
};
</script>
<style scoped>
.text {
  overflow: scroll;
  font-size: 4vw;
}
.main {
  height: 100vw;
  overflow: scroll;
}
</style>