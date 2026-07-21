<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-7 col-lg-6">
        <h1 class="mb-4 text-center">
          Firebase Registration
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

        <form @submit.prevent="registerUser">
          <div class="mb-3">
            <label
              for="register-email"
              class="form-label"
            >
              Email
            </label>

            <input
              id="register-email"
              v-model.trim="email"
              type="email"
              class="form-control"
              required
            />
          </div>

          <div class="mb-3">
            <label
              for="register-password"
              class="form-label"
            >
              Password
            </label>

            <input
              id="register-password"
              v-model="password"
              type="password"
              class="form-control"
              minlength="6"
              required
            />

            <div class="form-text">
              Use at least six characters.
            </div>
          </div>

          <div class="mb-3">
            <label
              for="register-role"
              class="form-label"
            >
              User Role
            </label>

            <select
              id="register-role"
              v-model="role"
              class="form-select"
              required
            >
              <option
                disabled
                value=""
              >
                Select a role
              </option>

              <option value="member">
                Member
              </option>

              <option value="admin">
                Admin
              </option>
            </select>
          </div>

          <button
            type="submit"
            class="btn btn-primary"
            :disabled="loading"
          >
            {{ loading ? 'Registering...' : 'Register' }}
          </button>
        </form>

        <div
          v-if="registeredUser"
          class="card mt-4"
        >
          <div class="card-body">
            <h2 class="h5">
              Registered User
            </h2>

            <p class="mb-1">
              <strong>Email:</strong>
              {{ registeredUser.email }}
            </p>

            <p class="mb-1">
              <strong>UID:</strong>
              {{ registeredUser.uid }}
            </p>

            <p class="mb-0">
              <strong>Role:</strong>
              {{ registeredUser.role }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import { auth } from '../Firebase/init'

defineOptions({
  name: 'FirebaseRegisterView',
})

const email = ref('')
const password = ref('')
const role = ref('')
const loading = ref(false)
const message = ref('')
const success = ref(false)
const registeredUser = ref(null)

const registerUser = async () => {
  loading.value = true
  message.value = ''
  registeredUser.value = null

  try {
    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email.value,
        password.value,
      )

    await updateProfile(userCredential.user, {
      displayName: role.value,
    })

    registeredUser.value = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      role: userCredential.user.displayName,
    }

    success.value = true
    message.value = 'Registration completed successfully.'

    console.log(
      'Registered Firebase user:',
      userCredential.user,
    )

    email.value = ''
    password.value = ''
    role.value = ''
  } catch (error) {
    success.value = false
    message.value = `${error.code}: ${error.message}`

    console.error(
      'Firebase registration error:',
      error,
    )
  } finally {
    loading.value = false
  }
}
</script>