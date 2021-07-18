<template>
  <div class="spInfo">
    <div class="header">
      <span @click="backEvent" class="iconfont icondirection-left"></span>
      <li>听写详情</li>
    </div>
    <div class="result" v-if="showResult">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>听写结果</span>
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            @click="exitEvent"
            >完成并退出</el-button
          >
        </div>
        <div v-for="(item, index) in resultList" :key="index" class="text item">
          {{
            item &&
            item.eng_word &&
            item.eng_word + "  ------  " + (item.spellWord || "")
          }}
          <span
            v-if="item.eng_word !== (item.spellWord && item.spellWord.trim())"
          >
            <svg
              t="1612346622408"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="1839"
              width="4vw"
              height="4vw"
            >
              <path
                d="M983.770726 312.685491a510.683064 510.683064 0 0 0-109.714207-162.742741A510.756207 510.756207 0 0 0 511.999634 0a510.829349 510.829349 0 0 0-362.056884 149.94275A510.756207 510.756207 0 0 0 0 511.999634a510.829349 510.829349 0 0 0 149.94275 362.056885A510.756207 510.756207 0 0 0 511.999634 1023.999269a510.829349 510.829349 0 0 0 362.056885-149.94275A510.756207 510.756207 0 0 0 1023.999269 511.999634c0-69.046808-13.458276-136.191903-40.228543-199.314143zM726.088624 680.301228a36.790831 36.790831 0 0 1 0 51.785106 36.790831 36.790831 0 0 1-51.785106 0l-166.91188-166.765595-166.765596 166.911881a36.790831 36.790831 0 0 1-51.785105 0 36.790831 36.790831 0 0 1 0-51.785106l166.765595-166.765595-166.911881-166.911881a36.790831 36.790831 0 0 1 0-51.785106 36.790831 36.790831 0 0 1 51.858249 0l166.765595 166.765595 166.692452-166.765595a36.790831 36.790831 0 0 1 51.785106 0 36.790831 36.790831 0 0 1 0 51.785106l-166.399881 166.765595 166.765595 166.765595z"
                fill="#EB130D"
                p-id="1840"
              ></path>
            </svg>
          </span>
          <span
            v-if="item.eng_word == (item.spellWord && item.spellWord.trim())"
            ><svg
              t="1612346693080"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="1964"
              width="4vw"
              height="4vw"
            >
              <path
                d="M512 1024a512 512 0 1 1 0-1024 512 512 0 0 1 0 1024zM377.514667 509.952a51.2 51.2 0 0 0-72.362667 72.362667l136.533333 136.533333a51.2 51.2 0 0 0 72.362667 0l273.066667-273.066667a51.2 51.2 0 0 0-72.362667-72.362666L477.866667 610.304 377.514667 509.952z"
                fill="#4AC940"
                p-id="1965"
              ></path></svg></span>
        </div>
      </el-card>
    </div>
    <div class="content" v-if="!showResult">
      <el-button plain @click="submitEvent">查看结果</el-button>
      <div class="main">
        <audio
          :src="`http://dict.youdao.com/dictvoice?audio=${
            wordList[showIndex] && wordList[showIndex].eng_word
          }&type=1`"
          autoplay
        ></audio>
        <effect-input
          v-model="value"
          type="hoshi"
          label="输入英文"
          style="width: 80%"
        ></effect-input>
        <p
          v-for="(item, index) in wordList[showIndex] &&
          JSON.parse(wordList[showIndex].chinese)"
          :key="index"
        >
          {{ item }}
        </p>
      </div>
      <div class="footer">
        <el-input-number
          v-model="swapTime"
          :min="1"
          style="opacity: 1"
          v-show="showRevise"
        ></el-input-number>
        <h3 style="width: 100%" @click.stop="reviseSwapTime">
          {{ ttl + " " }}秒后下一个
        </h3>
        <el-button type="primary" plain style="width: 80%" @click="clickEvent"
          >下一个</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "spInfo",
  data() {
    return {
      wordList: null,
      showIndex: 0,
      value: "",
      swapTime: 15,
      ttl: 15,
      showRevise: false,
      showResult: false,
      resultList: null,
      timer: null,
    };
  },
  created() {
    this.wordList = this.$store.getters.getSpList;
    let len = this.wordList.length;
    for (var i = 0; i < len; i++) {
      let temp = this.wordList[i];
      let randomIndex = parseInt(Math.random() * len);
      this.wordList[i] = this.wordList[randomIndex];
      this.wordList[randomIndex] = temp;
    }
  },
  mounted() {
    this.timer = setInterval(() => {
      --this.ttl;
      if (this.ttl === -1) {
        this.ttl = this.swapTime;
        this.wordList[this.showIndex].spellWord = this.value;
        this.showIndex++;
        if (this.showIndex == this.wordList.length) this.submitEvent();
        this.value = "";
      }
    }, 1000);
  },
  methods: {
    backEvent() {
      clearInterval(this.timer);
      this.$router.back();
    },
    clickEvent() {
      this.wordList[this.showIndex] &&
        (this.wordList[this.showIndex].spellWord = this.value);
      this.showIndex++;
      if (this.showIndex == this.wordList.length) this.submitEvent();
      this.ttl = this.swapTime;
      this.value = "";
    },
    reviseSwapTime() {
      this.showRevise = !this.showRevise;
    },
    submitEvent() {
      clearInterval(this.timer);
      if (this.showIndex === 0) this.showIndex = 1;
      this.wordList[this.showIndex - 1].spellWord = this.value;
      this.resultList = this.wordList.slice(0, this.showIndex);
      this.showResult = !this.showResult;
    },
    exitEvent() {
      clearInterval(this.timer);
      this.$router.back();
    },
  },
  watch: {},
};
</script>
<style scoped>
.header {
  border-bottom: 0.1px solid rgba(66, 66, 66, 0.5);
}
.header span {
  position: absolute;
  width: 32px;
  height: 32px;
  text-align: center;
  line-height: 32px;
}
.header li {
  height: 32px;
  text-align: center;
  line-height: 32px;
}
.iconfont {
  font-size: 5vw;
}
p {
  font-size: 3.5vw;
  margin: 0 2vw;
  opacity: 0.7;
  text-align: center;
}
.main {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 3vw;
}
.footer {
  position: fixed;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  left: 0;
  text-align: center;
  justify-content: center;
  bottom: 5vw;
}
</style>