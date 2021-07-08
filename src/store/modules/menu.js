import { PcCookie, Key } from '@/utils/cookie'
import { getUserMenuList } from '@/api/user'

// 定义状态
const state = {
  init: false, // 是否已加载用户菜单
  menuList: [], //当前用户拥有的菜单集合
  buttonList: [] // 当前用户拥有按钮集合
}

// 改变状态值
const mutations = {
  SET_SYSTEM_MENU: (state, data) => {
    state.init = true
    state.menuList = data.menuTreeList
    state.buttonList = data.buttonList
  }
}

// 定义行为
const actions = {
  //获取用户菜单列表
  GetUserMenu( {commit} ) {
    return new Promise ((resolve,reject) => {
      //获取用户ID
      const userId = PcCookie.get(Key.userInfoKey) ? JSON.parse( PcCookie.get(Key.userInfoKey) ).uid : null
      // 发送请求
      if(userId) {
        getUserMenuList(userId).then(response => {
          //保存目录菜单至vuex
          commit('SET_SYSTEM_MENU', response.data)
          resolve() // 正常响应的钩子
        }).catch(error => {
          //异常
          reject(error)
        })
      }
    })
  }
}

export default {
  namespaced: true, // 引用时需要模块名，既当前文件名 menu/getUserMenu
  state,
  mutations,
  actions
}