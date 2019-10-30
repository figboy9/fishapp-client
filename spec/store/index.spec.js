import Vuex from 'vuex'
import index from '../../store'
import { createLocalVue } from '@vue/test-utils'
import cloneDeep from 'lodash.clonedeep'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('store/index.js', () => {
  let store

  beforeEach(() => {
    store = new Vuex.Store(cloneDeep(index))
  })

  describe('mutations', () => {
    test('setIsLoggedIn ミューテーションに true がコミットされると、isLoggedIn ステートの値が true になる', () => {
      expect(store.getters.isLoggedIn).toBe(false)
      store.commit('setIsLoggedIn', true)
      expect(store.getters['isLoggedIn']).toBe(true)
    })
  })
})
