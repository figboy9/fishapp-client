<template>
  <v-form v-model="valid">
    <v-container>
      <v-row>
        <v-col cols="6" class="mx-auto">
          <v-text-field
            v-model="title"
            :counter="10"
            label="タイトル"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" class="mx-auto">
          <v-text-field
            v-model="content"
            :counter="10"
            label="本文"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-btn block @click="updatePost">更新する</v-btn>
    </v-container>
  </v-form>
</template>

<script>
// import { mapGetters } from 'vuex'
import getPost from '~/apollo/queries/posts/getPost.gql'
import updatePost from '~/apollo/queries/posts/updatePost.gql'
export default {
  data() {
    return {
      id: '',
      title: '',
      content: ''
    }
  },
  validate({ params }) {
    return /^\d+$/.test(params.id)
  },
  async asyncData({ app, params }) {
    const res = await app.apolloProvider.defaultClient.query({
      query: getPost,
      variables: {
        id: params.id
      }
    })
    return {
      id: res.data.post.id,
      title: res.data.post.title,
      content: res.data.post.content
    }
  },
  methods: {
    async updatePost({ params }) {
      console.log(this.id, this.title, this.content)
      const res = await this.$apollo.mutate({
        mutation: updatePost,
        variables: {
          id: this.id,
          title: this.title,
          content: this.content
        }
      })

      console.log(res.data.updatePost)
    }
  }
}
</script>
