import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
Vue.config.productionTip = false
Vue.use(ViewUI);
Vue.use(VueRouter)

const router = new VueRouter({
  root:'/',
  routes:[
    {
      path:'/',
      name:'login',
      component:()=> import('./components/login.vue')
    },
    {
      path:'/upload',
      name:'home',
      component:()=> import ('./components/UploadPage.vue')
    },{
      path:'/admin',
      name:'admin',
      component:()=>import('./components/admin.vue')
    }
  ]

})
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
