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
      'http://auth:8080/api/auth/refresh_id_token'
    )
    console.log(authData)
    if (!authData.idToken) {
      console.log(authData.data)
      throw authData.data
    }
    const cookie = require('cookie')
    const tokenExp = new Date()
    const rtExp = new Date()
    tokenExp.setSeconds(tokenExp.getSeconds() + Number(this.$env.EXP_SEC))
    rtExp.setSeconds(tokenExp.getSeconds() + Number(this.$env.RT_EXP_SEC))
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
    const authData = await this.$axios.$post('/auth/refresh_id_token')
    return authData
  },

  async register({ commit, dispatch }, formData) {
    const authData = await this.$axios
      .$post('/auth/users', formData)
      .catch((err) => {
        return err.response
      })
    if (!authData.idToken) {
      throw authData.data
    }
    commit('setUser', { name: formData.name, emial: formData.email })
    dispatch('setCookies', authData)
    commit('setIsLoggedIn', true)
  },

  setCookies({ context }, authData) {
    const Cookies = require('js-cookie')
    const tokenExp = this.$env.EXP_SEC / 86400
    const rtExp = this.$env.RT_EXP_SEC / 86400
    Cookies.set('idToken', authData.idToken, {
      expires: Number(tokenExp)
    })
    Cookies.set('refreshToken', authData.refreshToken, {
      expires: Number(rtExp)
    })
  },

  async login({ commit, dispatch }, formData) {
    const user = {
      email: formData.email,
      password: formData.password
    }
    const authData = await this.$axios
      .$post('/auth/login', user)
      .catch((err) => {
        return err.response
      })
    if (!authData.idToken) {
      throw authData.data
    }

    commit('setUser', user)
    dispatch('setCookies', authData)
    commit('setIsLoggedIn', true)
  },

  logout({ commit }) {
    const Cookies = require('js-cookie')
    Cookies.remove('refreshToken')
    Cookies.remove('idToken')
    commit('setIsLoggedIn', false)
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
