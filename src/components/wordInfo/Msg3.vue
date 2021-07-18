<template>
  <div class="msg3">
    <p>单词例句</p>
    <div class="main">
      <p v-for="(item, index) in sentences" :key="index">
        {{ index + 1 }}.{{ item }}
      </p>
    </div>
  </div>
</template>
<script>
export default {
  name: "msg3",
  data() {
    return {
      sentences: null,
    };
  },
  created() {
    let wordInfo = this.$store.getters.searchResult;
    this.sentences = wordInfo && JSON.parse(wordInfo.sentence);
  },
};
</script>
<style scoped>
.msg3 > p {
  font-size: 3.9vw;
}
.main {
  font-size: 3.85vw;
  color: brown;
}
</style>