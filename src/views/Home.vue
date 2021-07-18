<template>
  <div class="home">
    <search></search>
    <plan-item></plan-item>
  </div>
</template>

<script>
// @ is an alias to /src
import Search from "@/components/Home/Search";
import PlanItem from "@/components/Home/PlanItem";
export default {
  name: "Home",
  components: {
    Search,
    PlanItem,
  },
  data() {
    return {};
  },
  created() {},
};
</script>
