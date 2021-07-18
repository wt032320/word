import Vue from 'vue';
import App from './App.vue';
import router from './router';
import "./assets/icon/iconfont.css";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from './store';
import EventBus from "@/utils/eventBus.js"
import EffectInput from 'effect-input'
import 'effect-input/dist/index.css'

Vue.use(EffectInput)
Vue.use(ElementUI);
Vue.config.productionTip = false;

Vue.prototype.eventBus = new EventBus();
new Vue({
  router,
  store,
  render: h => h(App),
  created() {
  }
}).$mount('#app')
