import axios from 'axios'
import { Message } from 'element-ui'
import Router from '../../router/index.js'
import store from '../../store/index'

axios.interceptors.request.use(
  config => {
    return config
  },
  err => {
    Message.error({ message: '请求超时!' })
    return Promise.resolve(err)
  }
)
axios.interceptors.response.use(
  data => {
    if (data.data.status && data.data.status !== 200) {
      Message.error({ message: data.data.msg })
      return
    }
    return data
  },
  err => {
    if (err.response.status === 504) {
      Message.error({ message: '服务器被吃了⊙﹏⊙∥' })
    } else if (err.response.status === 403) {
      if (store.state.msgCount === 0) {
        Message.error({ message: '权限不足,请联系管理员!' })
        store.commit('addMsgCount')
      }
    } else if (err.response.status === 401) {
      Message.error({ message: '请重新登入!' })
      Router.replace('/')
    } else if (err.response.status === 402) {
      Message.error({ message: '异地登录, 请重新登入!' })
      Router.replace('/')
    } else if (err.response.status === 404) {
      Message.error({message: '未知请求路径'})
    } else {
      Message.error({ message: '未知错误!' })
    }
    return Promise.resolve(err)
  }
)

// 统一前缀
const base = ''

export const postRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    transformRequest: [
      function(data) {
        let ret = ''
        for (const it in data) {
          if (data[it]) {
            ret +=
              encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
          }
        }
        return ret
      }
    ],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
export const uploadFileRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
export const putRequest = (url, params) => {
  return axios({
    method: 'put',
    url: `${base}${url}`,
    data: params,
    transformRequest: [
      function(data) {
        let ret = ''
        for (const it in data) {
          if (data[it]) {
            ret +=
              encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
          }
        }
        return ret
      }
    ],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
export const deleteRequest = (url, parmas) => {
  return axios({
    method: 'delete',
    url: `${base}${url}`,
    data: parmas
  })
}
export const getRequest = url => {
  return axios({
    method: 'get',
    url: `${base}${url}`
  })
}
