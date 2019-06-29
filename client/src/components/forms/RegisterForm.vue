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
      <span v-if="loading">
        <fa-icon :icon="['fas', 'spinner']" spin/>
      </span>
      <span v-else>Sign Up</span>
    </template>
    <template v-slot:links>
      <a class="login-form__link" @click="showOverlay('login')">Already have an account?</a>
    </template>
  </FormTemplate>
</template>

<script>
import {
  REGISTER,
  SET_CURRENT_CUSTOMER,
  CLOSE_OVERLAY,
  SHOW_OVERLAY
} from "@/apollo/operations";
import FormTemplate from "./FormTemplate";
export default {
  components: { FormTemplate },
  data() {
    return {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      loading: false
    };
  },
  methods: {
    async register() {
      this.loading = true;
      try {
        if (!this.name || !this.email || !this.password) return;
        if (this.password !== this.passwordConfirmation) {
          return this.$refs.form.fail("Passwords do not match");
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
        });
        localStorage.setItem("token", data.register.token);
        await this.$apollo.mutate({
          mutation: SET_CURRENT_CUSTOMER,
          variables: {
            customer: data.register.customer
          }
        });
        this.$apollo.mutate({
          mutation: CLOSE_OVERLAY
        });
        this.loading = false;
      } catch (e) {
        this.loading = false;
        this.$refs.form.fail(e.message.replace("GraphQL error: ", ""));
        console.error(e);
      }
    },
    showOverlay(view) {
      this.$apollo.mutate({
        mutation: SHOW_OVERLAY,
        variables: {
          view
        }
      });
    }
  }
};
</script>
