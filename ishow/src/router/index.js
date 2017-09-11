import Vue from 'vue';
import Router from 'vue-router';

/* layout*/
// import Layout from '../views/layout/Layout';

const IShow = resolve => require(['../views/ishow'], resolve);
const iShowList = resolve => require(['../views/ishow/list'], resolve);

/* error page*/
const Err404 = resolve => require(['../views/error/404'], resolve);
const Err401 = resolve => require(['../views/error/401'], resolve);

/* login*/
import Login from '../views/login/';

Vue.use(Router);

export default new Router({
  // mode: 'history', // 后端支持可开
  // history: true,
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/login', component: Login, hidden: true },
    { path: '/404', component: Err404, hidden: true },
    { path: '/401', component: Err401, hidden: true },

    {
      path: '/',
      component: iShowList,
      name: 'ishow列表',
      hidden: true
          // children: [{ path: 'ishow', component: iShowList }]
    },
    {
      path: '/ishow',
      component: IShow,
      name: 'ishow编辑器',
      hidden: true
          // children: [{ path: 'ishow', component: IShow }]
    },
    { path: '*', redirect: '/404', hidden: true }
  ]
});
