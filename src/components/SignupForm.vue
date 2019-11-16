<template>
  <v-form ref="form" v-model="valid">
    <v-container>
      <v-row>
        <p>{{ error }}</p>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="name"
            :rules="nameRules"
            :counter="10"
            label="Last name"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-btn @click="submit">登録</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
export default {
  props: {
    name: String,
    email: String
  },
  data: () => ({
    valid: false,
    name: '',
    nameRules: [
      (v) => !!v || 'Name is required',
      (v) => v.length <= 10 || 'Name must be less than 10 characters'
    ],
    email: '',
    emailRules: [
      (v) => !!v || 'E-mail is required',
      (v) => /.+@.+/.test(v) || 'E-mail must be valid'
    ],
    error: ''
  }),
  methods: {
    register(name, email) {
      this.$axios
        .$post('http://localhost:8000/register', {
          name: this.name,
          email: this.email
        })
        .then((res) => {
          localStorage.idToken = res.idToken
          localStorage.expiresInMin = res.expiresInMin
        })
        .catch(() => {
          alert('エラーが発生しました')
        })
    },
    submit() {
      this.$refs.form.validate()
    }
  }
}
</script>

<script>
export default {
  props: {
    title: String
  }
}
</script>
