<template>
  <BHeader />

  <main class="container py-4">
    <router-view />
  </main>
</template>

<script setup>
import BHeader from './components/BHeader.vue'
</script>
