<template>
  <div class="progress-bar">
    <div 
      class="progress-bar__progress"
    >
      <template
        v-for="(node, i) in nodes.length - 1"
      >
        <div
          :key="'circle-' + i"
          class="progress-bar__circle"
          :class="{'progress-bar__circle--filled': i === 0 || nodes[i - 1].complete}"/>
        <div :key="'line-' + i" 
          class="progress-bar__line"
          :class="{'progress-bar__line--filled': nodes[i].complete}"/>
      </template>
      <div 
          class="progress-bar__circle"
          :class="{'progress-bar__circle--filled': nodes[nodes.length - 1].complete}"/>
    </div>
    <div class="progress-bar__names">
      <div
        v-for="(node, i) in nodes" :key="i"
        class="progress-bar__name"
        :class="[
          { 'progress-bar__name--filled': i === 0 || nodes[i-1].complete },
          i < nodes.length / 2 ? 'progress-bar__name--left' : 'progress-bar__name--right'
        ]"
      >
        <span>{{ node.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    nodes: Array
  }
}  
</script>

<style lang="scss">
@import "~#/abstracts/variables";
.progress-bar {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &__progress {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
  }
  &__circle {
    width: 1.2rem;
    min-width: 1.2rem;
    height: 1.2rem;
    border-radius: 50%;
    background-color: $color-gray-light;
    &:not(:first-child) {
      margin-left: .4rem;
    }
    &:not(:last-child) {
      margin-right: .4rem;
    }
  }
  &__line {
    width: 100%;
    height: .5rem;
    background-color: $color-gray-light;
  }
  &__names {
    display: flex;
  }
  &__name {
    height: 3rem;
    flex: 1;
    text-align: center;
    transform: translate(-50%);
    font-weight: 600;

    &:first-child {
      transform: translateX(0);
      text-align: start;
    }
    &:last-child {
      right: 1.2rem; // Width of node circle
      position: absolute;
    }

    &--filled {
      color: $color-red;
    }
  }
  &__circle, &__line {
    &--filled {
      background-color: $color-red;
    }
  }
}
</style>
