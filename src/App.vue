<template>
  <BHeader />

  <main>
    <router-view />
  </main>
</template>

<script setup>
import BHeader from './components/BHeader.vue'

defineOptions({
  name: 'App',
})
</script>