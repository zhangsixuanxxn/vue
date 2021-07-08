import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'
import {PcCookie, Key} from '@/utils/cookie'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = PcCookie.get(Key.accessTokenKey)

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // 获取用户信息
      const hasGetUserInfo = PcCookie.get(Key.userInfoKey)
      if (hasGetUserInfo) {
        //该用户是否已初始化权限菜单
        if(store.getters.init === false) {
          //获取用户拥有的权限菜单，调用vuex中的GetUserMenu
          store.dispatch('menu/GetUserMenu').then(() => {
            //继续访问目标路由且不会留下history记录
            next({...to, replace: true})
          })
        } else {
          next()
        }
        next()
      } else {
        // 没有用户信息则跳转登录客户端
        window.location.href = `${process.env.VUE_APP_AUTH_CENTER_URL}?redirectURL=${window.location.href}`
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      // next(`/login?redirect=${to.path}`)
      // 未认证，跳转认证客户端
      window.location.href = `${process.env.VUE_APP_AUTH_CENTER_URL}?redirectURL=${window.location.href}`
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
