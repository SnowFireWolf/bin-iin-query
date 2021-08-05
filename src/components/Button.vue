<template>
  <button class="w-full flex flex-row justify-center items-center p-3 bg-gray-900 text-white rounded shadow-lg focus:outline-none active:bg-gray-800 disabled:opacity-80" type="button">
    <slot/>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'v-button'
})
</script>
