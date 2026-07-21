<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-7">
        <h1 class="mb-4 text-center">
          Add Book to Firestore
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

        <form @submit.prevent="addBook">
          <div class="mb-3">
            <label
              for="isbn"
              class="form-label"
            >
              ISBN
            </label>

            <input
              id="isbn"
              v-model.number="isbn"
              type="number"
              class="form-control"
              min="1"
              required
            />
          </div>

          <div class="mb-3">
            <label
              for="book-name"
              class="form-label"
            >
              Book Name
            </label>

            <input
              id="book-name"
              v-model.trim="name"
              type="text"
              class="form-control"
              required
            />
          </div>

          <button
            type="submit"
            class="btn btn-primary"
            :disabled="loading"
          >
            {{ loading ? 'Adding...' : 'Add Book' }}
          </button>
        </form>
      </div>
    </div>

    <BookList
      :refresh-token="refreshToken"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  addDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../Firebase/init'
import BookList from '../components/BookList.vue'

defineOptions({
  name: 'AddBookView',
})

const isbn = ref(null)
const name = ref('')
const loading = ref(false)
const message = ref('')
const success = ref(false)
const refreshToken = ref(0)

const addBook = async () => {
  message.value = ''

  if (
    !Number.isFinite(isbn.value) ||
    isbn.value <= 0
  ) {
    success.value = false
    message.value =
      'ISBN must be a positive number.'

    return
  }

  if (!name.value) {
    success.value = false
    message.value =
      'Book name is required.'

    return
  }

  loading.value = true

  try {
    const documentReference =
      await addDoc(
        collection(db, 'books'),
        {
          isbn: isbn.value,
          name: name.value,
          createdAt: serverTimestamp(),
        },
      )

    success.value = true

    message.value =
      `Book added successfully. Document ID: ${documentReference.id}`

    isbn.value = null
    name.value = ''

    refreshToken.value += 1
  } catch (error) {
    success.value = false
    message.value = `${error.code}: ${error.message}`

    console.error(
      'Firestore add error:',
      error,
    )
  } finally {
    loading.value = false
  }
}
</script>