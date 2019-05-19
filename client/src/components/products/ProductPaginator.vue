<template>
  <div class="product-paginator">
    <div
     class="product-paginator__arrow"
     :class="{'product-paginator__arrow--hidden': currentPage === 1 || numberOfButtons < 2}"
     @click="goTo(currentPage - 1)"
    >
      <img src="~img/arrow-left.svg" alt="Back">
      <span>Back</span>
    </div>
    <div class="product-paginator__pagenums">
      <div
        v-for="(page, i) in pageCountSelection"
        :key="page"
        @click="goTo(page)"
        class="product-paginator__pagenum"
        :class="{'product-paginator__pagenum--current': currentPage === page}"
      >
      {{ formatNumText(page, i) }}
      </div>
    </div>
    <div
     class="product-paginator__arrow"
     :class="{'product-paginator__arrow--hidden': currentPage === pageCount || numberOfButtons < 2}"
     @click="goTo(currentPage + 1)"
    >
      <span>Forward</span>
      <img src="~img/arrow-right.svg" alt="Forward">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    count: Number,
    currentPage: Number,
    limit: Number
  },
  data () {
    return {
      maxButtons: 7
    }
  },
  methods: {
    goTo(page) {
      if (page < 1 || page > this.pageCount) return
      this.$emit('goTo', page)
    },
    formatNumText(num, i) {
      if(this.numberOfButtons < this.limit) return num
      if (i+1 === 2 && num !== 2) return '...'
      if ((i+1 === this.numberOfButtons -1) && num !== this.pageCount -1) return '...'
      return num
    }
  },
  computed: {
    pageCount () {
      return Math.ceil(this.count / this.limit)
    },
    numberOfButtons () {
      return (this.count / this.limit) < this.maxButtons 
        ? Math.ceil(this.count / this.limit)
        : this.maxButtons
    },
    middleButton () {
      return Math.floor(this.numberOfButtons / 2)
    },
    pageCountSelection () {
      const selection = []
      let start, end = false
      let startNum = this.currentPage - this.middleButton
      if (this.currentPage <= this.middleButton + 1) {
        startNum = 1
        start = true
      }
      if (this.currentPage > (this.pageCount - this.middleButton - 1)) {
        startNum = this.pageCount - this.numberOfButtons + 1
        end = true
      }

      for (let i = 0; i < this.numberOfButtons; i++) {
        let page
        if (i === 0) page = 1
        else if (i === this.numberOfButtons - 1) page = this.pageCount
        else page = startNum + i
        selection.push(page)
      }

      return selection
    }
  }
}
</script>


<style lang="scss">
@import "~#/abstracts/variables";
.product-paginator {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 2rem;

  &__arrow {
    cursor: pointer;
    display: flex;
    align-items: center;  
    & > * {
      &:not(:last-child) {
        margin-right: .5rem;
      }
    }

    &--hidden {
      visibility: hidden;
    }
  }
  // background: red;
  &__pagenums {
    display: flex;
  }
  &__pagenum {
    &:first-child {
      margin-left: 1rem;
    }
    margin-right: 1rem;
    font-weight: 600;
    color: #000;
    height: 2rem;
    width: 2rem;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: transform 1s;
    cursor: pointer;

    &:hover {
      transform: scale(1.2);
    }

    &--current {
      color: $color-white;
      background: $color-red;
      transform: scale(1.2);
    }
  }
}
</style>
