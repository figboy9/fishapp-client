export default function({ store, error }) {
  if (process.server) {
    return
  }

  const Cookies = require('js-cookie')
  const idToken = Cookies.get('idToken')
  const refreshToken = Cookies.get('refreshToken')

  if (!refreshToken) {
    store.commit('setIsLoggedIn', false)
    return
  } else if (idToken) {
    store.commit('setIsLoggedIn', true)
    return
  }

  store
    .dispatch('refreshIdToken', refreshToken)
    .then((authData) => {
      store.dispatch('setCookies', authData)
    })
    .catch((err) => {
      error({
        statusCode: err.status,
        message: 'エラーだお'
      })
    })
}
