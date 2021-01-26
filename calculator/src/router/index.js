import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  routes: [
    ,{
      path: '/',
      component: () => import('@/views/cal.vue'),
      meta: {
        title: '房贷计算器'
      }
    },
  ]
})
