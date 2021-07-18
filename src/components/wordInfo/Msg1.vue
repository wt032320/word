<template>
  <div class="msg1">
    <div class="header">
      <h2 ref="title">{{ wordInfo.eng_word }}</h2>
      <span class="iconfont iconxingshixin" :class="{ collect: false }"></span>
    </div>
    <div class="voice">
      <li>
        <span>英式: {{ wordInfo.pronunciation_uk }}</span>
        <img src="@/assets/img/audio.png" title="播放" @click="playEvent(1)" />
        <audio ref="audio1" :src="audio1"></audio>
      </li>
      <li>
        <span>美式: {{ wordInfo.pronunciation_us }}</span>
        <img
          src="@/assets/img/audio.png"
          title="播放"
          @click="playEvent(2)"
        /><audio ref="audio2" :src="audio2"></audio>
      </li>
    </div>
    <ul>
      <li v-for="(item, index) in chinese" :key="index">{{ item }}</li>
    </ul>
    <div class="tag">
      <span v-if="this.wordInfo.kaoyan === '1'">考研英语 /</span>
      <span v-if="this.wordInfo.cet4 === '1'">CET4 /</span>
      <span v-if="this.wordInfo.cet6 === '1'">CET6 /</span>
      <span v-if="this.wordInfo.shengben === '1'">专升本 /</span>
      <span v-if="this.wordInfo.gaokao === '1'">高考英语 /</span>
      <span v-if="this.wordInfo.zhongkao === '1'">中考 /</span>
      <span v-if="this.wordInfo.xiaoxue === '1'">小学</span>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      wordInfo: null,
      audio1: "",
      audio2: "",
      chinese: null,
    };
  },
  created() {
    this.wordInfo = this.$store.getters.searchResult;
    let word = this.wordInfo.eng_word;
    this.audio1 = `http://dict.youdao.com/dictvoice?audio=${word}&type=1`;
    this.audio2 = `http://dict.youdao.com/dictvoice?audio=${word}&type=2`;
    this.chinese = this.wordInfo.chinese && JSON.parse(this.wordInfo.chinese);
  },
  mounted() {
    let refs = this.$refs;
    refs.title.style.color = `rgb(${Math.random() * 256},${
      Math.random() * 256
    },${Math.random() * 256})`;
  },
  methods: {
    playEvent(tag) {
      this.$refs["audio" + tag].play();
    },
  },
};
</script>
<style scoped>
h2 {
  margin: 10px 10vw;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 4.6vw;
  vertical-align: baseline;
}
.iconfont.iconshouc {
  font-size: 6.25vw;
  margin: 10px 10vw;
}
.voice {
  font-size: 4vw;
  line-height: 4vw;
}
.voice img {
  width: 6.25vw;
  vertical-align: center;
}
.voice span {
  margin: 0 2vw;
  color: #a0a0a0;
}
.collect {
  color: tomato;
}
ul {
  padding: 0;
}
ul li {
  font-size: 3.75vw;
}
.tag {
  font-size: 3.125vw;
  color: #909399;
}
.tag span {
  margin-left: 1vw;
}
.msg1 {
  border-bottom: 0.1px solid rgba(66, 66, 66, 0.1);
  padding: 1vw;
}
</style>
