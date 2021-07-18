<template>
  <div class="search">
    <div class="header">
      <span @click="backEvent" class="iconfont icondirection-left"></span>
      <li>单词详情</li>
    </div>
    <msg-1></msg-1>
    <msg-2></msg-2>
    <msg-3></msg-3>
  </div>
</template>
<script>
import Msg1 from "@/components/wordInfo/Msg1.vue";
import Msg2 from "@/components/wordInfo/Msg2.vue";
import Msg3 from "@/components/wordInfo/Msg3.vue";

export default {
  name: "sousou",
  data() {
    return {
      wordInfo: null,
    };
  },
  components: {
    Msg1,
    Msg2,
    Msg3,
  },
  created() {
    this.wordInfo = this.$store.getters.searchResult;
  },
  methods: {
    backEvent() {
      this.$router.back();
    },
  },
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
</style>