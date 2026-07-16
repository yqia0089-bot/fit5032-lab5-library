<template>
  <div class="text-center py-5">
    <h1>Access Denied</h1>

    <p class="mt-3">You need to log in before opening the members area.</p>

    <router-link :to="loginRoute" class="btn btn-primary">Go to Login</router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const loginRoute = computed(() => ({
  name: 'Login',
  query: {
    redirect: typeof route.query.redirect === 'string' ? route.query.redirect : '/about'
  }
}))
</script>
