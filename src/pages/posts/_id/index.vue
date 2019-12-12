<template>
  <v-card class="mx-auto" max-width="400">
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
        Explore
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
// import { mapGetters } from 'vuex'
import getPost from '~/apollo/queries/posts/getPost.gql'
export default {
  validate({ params }) {
    return /^\d+$/.test(params.id)
  },
  async asyncData({ app, params }) {
    const post = await app.apolloProvider.defaultClient.query({
      query: getPost,
      variables: {
        id: params.id
      }
    })
    return post.data
  }
}
</script>
