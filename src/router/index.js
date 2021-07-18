import Vue from 'vue'
import VueRouter from 'vue-router'
import shouye from '../views/shouye.vue'
import home from "@/views/Home.vue"
Vue.use(VueRouter)

function beforeEnter(to, from, next) {
  if (localStorage.getItem("token"))
    next();
  else {
    next({
      path: "login"
    })

  }

}
const routes = [
  {
    path: "/",
    redirect: () => {
      if (localStorage.getItem("isLogin"))
        return "/shouye/home";
      else {
        return "/login";
      }
    }

  },
  {
    path: '/shouye',
    name: 'shouye',
    component: shouye,
    children: [
      {
        path: "home",
        component: home,
        beforeEnter,

      },
      {
        path: "statistics",
        component: () => import("@/views/Statistics.vue"),
        beforeEnter,
      },
      {
        path: "spelling",
        component: () => import("@/views/Spelling.vue"),
        beforeEnter,
      },
      {
        path: "my",
        component: () => import("@/views/My.vue"),
        beforeEnter,
      }
    ]
  },
  {
    name: 'Login',
    path: "/login",
    component: () => import("@/views/Login.vue"),
  },
  {
    name: "word",
    path: "/wordInfo",
    component: () => import("@/views/WordInfo.vue"),
  },
  {
    name: "planInfo",
    path: "/shouye/home/:type",
    component: () => import("@/views/Home/planInfo.vue"),
  },
  {
    name: "spInfo",
    path: "/spInfo",
    component: () => import("@/views/spellInfo.vue"),
  }

]
const router = new VueRouter({
  mode: "hash",
  routes
})

export default router
