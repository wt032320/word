<template>
  <div class="spell">
    <spe-item></spe-item>
  </div>
</template>
<script>
import speItem from "@/components/Spell/speItem.vue";
export default {
  components: { speItem },
  name: "spell",
  data() {
    return {};
  },
  created() {},
};
</script>
<style scoped>
.spell {
  padding: 5vw;
}
</style>