import Vuex from 'vuex'
import { createLocalVue } from '@vue/test-utils'
import cloneDeep from 'lodash.clonedeep'
import user from '../../store/user'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('store/user.js', () => {
  let store

  beforeEach(() => {
    store = new Vuex.Store(cloneDeep(user))
  })

  describe('mutations', () => {
    test('setIsLoggedIn ミューテーションに true がコミットされると、isLoggedIn ステートの値が true になる', () => {
      expect(store.getters.isLoggedIn).toBe(false)
      store.commit('setIsLoggedIn', true)
      expect(store.getters.isLoggedIn).toBe(true)
    })
  })
})
