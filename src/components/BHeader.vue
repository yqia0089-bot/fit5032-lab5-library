<template>
  <div class="container">
    <header class="d-flex justify-content-between align-items-center py-3">
      <ul class="nav nav-pills">
        <li class="nav-item">
          <router-link to="/" class="nav-link" active-class="active">
            Home
          </router-link>
        </li>

        <li v-if="authenticated" class="nav-item">
          <router-link to="/about" class="nav-link" active-class="active">
            About
          </router-link>
        </li>

        <li v-if="!authenticated" class="nav-item">
          <router-link to="/login" class="nav-link" active-class="active">
            Login
          </router-link>
        </li>
      </ul>

      <button
        v-if="authenticated"
        type="button"
        class="btn btn-outline-danger"
        @click="handleLogout"
      >
        Logout
      </button>
    </header>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { isAuthenticated, logout } from '../services/auth'

const route = useRoute()
const router = useRouter()

const authenticated = ref(isAuthenticated())

watch(
  () => route.fullPath,
  () => {
    authenticated.value = isAuthenticated()
  }
)

const handleLogout = () => {
  logout()
  authenticated.value = false
  router.push({ name: 'Login' })
}
</script>
