import getPostsGql from '~/apollo/queries/posts/getPosts.gql'

const state = () => ({
  posts: []
})
const mutations = {
  setPosts(state, posts) {
    state.posts = posts
  },
  addPost(state, post) {
    state.posts.push(post)
  }
}
const getters = {
  posts: (state) => state.posts,
  post: (state) => (id) => state.posts.find((p) => p.id === id)
}
const actions = {
  async fetchPosts({ commit }) {
    const res = await this.app.apolloProvider.defaultClient.query({
      query: getPostsGql
    })
    commit('setPosts', res.data.posts)
  },
  async fetchPost({ commit }, id) {
    const post = await this.$axios.$get(`/posts/${id}`)
    console.log(post)
    return post
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
