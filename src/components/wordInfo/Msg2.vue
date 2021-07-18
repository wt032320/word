<template>
  <div class="msg2">
    <ul class="nav">
      <li
        v-for="(item, index) in navList"
        :key="index"
        @click.stop="clickEvent(index)"
        :class="{ active: index === showIndex }"
      >
        {{ item }}
      </li>
    </ul>
    <div class="main" v-show="showIndex === 0">
      <p v-for="(item, index) in phrase" :key="index">
        <span>{{ item.eng }}</span
        ><span>{{ item.ch }}</span>
      </p>
    </div>
    <div class="main main1" v-show="showIndex === 1">
      <p v-for="(item, index) in synonym" :key="index">
        <span>{{ item }}</span>
      </p>
    </div>
    <div class="main main2" v-show="showIndex === 2">
      <p v-for="(item, index) in sameRootWord" :key="index">
        <span>{{ item.eng }}</span
        ><span>{{ item.ch }}</span>
      </p>
    </div>
  </div>
</template>
<script>
export default {
  name: "msg2",
  data() {
    return {
      navList: ["短语", "同义词", "同根词"],
      showIndex: 0,
      wordInfo: null,
      phrase: null,
      synonym: null,
      sameRootWord: null,
    };
  },
  created() {
    this.wordInfo = this.$store.getters.searchResult;
    this.phrase = this.wordInfo.phrase && JSON.parse(this.wordInfo.phrase);
    this.synonym = this.wordInfo && this.wordInfo.synonym.split(",");
    this.synonym && this.synonym.pop();
    this.sameRootWord =
      this.wordInfo.same_root_word && JSON.parse(this.wordInfo.same_root_word);
  },
  methods: {
    clickEvent(index) {
      this.showIndex = index;
    },
  },
};
</script>
<style scoped>
.nav {
  display: flex;
  padding: 3vw;
  margin: 0;
  font-size: 4vw;
  text-align: center;
}
.nav li {
  flex: 1;
  padding: 0 0 2vw 0;
}
.active {
  border-bottom: 2px solid tomato;
}
.main p {
  margin: 0;
  padding: 0;
  font-size: 4.1vw;
}
.main p span {
  margin: 1vw 2.5vw;
}
.main p span:nth-child(1) {
  color: #409eff;
  font-weight: bolder;
}
.main {
  border-bottom: 0.1px solid rgba(66, 66, 66, 0.1);
  padding: 1vw;
}
.main1 {
  text-align: center;
}
.main2 p span:nth-child(2) {
  font-size: 3.4vw;
}
</style>
