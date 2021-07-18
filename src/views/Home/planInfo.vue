<template>
  <div class="planInfo">
    <p class="iconfont icondirection-left" @click="backEvent"></p>
    <h2 ref="word"></h2>
    <span ref="pronunce"></span>
    <img src="@/assets/img/audio.png" title="播放" @click="playEvent" />
    <audio :src="audio" autoplay ref="audio"></audio>
    <div class="info">
      <span class="iconfont iconqiehuan" @click="checkEvent">{{ "查看" }}</span>
      <div v-show="exposed">
        <h4>中文释义</h4>
        <li v-for="(item, index) in chinese" :key="index">
          {{ item }}
        </li>
        <h4>短语搭配</h4>
        <li v-for="item in phrase" :key="item.eng">
          <span>{{ item.eng }}</span>
          <span>{{ item.ch }}</span>
        </li>
      </div>
    </div>
    <div class="footer">
      <li @click.stop="preWord">
        <el-button type="primary" icon="el-icon-arrow-left">上一个</el-button>
      </li>
      <li @click="skipToWordInfo"><el-button plain>单词详情</el-button></li>
      <li @click.stop="nextWord">
        <el-button type="primary"
          >下一个<i class="el-icon-arrow-right el-icon--right"></i
        ></el-button>
      </li>
    </div>
  </div>
</template>
<script>
import axiosInstance from "@/network/axiosInstance.js";
import { debounce } from "@/utils/debounce&throttling.js";
export default {
  data() {
    return {
      process: 0,
      type: "",
      wordList: [],
      showIndex: 0,
      audio: "",
      chinese: "",
      phrase: null,
      exposed: false,
      word: "",
      processMaps: {},
      words: [],
      records: [],
    };
  },
  methods: {
    backEvent() {
      this.$router.back();
    },
    playEvent() {
      this.$refs.audio.play();
    },
    checkEvent(e) {
      this.exposed = !this.exposed;
      let text = e.target.innerText;
      if (text.trim() === "查看") e.target.innerText = "隐藏";
      else e.target.innerText = "查看";
    },
    preWord() {
      if (this.showIndex === 0) alert("这是第一个");
      else --this.showIndex;
    },
    nextWord() {
      this.showIndex++;
      this.saveEvent();
    },
    changeIndex() {
      let wordInfo = this.words[this.showIndex];
      let word = wordInfo.eng_word;
      this.word = word;
      this.$refs.word.innerText = word;
      this.$refs.pronunce.innerText = wordInfo.pronunciation_uk;
      this.chinese = JSON.parse(wordInfo.chinese);
      this.phrase = JSON.parse(wordInfo.phrase);
      this.records.push({
        id: wordInfo.id,
        timestamp: new Date().getTime(),
      });
      this.audio = `http://dict.youdao.com/dictvoice?audio=${word}&type=1`;
    },
    getWordList() {
      if (localStorage.getItem("token") == "youke")
        axiosInstance
          .get(`/getWordList?count=${this.process}&type=${this.type}`)
          .then(
            (res) => {
              this.wordList.push(...res);
              this.process++;
              sessionStorage.setItem("wordList", JSON.stringify(this.wordList));
            },
            (err) => {
              console.log(err);
            }
          );
      else {
        axiosInstance
          .post("/saveRecords", {
            records: this.records,
          })
          .then((res) => {
            console.log(res);
            axiosInstance.get(`/userGetWordList?type=${this.type}`).then(
              (res) => {
                this.wordList.push(...res);
                sessionStorage.setItem(
                  "wordList",
                  JSON.stringify(this.wordList)
                );
              },
              (err) => {
                console.log(err);
              }
            );
          });
      }
    },

    skipToWordInfo() {
      axiosInstance.get(`/searchword?key=${this.word}`).then((res) => {
        this.$store.commit("getSearchMsg", res);
        this.$router.push("/wordInfo");
      });
    },
  },
  created() {
    this.type = this.$router.history.current.path.split("/")[3];
    this.typeProcess = JSON.parse(sessionStorage.getItem("planList"))[
      this.type
    ].process;
    this.processMaps = JSON.parse(sessionStorage.getItem("processMap"));
    this.processMaps || (this.processMaps = {});
    this.processMaps[this.type] || (this.processMaps[this.type] = {});
    let processMap = this.processMaps[this.type];
    this.showIndex =
      JSON.stringify(processMap) !== "{}" ? processMap.processIndex : 0;
    this.showIndex = this.showIndex || 0;
    this.process = JSON.stringify(processMap) !== "{}" ? processMap.process : 0;
    if (sessionStorage.getItem("wordList") === null) this.getWordList();
    else this.wordList = JSON.parse(sessionStorage.getItem("wordList"));
    this.saveEvent = debounce(() => {
      axiosInstance
        .post("/saveRecords", {
          records: this.records,
        })
        .then((res) => {
          console.log(res);
        });
    }, 5000);
  },
  watch: {
    wordList() {
      this.words = this.wordList.filter((el) => {
        return el[this.type] === "1";
      });
      this.changeIndex();
    },
    showIndex() {
      console.log(this.showIndex, this.wordList.length);
      console.log(this.words);
      if (this.showIndex / this.words.length > 0.8) this.getWordList();
      else {
        this.changeIndex();
      }
    },
  },
  beforeDestroy() {
    this.processMaps || (this.processMaps = {});

    this.processMaps[this.type]
      ? ((this.processMaps[this.type] = {}),
        (this.processMaps[this.type].processIndex = this.showIndex))
      : (this.processMaps = this.showIndex);
    this.processMaps[this.type]["process"] = this.process;
    sessionStorage.setItem("processMap", JSON.stringify(this.processMaps));
    if (localStorage.getItem("token") !== "youke") {
      axiosInstance
        .post("/saveProcess", {
          processMaps: this.processMaps,
        })
        .then((res) => {
          if (res.status === 401) {
            alert("登录已过期,请重新登录");
            this.$router.replace("/login");
          } else console.log(res);
        });
      this.saveEvent();
    }
    this.eventBus.emit("leavePlanInfo", {
      process: this.showIndex,
      type: this.type,
    });
  },
};
</script>
<style scoped>
.iconfont {
  width: 10vw;
  height: 10vw;
  font-size: 5vw;
}
.planInfo {
  position: relative;
  text-align: center;
  margin: 0;
}
h2 {
  color: #67c23a;
}
img {
  width: 5vw;
}
.planInfo span:nth-child(3) {
  margin: 0 2vw;
  color: #a0a0a0;
}
.planInfo span:nth-child(1) {
  color: #409eff;
  font-weight: bolder;
}
.info {
  padding: 4vw;
  font-size: 3.8vw;
}
span {
  margin-left: 2vw;
}
.footer {
  display: flex;
  position: fixed;
  justify-content: center;
  left: 50%;
  transform: translateX(-50%);
  bottom: 10vw;
  font-size: 3vw;
}
.footer li {
  margin: 0 1px;
}
</style>