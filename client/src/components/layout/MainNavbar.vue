<template>
  <div class="main-navbar">
    <div class="main-navbar__logo">
      <img src="~img/logo-red.png" alt="ShopMate">
    </div>
    <div class="main-navbar__links">
      <a @click.prevent="">Women</a>
      <a @click.prevent="">Men</a>
      <a @click.prevent="">Kids</a>
      <a @click.prevent="">Shoes</a>
      <a @click.prevent="">Brands</a>
    </div>
    <div class="main-navbar__search">
      <img src="~img/icons-search-white.png" class="main-navbar__search-icon main-navbar__search-icon--left">
      <input type="text" placeholder="search anything" v-model="search" />
      <img
        @click="search = ''" 
        src="~img/icons-close-small-white.png" 
        class="main-navbar__search-icon main-navbar__search-icon--right"
      >
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      search: ''
    }
  }
}
</script>


<style lang="scss">
@import "~#/abstracts/variables";
.main-navbar {
  display: flex;
  justify-content: space-between;
  background-color: $color-black;
  color: $color-white;
  padding: 1.5rem 2.5rem;
  align-items: center;

  &__links {
    display: flex;
    align-items: center;
    font-weight: 600;

    & > * {
      &:not(:last-child) {
        margin-right: 1.5rem;
      }
    }
  }

  &__search {
    position: relative;
    input {
      background: rgba($color-white, .5);
      color: $color-white;
      border: 1px solid $color-gray-light;
      padding: .7rem 4rem;
      font-weight: 600;
      border-radius: 5rem;
      outline: none;
      &:focus {
        border: 1px solid $color-red;
      }
      &::placeholder {
        color: $color-white;

      }
    }
  }
  &__search-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);

    &--left {
      left: 1rem;
    }
    &--right {
      right: 1rem;
    }
  }
}
</style>
