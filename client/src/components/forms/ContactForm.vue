<template>
  <FormTemplate @onSubmit="submit" ref="form">
    <template v-slot:header>Contact Us</template>
    <template v-slot:fields>
      <input type="text" v-model="name" placeholder="Name" autofocus required>
      <input type="email" v-model="email" placeholder="Email" autofocus required>
      <textarea name="message" id="message" placeholder="Your message" cols="30" rows="5"></textarea>
    </template>
    <template v-slot:submit>
      <span>Send</span>
    </template>
  </FormTemplate>
</template>

<script>
import FormTemplate from './FormTemplate'
export default {
  components: { FormTemplate },
  data () {
    return {
      name: '',
      email: '',
      message: ''
    }
  },
  methods: {
    submit () {
      this.$refs.form.fail('Functionality coming soon!')
    }
  }
}
</script>
