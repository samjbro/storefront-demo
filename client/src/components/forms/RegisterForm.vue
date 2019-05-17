<template>
  <FormTemplate @onSubmit="register" ref="form">
    <template v-slot:header>Sign Up</template>
    <template v-slot:fields>
      <input type="text" v-model="name" placeholder="Name" autofocus required>
      <input type="email" v-model="email" placeholder="Email" required>
      <input type="password" v-model="password" placeholder="Password" required>
      <input type="password" v-model="passwordConfirmation" placeholder="Re-type password" required>
    </template>
    <template v-slot:submit>
      <span>Sign Up</span>
    </template>
    <template v-slot:links>
      <span>Already a member?</span>
      <a class="login-form__link">Sign In</a>
    </template>
  </FormTemplate>
</template>

<script>
import { REGISTER, SET_CURRENT_CUSTOMER, CLOSE_OVERLAY } from '@/apollo/operations'
import FormTemplate from './FormTemplate'
export default {
  components: { FormTemplate },
  data () {
    return {
      name,
      email: '',
      password: '',
      passwordConfirmation: ''
    }
  },
  methods: {
    async register () {
      try {
        if (this.password !== this.passwordConfirmation) {
          return this.$refs.form.fail('Passwords do not match')
        }
        const { data } = await this.$apollo.mutate({
          mutation: REGISTER,
          variables: {
            data: {
              name: this.name,
              email: this.email,
              password: this.password
            }
          }
        })
        localStorage.setItem('token', data.register.token)
        await this.$apollo.mutate({
          mutation: SET_CURRENT_CUSTOMER,
          variables: {
            customer: data.register.customer
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
