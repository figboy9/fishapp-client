const state = () => ({
  isLoggedIn: false,
  user: null
})

const mutations = {
  setUser(state, user) {
    state.user = user
  },
  setIsLoggedIn(state, bool) {
    state.isLoggedIn = bool
  }
}

const getters = {
  isLoggedIn: (state) => state.isLoggedIn
}

const actions = {
  async nuxtServerInit({ commit }, { $axios, req, res }) {
    console.log('EXP_SEC: ', process.env.expSec)
    console.log('RT_EXP_SEC: ', process.env.rtExpSec)
    console.log('プロセスエンブ: ', process.env)

    if (!req.headers.cookie) {
      commit('setIsLoggedIn', false)
      return
    }
    const cookieparser = require('cookieparser')
    const parsed = cookieparser.parse(req.headers.cookie)
    if (!parsed.refreshToken) {
      commit('setIsLoggedIn', false)
      return
    } else if (parsed.idToken) {
      commit('setIsLoggedIn', true)
      return
    }

    $axios.setToken(parsed.refreshToken, 'Bearer')
    const authData = await $axios.$post(
      'http://auth:9000/api/auth/refresh_id_token'
    )

    const cookie = require('cookie')
    const tokenExp = new Date()
    const rtExp = new Date()
    tokenExp.setSeconds(tokenExp.getSeconds() + Number(process.env.expSec))
    rtExp.setSeconds(tokenExp.getSeconds() + Number(process.env.rtExpSec))
    res.setHeader('Set-Cookie', [
      cookie.serialize('refreshToken', authData.refreshToken, {
        expires: rtExp
      }),
      cookie.serialize('idToken', authData.idToken, {
        expires: tokenExp
      })
    ])
    commit('setIsLoggedIn', true)
  },

  async refreshIdToken(_, refreshToken) {
    this.$axios.setToken(refreshToken, 'Bearer')
    const authData = await this.$axios.$post('auth/refresh_id_token')
    return authData
  },

  async register({ commit, dispatch }, formData) {
    const user = {
      name: formData.name,
      email: formData.email,
      password: formData.password
    }
    const authData = await this.$axios
      .$post('auth/register', user)
      .catch((err) => {
        return err.response
      })
    if (!authData.idToken) {
      throw authData.data.errors
    }

    commit('setUser', user)
    dispatch('setCookies', authData)
    commit('setIsLoggedIn', true)
  },

  setCookies({ context }, authData) {
    console.log('クライアント EXP_SEC: ', process.env.expSec)
    console.log('クライアント RT_EXP_SEC: ', process.env.rtExpSec)
    console.log('クライアント プロセスエンブ: ', process.env)
    const Cookies = require('js-cookie')
    const tokenExp = process.env.expSec / 86400
    const rtExp = process.env.rtExpSec / 86400
    Cookies.set('idToken', authData.idToken, {
      expires: Number(tokenExp)
    })
    Cookies.set('refreshToken', authData.refreshToken, {
      expires: Number(rtExp)
    })
  },
  logout({ commit }) {
    const Cookies = require('js-cookie')
    Cookies.remove('refreshToken')
    Cookies.remove('idToken')
    commit('setIsLoggedIn', false)
  },
  async login({ commit, dispatch }, formData) {
    const user = {
      email: formData.email,
      password: formData.password
    }
    const authData = await this.$axios
      .$post('auth/login', user)
      .catch((err) => {
        return err.response
      })
    if (!authData.idToken) {
      throw authData.data.errors
    }

    commit('setUser', user)
    dispatch('setCookies', authData)
    commit('setIsLoggedIn', true)
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
