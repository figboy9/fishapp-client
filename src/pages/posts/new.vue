<template>
  <v-form v-model="valid">
    <v-container class="mx-auto">
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
      <v-btn block @click="createPost">登録する</v-btn>
    </v-container>
  </v-form>
</template>

<script>
import createPost from '~/apollo/queries/posts/createPost.gql'
export default {
  data() {
    return {
      title: '',
      content: ''
    }
  },
  methods: {
    async createPost() {
      const post = await this.$apollo.mutate({
        mutation: createPost,
        variables: {
          title: this.title,
          content: this.content,
          user_id: 1
        }
      })
      console.log(post)
    }
  }
}
</script>
