<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-7 col-lg-6">
        <h1 class="mb-4 text-center">
          Firebase Account
        </h1>

        <div
          v-if="message"
          class="alert alert-success"
        >
          {{ message }}
        </div>

        <div
          v-if="currentUser"
          class="card"
        >
          <div class="card-body">
            <h2 class="h5">
              Current User
            </h2>

            <p class="mb-1">
              <strong>Email:</strong>
              {{ currentUser.email }}
            </p>

            <p class="mb-1">
              <strong>UID:</strong>
              {{ currentUser.uid }}
            </p>

            <p class="mb-3">
              <strong>Role:</strong>
              {{ currentUser.role }}
            </p>

            <div
              v-if="currentUser.role === 'admin'"
              class="alert alert-warning"
            >
              This account is signed in as an Admin.
            </div>

            <div
              v-else
              class="alert alert-info"
            >
              This account is signed in as a Member.
            </div>

            <button
              type="button"
              class="btn btn-danger"
              @click="logoutUser"
            >
              Log Out
            </button>
          </div>
        </div>

        <div
          v-else
          class="alert alert-secondary"
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
  signOut,
} from 'firebase/auth'
import { auth } from '../Firebase/init'

defineOptions({
  name: 'FirebaseAccountView',
})

const currentUser = ref(null)
const message = ref('')

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

const logoutUser = async () => {
  message.value = ''

  try {
    await signOut(auth)

    currentUser.value = null
    message.value = 'The user has been logged out.'

    console.log(
      'Current Firebase user after logout:',
      auth.currentUser,
    )
  } catch (error) {
    console.error(
      'Firebase logout error:',
      error,
    )
  }
}
</script>