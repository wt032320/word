<template>
  <div id="app">
    <keep-alive include="shouye" exclude="item"
      ><router-view></router-view
    ></keep-alive>
  </div>
</template>
<script>
export default {
  name: "App",
};
</script>
<style>
li {
  list-style: none;
}
a {
  text-decoration: none;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
</style>
