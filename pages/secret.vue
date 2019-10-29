<template>
  <v-container grid-list-xs>
    <h1>シークレットページ</h1>
  </v-container>
</template>

<script>
export default {
  middleware: 'auth',
  methods: {}
}
</script>
