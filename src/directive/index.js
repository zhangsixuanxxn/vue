import permission from './permission'

export default (Vue) => {
  //添加权限制令 v-permission
  Vue.directive("permission", permission)
}