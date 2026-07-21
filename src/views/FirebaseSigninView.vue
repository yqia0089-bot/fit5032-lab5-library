<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-7 col-lg-6">
        <h1 class="mb-4 text-center">
          Firebase Sign In
        </h1>

        <div
          v-if="message"
          :class="[
            'alert',
            success ? 'alert-success' : 'alert-danger',
          ]"
        >
          {{ message }}
        </div>

        <form @submit.prevent="signInUser">
          <div class="mb-3">
            <label
              for="signin-email"
              class="form-label"
            >
              Email
            </label>

            <input
              id="signin-email"
              v-model.trim="email"
              type="email"
              class="form-control"
              required
            />
          </div>

          <div class="mb-3">
            <label
              for="signin-password"
              class="form-label"
            >
              Password
            </label>

            <input
              id="signin-password"
              v-model="password"
              type="password"
              class="form-control"
              required
            />
          </div>

          <button
            type="submit"
            class="btn btn-primary"
            :disabled="loading"
          >
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <div
          v-if="currentUser"
          class="card mt-4"
        >
          <div class="card-body">
            <h2 class="h5">
              Current Firebase User
            </h2>

            <p class="mb-1">
              <strong>Email:</strong>
              {{ currentUser.email }}
            </p>

            <p class="mb-1">
              <strong>UID:</strong>
              {{ currentUser.uid }}
            </p>

            <p class="mb-0">
              <strong>Role:</strong>
              {{ currentUser.role }}
            </p>

            <div
              v-if="currentUser.role === 'admin'"
              class="alert alert-warning mt-3 mb-0"
            >
              Signed in with the Admin role.
            </div>

            <div
              v-else
              class="alert alert-info mt-3 mb-0"
            >
              Signed in with the Member role.
            </div>
          </div>
        </div>

        <div
          v-else
          class="alert alert-secondary mt-4"
        >
          No Firebase user is currently signed in.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  onUnmounted,
  ref,
} from 'vue'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { auth } from '../Firebase/init'

defineOptions({
  name: 'FirebaseSigninView',
})

const email = ref('')
const password = ref('')
const loading = ref(false)
const message = ref('')
const success = ref(false)
const currentUser = ref(null)

const convertUser = (user) => {
  if (!user) {
    return null
  }

  return {
    uid: user.uid,
    email: user.email,
    role: user.displayName || 'member',
  }
}

const unsubscribe = onAuthStateChanged(
  auth,
  (user) => {
    currentUser.value = convertUser(user)

    console.log(
      'Current Firebase user:',
      user,
    )
  },
)

onUnmounted(() => {
  unsubscribe()
})

const signInUser = async () => {
  loading.value = true
  message.value = ''

  try {
    const userCredential =
      await signInWithEmailAndPassword(
        auth,
        email.value,
        password.value,
      )

    currentUser.value =
      convertUser(userCredential.user)

    success.value = true
    message.value = 'Sign in completed successfully.'

    console.log(
      'Firebase sign-in user:',
      userCredential.user,
    )
  } catch (error) {
    success.value = false
    message.value = `${error.code}: ${error.message}`

    console.error(
      'Firebase sign-in error:',
      error,
    )
  } finally {
    loading.value = false
  }
}
</script>