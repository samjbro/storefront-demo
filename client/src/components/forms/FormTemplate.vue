<template>
    <form class="form-template" @submit.prevent="$emit('onSubmit')" :class="{'form-template--error': failed}">
    <h1 class="form-template__header">
      <slot name="header" />
    </h1>
    <div class="form-template__fields">
      <slot name="fields" />
    </div>
    <div class="form-template__options">
      <slot name="options" />
    </div>
    <div class="form-template__error">
      {{ error }}
    </div>
    <button class="form-template__submit" type="submit">
      <slot name="submit" />
    </button>
    <div class="form-template__links">
      <slot name="links" />
    </div>
  </form>
</template>

<script>
export default {
  data () {
    return {
      failed: false,
      error: ''
    }
  },
  methods: {
    fail (message) {
      this.failed = true
      this.error = message
      setTimeout(() => {
        this.failed = false
      }, 1000)
    }
  }
}
</script>


<style lang="scss">
@import "~#/abstracts/variables";
@import "~#/abstracts/animations";
.form-template {
  display: flex;
  flex-direction: column;

  &--error {
    animation: shake .5s;
  }

  &__header {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 3.2rem;
  }

  &__fields {
    display: flex;
    flex-direction: column;
    margin-bottom: 2rem;
    
    input,
    textarea {
      &:not(:last-child) {
        margin-bottom: .8rem;
      }
      padding: 1.5rem 2rem;
      min-width: 30rem;
      border-radius: .4rem;
      border: 1px solid $color-gray-light;
      font-size: 1.4rem;
    }

    input {
      &::placeholder {
        text-align: center;
      }
    }
  }
  &__options {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0 auto;
    // padding-top: 1rem;
    // margin-bottom: 1rem;
    // padding: 1rem;
  }

  &__submit {
    background-color: $color-red;
    border-radius: 5rem;
    color: #fff;
    padding: 1.5rem;
    width: 75%;
    margin: 0 auto;
    margin-bottom: 3rem;
    cursor: pointer;
    font-size: 1.4rem;
    font-weight: 600;
  }
  &__error {
    min-height: 2rem;
    margin: 0 auto;
    margin-bottom: 1rem;
    color: $color-red;
  }

  &__links {
    a,
    a:link,
    a:visited {
      color: $color-red;
    }
    display: flex;
    justify-content: space-between;
  }
}
</style>
