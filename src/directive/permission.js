// 自定义权限指令
import store from '@/store'

export default {
  //指令钩子
  inserted(el, binding) {
    const { value } = binding
    //用户所拥有的所有按钮权限
    const buttonList = store.getters && store.getters.buttonList

    if(value) {
      //some遇到return true 的终止遍历
      const hasPermission = buttonList.some(button => {
        return value === button
      })
      //无权限则移除元素
      if(!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error ('需要指定权限标识,如v-permission="article:add"')
    }
  }
}