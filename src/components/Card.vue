<template>
  <div class="border bg-white shadow-lg">
    <div class="px-4 py-5 space-y-6 sm:p-6">
      <slot/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'v-card'
})
</script>
