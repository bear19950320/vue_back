import Vue from 'vue';
import iView from 'iview';
import Util from '@/libs/util';
import VueRouter from 'vue-router';
import Cookies from 'js-cookie';
import {routers, otherRouter, appRouter} from './router';

Vue.use(VueRouter);
// 在发送请求之前做某件事
Util.ajax.interceptors.request.use(config => {
    if (localStorage.token) {
        config.headers.Authorization = 'JWT ' + localStorage.token;
    }
    return config;
}, error => {
    this.$Notice.error({
        title: '操作失败',
        desc: '错误的传参'
    });
    return Promise.reject(error);
});
// 收到数据返回拦截器
Util.ajax.interceptors.response.use(response => {
    return response;
}, error => {
    switch (error.response.status) {
        case 401:
            // 401 说明未登录
            Cookies.remove('user');
            sessionStorage.clear();
            localStorage.clear();
            // 403 说明 token 验证失败
            router.push({name: 'login'});
            break;
        case 403:
            router.push({name: 'error-403'});
            break;
        case 404:
            router.push({name: 'error-404'});
            break;
        case 500:
            router.push({name: 'error-500'});
            break;
        default:
            break;
    }
    // 返回 response 里的错误信息
    return Promise.reject(error.response.data);
});

// 路由配置
const RouterConfig = {
    // mode: 'history',
    routes: routers
};

export const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.meta.title);
    if (Cookies.get('locking') === '1' && to.name !== 'locking') { // 判断当前是否是锁定状态
        next({
            replace: true,
            name: 'locking'
        });
    } else if (Cookies.get('locking') === '0' && to.name === 'locking') {
        next(false);
    } else {
        if (!Cookies.get('user') && to.name !== 'login') { // 判断是否已经登录且前往的页面不是登录页
            next({
                name: 'login'
            });
        } else if (Cookies.get('user') && to.name === 'login') { // 判断是否已经登录且前往的是登录页
            Util.title();
            next({
                name: 'home_index'
            });
        } else {
            const curRouterObj = Util.getRouterObjByName([otherRouter, ...appRouter], to.name);
            if (curRouterObj && curRouterObj.access !== undefined) { // 需要判断权限的路由
                if (Util.showThisRoute(curRouterObj.access, sessionStorage.authMenus)) {
                    Util.toDefaultPage([otherRouter, ...appRouter], to.name, router, next); // 如果在地址栏输入的是一级菜单则默认打开其第一个二级菜单的页面
                } else {
                    next({
                        replace: true,
                        name: 'error-403'
                    });
                }
            } else { // 没有配置权限的路由, 直接通过
                Util.toDefaultPage([...routers], to.name, router, next);
            }
        }
    }
});

router.afterEach((to) => {
    Util.openNewPage(router.app, to.name, to.params, to.query);
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});
