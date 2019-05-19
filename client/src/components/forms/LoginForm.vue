<template>
  <FormTemplate @onSubmit="login" ref="form">
    <template v-slot:header>Sign In</template>
    <template v-slot:fields>
      <input type="email" v-model="email" placeholder="Email" autofocus required>
      <input type="password" v-model="password" placeholder="Password" required>
    </template>
    <template v-slot:options>
      <div class="login-form__remember">
        <input type="checkbox" id="remember" v-model="remember">
        <label for="remember">Remember</label>
      </div>
    </template>
    <template v-slot:submit>
      <span>Sign In</span>
    </template>
    <template v-slot:links>
      <a class="login-form__link">Forgot password</a>
      <a class="login-form__link">Have an account</a>
    </template>
  </FormTemplate>
</template>

<script>
import { LOG_IN, SET_CURRENT_CUSTOMER, CLOSE_OVERLAY } from '@/apollo/operations'
import FormTemplate from './FormTemplate'
export default {
  components: { FormTemplate },
  data () {
    return {
      email: 'test999@turing.com',
      password: 'valid1234',
      // email: '',
      // password: '',
      remember: false
    }
  },
  methods: {
    async login () {
      try {
        const { data } = await this.$apollo.mutate({
          mutation: LOG_IN,
          variables: {
            data: {
              email: this.email,
              password: this.password
            }
          }
        })
        this.remember && localStorage.setItem('token', data.login.token)
        await this.$apollo.mutate({
          mutation: SET_CURRENT_CUSTOMER,
          variables: {
            customer: data.login.customer
          }
        })
        this.$apollo.mutate({
          mutation: CLOSE_OVERLAY
        })
      } catch (e) {
        this.$refs.form.fail(e.message.replace('GraphQL error: ', ''))
        console.error(e)
      }
    }
  }
}
</script>

<style lang="scss">
@import "~#/abstracts/variables";
.login-form {
  display: flex;
  flex-direction: column;

  &__remember {
    color: #B4B4B4;
    font-size: 1.2rem;
    font-weight: 600;
    margin: 0 auto;
    input {
      margin-right: .4rem;
    }
  }
}
</style>

