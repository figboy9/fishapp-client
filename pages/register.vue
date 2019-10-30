<template>
  <v-form ref="form" v-model="valid">
    <nuxt-link to="/secret">a</nuxt-link>
    <p>{{ this.$store.getters.isLoggedIn }}</p>
    <button @click="logout">ログアウト</button>
    <!-- <p>{{ a }}</p> -->
    <v-container class="px-10 text-center">
      <h1>新規登録</h1>
      <v-row>
        <v-text-field
          v-model="name"
          :rules="nameRules"
          :counter="10"
          label="名前"
          required
        ></v-text-field>
      </v-row>
      <v-row>
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="メールアドレス"
          required
        ></v-text-field>
      </v-row>
      <v-row>
        <v-text-field
          v-model="password"
          :rules="passwordRules"
          :counter="6"
          label="パスワード"
          required
        ></v-text-field>
      </v-row>
      <v-btn width="200px" class="mt-4" @click="register">登録する</v-btn>
    </v-container>
  </v-form>
</template>

<script>
export default {
  data() {
    return {
      valid: false,
      name: '',
      nameRules: [
        (v) => !!v || '名前は必須です',
        (v) => v.length <= 10 || '名前は10文字以内です'
      ],
      email: '',
      emailUsed: false,
      emailRules: [
        (v) => !!v || 'メールアドレスは必須です',
        (v) =>
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          ) || 'メールアドレスの形式が正しくありません',
        () => !this.emailUsed || 'メールアドレスが使われています'
      ],
      password: '',
      passwordRules: [
        (v) => !!v || 'パスワードは必須です',
        (v) => v.length >= 6 || 'パスワードは6文字以上です',
        (v) => v.length <= 72 || 'パスワードは72文字以下です'
      ]
    }
  },
  computed: {},
  methods: {
    register() {
      if (!this.$refs.form.validate()) {
        return
      }
      this.$store
        .dispatch('register', {
          name: this.name,
          email: this.email,
          password: this.password
        })
        .then(() => {
          this.$router.push('/')
        })
        .catch((errors) => {
          errors.forEach((error) => {
            if (error.message.match(/Duplicate/)) {
              this.emailUsed = true
              this.$refs.form.validate()
              this.emailUsed = false
            }
          })
        })
    },
    logout() {
      this.$store.dispatch('logout')
    }
  }
}
</script>
