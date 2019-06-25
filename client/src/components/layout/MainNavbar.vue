<template>
  <div class="main-navbar">
    <div class="main-navbar__logo">
      <img src="~img/logo-red.png" alt="ShopMate">
      <div class="main-navbar__hamburger">
        <fa-icon :icon="['fas', 'bars']" @click="dropdownExpanded = !dropdownExpanded"/>
      </div>
    </div>
    <div
      class="main-navbar__dropdown"
      :class="{'main-navbar__dropdown--expanded': dropdownExpanded}"
    >
      <div class="main-navbar__links">
        <a
          class="main-navbar__link"
          :class="{'main-navbar__link--active': searchTerms.department_id === 0}"
          :key="0"
          @click.prevent="showDepartment(0)"
        >All</a>
        <a
          v-for="department in departments"
          class="main-navbar__link"
          :class="{'main-navbar__link--active': searchTerms.department_id == department.department_id}"
          :key="department.department_id"
          @click.prevent="showDepartment(department.department_id)"
        >{{ department.name }}</a>
      </div>
      <div class="main-navbar__search">
        <img
          src="~img/icons-search-white.png"
          class="main-navbar__search-icon main-navbar__search-icon--left"
        >
        <input @input="debouncedInput" type="text" placeholder="search anything" v-model="search">
        <img
          @click="clear"
          src="~img/icons-close-small-white.png"
          class="main-navbar__search-icon main-navbar__search-icon--right"
        >
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from "@/utils";
import {
  GET_PRODUCTS,
  GET_SEARCH_TERMS,
  SET_SEARCH_TERMS,
  GET_DEPARTMENTS
} from "@/apollo/operations";
export default {
  data() {
    return {
      search: "",
      dropdownExpanded: false,
      debouncedInput: debounce(this.submitSearch, 500)
    };
  },
  methods: {
    clear() {
      this.search = "";
      this.submitSearch();
    },
    async submitSearch() {
      const { data } = await this.$apollo.mutate({
        mutation: SET_SEARCH_TERMS,
        variables: {
          data: {
            department_id: 0,
            category_id: 0,
            query_string: this.search
          }
        },
        update: (cache, data) => {
          console.log({ data });
        }
      });
    },
    showDepartment(id) {
      this.$apollo.mutate({
        mutation: SET_SEARCH_TERMS,
        variables: {
          data: {
            department_id: parseInt(id)
          }
        },
        update: (cache, { data: { setSearchTerms } }) => {
          // const department = this.departments.find(
          //   dept =>
          //     parseInt(dept.department_id) === setSearchTerms.department_id
          // );
          // let categories
          // if (!department) {
          //   categories =
          // }
          // const categories =
          // cache.writeData({
          //   data: {
          //     categories: department.categories
          //   }
          // });
        }
      });
    }
  },
  apollo: {
    departments() {
      return {
        query: GET_DEPARTMENTS
      };
    },
    searchTerms() {
      return {
        query: GET_SEARCH_TERMS,
        result({ data: { searchTerms } }) {
          this.search = searchTerms.query_string;
        }
      };
    }
  }
};
</script>


<style lang="scss">
@import "~#/abstracts/variables";
@import "~#/abstracts/mixins";
.main-navbar {
  display: flex;
  justify-content: space-between;
  background-color: $color-black;
  color: $color-white;
  padding: 1.5rem 2.5rem;
  align-items: center;

  @include respond(phone) {
    // flex-direction: column;
    display: block;
    padding-bottom: 0;
  }

  &__links {
    display: flex;
    align-items: center;
    font-weight: 600;
    flex: 1;
    @include respond(phone) {
      justify-content: center;
      padding: 2rem 0;
      font-size: 2rem;
    }
  }
  &__link {
    &:not(:last-child) {
      margin-right: 1.5rem;
    }
    &--active {
      color: $color-red;
    }
  }

  &__search {
    position: relative;
    display: flex;

    input {
      flex: 1;
      background: rgba($color-white, 0.5);
      color: $color-white;
      border: 1px solid $color-gray-light;
      padding: 0.7rem 4rem;
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
  &__logo {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    img {
      // height: 100%;
    }
    @include respond(phone) {
      // margin-bottom: 1rem;
      padding: 0 5rem 1rem 5rem;
      border-bottom: 1px solid $color-gray-med;
    }
  }
  &__dropdown {
    flex: 2;
    display: flex;
    justify-content: space-between;

    @include respond(phone) {
      display: block;
      max-height: 0;
      height: 12rem;
      transition: max-height 0.5s;
      &--expanded {
        max-height: 12rem;
      }
    }
  }
  &__hamburger {
    display: none;
    margin-right: 2rem;
    font-size: 2.5rem;
    @include respond(phone) {
      display: block;
    }
  }
}
</style>
