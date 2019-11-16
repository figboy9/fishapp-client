export default (ctx) => {
  for (const k in ctx.app.$env) {
    if (!process.env[k]) {
      process.env[k] = ctx.app.$env[k]
    }
  }
}
