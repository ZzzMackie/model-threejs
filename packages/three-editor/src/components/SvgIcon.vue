<script setup>
import { computed } from 'vue';
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: '1em'
  },
  color: {
    type: String,
    default: 'currentColor'
  },
  disableHover: {
    type: Boolean,
    default: false
  }
});
const symbolId = computed(() => `#icon-${props.name}`);
</script>
<template>
  <svg
    aria-hidden="true"
    :style="{ width: size, height: size }"
    class="svg-icon"
    :class="{ 'svg__icon-nothover': disableHover }"
    :fill="props.color"
    v-on="$attrs"
  >
    <use :xlink:href="symbolId" :fill="props.color" />
  </svg>
</template>

<style lang="scss">
.svg-icon {
  cursor: pointer;
  fill: currentColor;
  overflow: hidden;
  width: 1em;
  height: 1em;
  &:hover {
    color: var(--base-color);
  }
}
.svg__icon-nothover:hover {
  color: inherit;
}
</style>
