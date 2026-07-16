<template>
  <div class="row justify-content-center">
    <div class="col-12 col-md-6">
      <h1 class="mb-4">Library Login</h1>

      <div v-if="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="login-username" class="form-label">Username</label>

          <input
            id="login-username"
            v-model="username"
            type="text"
            class="form-control"
          />
        </div>

        <div class="mb-3">
          <label for="login-password" class="form-label">Password</label>

          <input
            id="login-password"
            v-model="password"
            type="password"
            class="form-control"
          />
        </div>

        <button type="submit" class="btn btn-primary">Login</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { login } from '../services/auth'

const route = useRoute()
const router = useRouter()

const username = ref('')
const password = ref('')
const errorMessage = ref('')

const handleLogin = () => {
  const success = login(username.value, password.value)

  if (!success) {
    errorMessage.value = 'Invalid username or password.'
    return
  }

  const redirectPath = typeof route.query.redirect === 'string' ? route.query.redirect : '/about'

  router.replace(redirectPath)
}
</script>
