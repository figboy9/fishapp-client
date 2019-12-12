<template>
  <div id="post-cards">
    <v-card
      v-for="post in posts"
      :key="post.id"
      class="mx-auto"
      max-width="400"
    >
      <v-img
        class="white--text align-end"
        height="200px"
        src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
      >
        <v-card-title>{{ post.title }}</v-card-title>
      </v-img>

      <v-card-subtitle class="pb-0">Number 10</v-card-subtitle>

      <v-card-text class="text--primary">
        {{ post.content }}
      </v-card-text>

      <v-card-actions>
        <v-btn color="orange" text>
          Share
        </v-btn>

        <v-btn color="orange" text>
          <nuxt-link :to="`/posts/${post.id}`">Explore</nuxt-link>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
// import getPostsGql from '~/apollo/queries/getPosts.gql'
export default {
  async fetch({ store }) {
    await store.dispatch('posts/fetchPosts')
  },
  computed: {
    ...mapGetters('posts', ['posts'])
  }
}
</script>
