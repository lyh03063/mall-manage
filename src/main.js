import Vue from 'vue'
Vue.config.productionTip = false

import space from './components/space/index.js';   //默认情况下找的是index文件
Vue.use(space);   //必须有install
import VueRouter from 'vue-router'
Vue.use(VueRouter)


import login from "./login";
import manage from "./manage";
import listHome from "./page/listHome";
import listCategory from "./page/listCategory";
import listCommodity from "./page/listCommodity";
import listMember from "./page/listMember";
import listOrder from "./page/listOrder";
import listOrderData from "./components/list-data/list-order-data";
import listOrderCommodity from "./components/list-data/list-order-commodity";
import util from "./assets/js/util.js";

import list_lyh from "./page/list_lyh";
import list_cdc from "./page/list_cdc";
import list_cdx from "./page/list_cdx";
import list_dgx from "./page/list_dgx";
import list_dgz from "./page/list_dgz";
import list_hjp from "./page/list_hjp";
import list_lfh from "./page/list_lfh";
import list_lxc from "./page/list_lxc";
import list_wxd from "./page/list_wxd";
import list_xql from "./page/list_xql";
import list_zjw from "./page/list_zjw";
import list_zsr from "./page/list_zsr";

window.util=util;

// 3. 创建 router 实例，然后传 `routes` 配置
const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: login },
    {
      path: '/manage',
      component: manage,
      redirect: '/listHome', //跳转
      children: [//子路由
        {
          path: '/listHome',
          component: listHome
        },
        {
          path: '/listCommodity',
          component: listCommodity
        },
        {
          path: '/listCategory',
          component: listCategory,
        },
        {
          path: '/listOrderCommodity',
          component: listOrderCommodity,
        },
        {
          path: '/listMember',
          component: listMember
        },
        {
          path: '/list_lyh',
          component: list_lyh
        },
        {
          path: '/list_cdc',
          component: list_cdc
        },
        {
          path: '/list_cdx',
          component: list_cdx
        },
        {
          path: '/list_dgx',
          component: list_dgx
        },
        {
          path: '/list_dgz',
          component: list_dgz
        },
        {
          path: '/list_hjp',
          component: list_hjp
        },
        {
          path: '/list_lfh',
          component: list_lfh
        },
        {
          path: '/list_lxc',
          component: list_lxc
        },
        {
          path: '/list_wxd',
          component: list_wxd
        },
        {
          path: '/list_xql',
          component: list_xql
        },
        {
          path: '/list_zjw',
          component: list_zjw
        },
        {
          path: '/list_zsr',
          component: list_zsr
        },
        {
          path: '/listOrder',
          component: listOrder,
          children: [
            {
              path: '/listOrderData',
              component: listOrderData
            }
          ]
        }
      ]
    },
  ]
})


import axios from "axios";
window.axios = axios;

import Vuex from 'vuex'//导入vuex模块
Vue.use(Vuex)//应用组件

const store = new Vuex.Store({//定义Vuex的存储对象
  state: {
    activeMenuIndex: "",//当前激活的菜单index
    listState: {//存放列表的共享状态，

    },   
  },
  mutations: {//变更事件

    initListState(state, param) {//改变列表的初始状态值
      console.log("param", param);
      state.listState[param.listIndex] = param.objState;
      //对listState进行整个对象的变更（深拷贝），因为listState是有注册的，可以触发响应
      let str = JSON.stringify(state.listState)//对象转换成字符串
      state.listState = JSON.parse(str)//字符串转换成对象
    },
    changeActiveMenu(state, activeMenuIndex) {//改变聚焦菜单
      state.activeMenuIndex = activeMenuIndex
    },
    openDialogAdd(state, listIndex) {//打开新增弹窗事件
      state.listState[listIndex].isShowDialogAdd = true;
    },
    closeDialogAdd(state, listIndex) {//关闭新增弹窗事件
      state.listState[listIndex].isShowDialogAdd = false;
    },
    openDialogDetail(state, param) {//打开详情弹窗事件
      state.listState[param.listIndex].isShowDialogDetail = true;
      // state.listState[param.listIndex].tableDataDetail.forEach(doc => {
      //   //遍历详情弹窗的表格数据
      //   doc.itemValue = param.row[doc.field]; //修改itemValue
      // });
      state.listState[param.listIndex].row = param.row;//将行数据保存到vuex
    },
    closeDialogDetail(state, listIndex) {//关闭详情弹窗事件
      state.listState[listIndex].isShowDialogDetail = false;
    },
  }
})

Vue.prototype.$store = store//让vue实例中可访问$store
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);


import Main from './main.vue'
new Vue({
  render: h => h(Main),
  router,
}).$mount('#app')