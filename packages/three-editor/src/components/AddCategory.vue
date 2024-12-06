<script setup>
import { computed } from 'vue';

const emit = defineEmits(['change']);
const props = defineProps({
  title: {
    type: String,
    default: ''
  }
});
const modelValue = computed({
  get() {
    return props.title;
  },
  set(val) {
    emit('change', val);
  }
});
</script>

<template>
  <div class="add_category__wrap">
    <a-input v-model="modelValue"></a-input>
  </div>
</template>

<style lang="scss" scoped></style>
