<template>
  <div class="input">
    <div class="up">
      <el-input
        v-model="input"
        placeholder="查询单词"
        class="input-item"
        @input="inputEvent"
        clearable
      ></el-input>
      <el-button
        type="primary"
        icon="el-icon-search"
        class="search-button"
        @click="clickEvent"
        >搜索</el-button
      >
    </div>
    <div class="down" v-show="state" @click.stop="selectEvent">
      <p
        v-for="(item, index) in wordList"
        :key="index"
        style="border-bottom: 1px solid #ccc; margin: 1vw; padding: 1vw"
      >
        {{ item }}
      </p>
    </div>
  </div>
</template>
<script>
import axiosInstance from "@/network/axiosInstance.js";
import { debounce, throttling } from "@/utils/debounce&throttling.js";
export default {
  data() {
    return {
      input: "",
      wordList: [],
      state: false,
    };
  },
  created() {
    this.inputEvent = debounce(() => {
      if (this.input.length > 2)
        axiosInstance.get(`/guessWord?prefix=${this.input}`).then((res) => {
          this.wordList = res;
          this.state = true;
        });
      else this.state = false;
    }, 1000);
    this.clickEvent = throttling(() => {
      axiosInstance.get(`/searchword?key=${this.input}`).then((res) => {
        this.$store.commit("getSearchMsg", res);
        this.$router.push("/wordInfo");
      });
    }, 3000);
  },
  methods: {
    selectEvent(e) {
      this.input = e.target.innerText;
      this.clickEvent();
    },
  },
};
</script>
<style scoped>
.input {
  position: relative;
}
.up {
  display: flex;
  padding: 10px;
  text-align: center;
}
.down {
  position: absolute;
  padding: 4vw;
  width: 90vw;
  height: 90vw;
  background: #fff;
  overflow: scroll;
  z-index: 999;
  left: 50%;
  transform: translateX(-50%);
}
.input-item {
  width: 75%;
}
.search-button {
  width: 28%;
  font-size: 12px;
}
</style>