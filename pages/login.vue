<template>
  <v-form ref="form" v-model="valid">
    <nuxt-link to="/secret">a</nuxt-link>
    <p>{{ this.$store.getters.isLoggedIn }}</p>
    <v-container class="px-10 text-center">
      <h1>ログイン</h1>
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
      <v-btn width="200px" class="mt-4" @click="login">ログイン</v-btn>
    </v-container>
  </v-form>
</template>

<script>
export default {
  middleware: 'notAuth',
  data() {
    return {
      valid: false,
      name: '',
      nameRules: [
        (v) => !!v || '名前は必須です',
        (v) => v.length <= 10 || '名前は10文字以内です'
      ],
      email: '',
      validEmail: false,
      emailRules: [
        (v) => !!v || 'メールアドレスは必須です',
        (v) =>
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          ) || 'メールアドレスの形式が正しくありません',
        () => !this.validEmail || 'メールアドレスが登録されていません'
      ],
      password: '',
      validPass: false,
      passwordRules: [
        (v) => !!v || 'パスワードは必須です',
        (v) => v.length >= 6 || 'パスワードは6文字以上です',
        (v) => v.length <= 72 || 'パスワードは72文字以下です',
        () => !this.validPass || 'パスワードが違います'
      ]
    }
  },
  methods: {
    login() {
      if (!this.$refs.form.validate()) {
        return
      }
      this.$store
        .dispatch('login', {
          email: this.email,
          password: this.password
        })
        .then(() => {
          this.$router.push('/')
        })
        .catch((errors) => {
          errors.forEach((error) => {
            if (error.message.match(/record not found/)) {
              debugger
              this.validEmail = true
              this.$refs.form.validate()
              this.validEmail = false
            }
            if (error.message.match(/bcrypt/)) {
              this.validPass = true
              this.$refs.form.validate()
              this.validPass = false
            }
          })
        })
    }
  }
}
</script>
