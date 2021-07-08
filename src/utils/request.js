import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import {PcCookie, Key} from '@/utils/cookie'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    // if (store.getters.token) {
    //   // let each request carry token
    //   // ['X-Token'] is a custom headers key
    //   // please modify it according to the actual situation
    //   config.headers['X-Token'] = getToken()
    // }
    //请求头添加访问令牌
    const accessTokenKey = PcCookie.get(Key.accessTokenKey)
    if(accessTokenKey) {
      //针对每个请求，请求头带上令牌 Authiorization: Bearer token
      config.headers.Authorization = 'Beader ' + accessTokenKey
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    // 非401未认证错误，直接放行
    if( error.response && error.response.status !== 404) {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }

    // 401错误 发送刷新令牌请求
    // 加锁，防止并发重复请求，true还未请求，false正在请求刷新令牌
    let isLock = true
    if( isLock && PcCookie.get(Key.refreshTokenKey) ) {
      //有刷新令牌,发送请求并上锁,跳转至认证中心请求refresh接口
      isLock = false
      window.location.href = `${process.env.VUE_APP_AUTH_CENTER_URL}/refresh?redirectURL=${window.location.href}`
    } else {
      //没有刷新令牌，直接跳转认证客户端
      window.location.href = `${process.env.VUE_APP_AUTH_CENTER_URL}?redirectURL=${window.location.href}`
    }
    return Promise.reject('令牌过期，请重新登录')
  }
)

export default service
